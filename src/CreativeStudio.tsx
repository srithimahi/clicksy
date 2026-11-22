import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { themes } from "./themes";
import { stickers, stickersByTheme } from "./stickers/index";
import {exportStrip} from "./exportStrip";
import { useHistory } from "./hooks/useHistory";
import { loadStudioData, saveStudioData, saveGalleryCreation, } from "./studioStorage";
import type { SavedStudioCreation as GallerySavedCreation } from "./creationTypes";

const PHOTO_FILTERS = {
    original: {
        name: "Original",
        description: "natural, unedited",
        css: "none",
    },
    blush: {
        name: "Blush",
        description: "a subtle rosy warmth",
        css: "sepia(0.08) saturate(1.06) brightness(1.03) contrast(0.97)",
    },
    soft: {
        name: "Soft",
        description: "bright and airy",
        css: "brightness(1.08) contrast(0.90) saturate(0.94)",
    },
    film: {
        name: "Film",
        description: "muted, nostalgic",
        css: "sepia(0.16) saturate(0.78) contrast(0.93)"
    },
    mono: {
        name: "Mono",
        description: "classic black and white",
        css: "grayscale(1) contrast(1.06) brightness(1.03)",
    },
} as const;

type PhotoFilterId = keyof typeof PHOTO_FILTERS;

type CreativeStudioProps = {
    onBack: () => void;
    photos: string[];
    isNewSession: boolean;
    initialCreation?: GallerySavedCreation | null;
}

type PlacedSticker = {
        id: number;
        assetId: string;
        x: number;
        y: number;
        size: number;
        rotation: number;
};

type PlacedText = {
    id: number;
    text: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
    font: string;
    color: string;
}

type StudioSnapshot = {
    stickers: PlacedSticker[];
    texts: PlacedText[];
    layers: StudioLayer[];
};

type StudioLayer = {
    id: number;
    type: "sticker" | "text";
};

type StudioLayerItem = {
    id: number;
    type: "sticker" | "text";
    name: string;
};

type SavedStudioCreation = {
    version: 1;
    id?: string;
    name?: string;
    createdAt?: number;
    thumbnail?: string;
    photos: string[];
    themeId: string;
    backgroundSelections: Record<string, string>;
    filterId: PhotoFilterId;
    showBranding: boolean;
    stickers: PlacedSticker[];
    texts: PlacedText[];
    layers: StudioLayer[];
};

const STUDIO_SAVE_KEY = "current-creation";

function createCreationId(): string {
    return crypto.randomUUID();
}

function getBackgroundStyle(background: {
    color: string;
    pattern: "solid" | "gingham";
    stripeColor?: string;
    overlapColor?: string;
}): CSSProperties {
    if(background.pattern === "solid") {
        return {
            backgroundColor: background.color,
            backgroundImage: "none",
        };
    }

    const stripe = background.stripeColor ?? background.color;
    const overlap = background.overlapColor ?? stripe;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="32" height="32" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="${background.color}"/>
            <rect width="16" height="32" fill="${stripe}"/>
            <rect width="32" height="16" fill="${stripe}"/>
            <rect width="16" height="16" fill="${overlap}"/>
        </svg>
    `;

    return {
        backgroundColor: background.color,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "32px 32px",
    };
}

export default function CreativeStudio({
    onBack,
    photos,
    isNewSession,
    initialCreation = null,
}: CreativeStudioProps) {
    const [selectedTheme, setSelectedTheme] = useState(themes[0]);
    const [backgroundSelections, setBackgroundSelections] = 
        useState<Record<string, string>>({});

    const selectedBackgroundId = backgroundSelections[selectedTheme.id] ?? selectedTheme.backgrounds[0]?.id;

    const selectedBackground = selectedTheme.backgrounds.find(
        (background) => background.id === selectedBackgroundId 
    ) ?? selectedTheme.backgrounds[0];
    const [selectedFilterId, setSelectedFilterId] = useState<PhotoFilterId>("original");
    const [showBranding, setShowBranding] = useState(true);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [creationName, setCreationName] = useState("my little creation");
    const [saveMessage, setSaveMessage] = useState(""); 
    const [studioReady, setStudioReady] = useState(false);
    const activeFilter = PHOTO_FILTERS[selectedFilterId].css;
    const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
    const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([]);
    const [layerOrder, setLayerOrder] = useState<StudioLayer[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const studioHistory = useHistory<StudioSnapshot>({
        stickers: [],
        texts: [],
        layers: [],
    });

    useEffect(() => {
        setPlacedStickers(studioHistory.current.stickers);
        setPlacedTexts(studioHistory.current.texts);
        setLayerOrder(studioHistory.current.layers);
    }, [studioHistory.current]);

    useEffect(() => {
        let cancelled = false;

        async function restoreCreation() {
            try {
                if(initialCreation) {
                    const saved = initialCreation;
                    const restoredTheme = themes.find((theme) => theme.id === saved.themeId);
                    if(restoredTheme) {
                        setSelectedTheme(restoredTheme);
                    }

                    setBackgroundSelections(saved.backgroundSelections ?? {});
                    if(saved.filterId in PHOTO_FILTERS) {
                        setSelectedFilterId(saved.filterId as PhotoFilterId);
                    }

                    setShowBranding(saved.showBranding);

                    studioHistory.reset({
                        stickers: saved.stickers ?? [],
                        texts: saved.texts ?? [],
                        layers: saved.layers ?? [],
                    });

                    return;
                }

                if(isNewSession) {
                    return;
                }

                const saved = await loadStudioData<SavedStudioCreation>(STUDIO_SAVE_KEY);
                if(!saved || saved.version !== 1 || cancelled) {
                    return;
                }

                const restoredTheme = themes.find((theme) => theme.id === saved.themeId);
                if(restoredTheme) {
                    setSelectedTheme(restoredTheme);
                }

                setBackgroundSelections(saved.backgroundSelections ?? {});
                if(saved.filterId in PHOTO_FILTERS) {
                    setSelectedFilterId(saved.filterId);
                }

                setShowBranding(saved.showBranding);
                studioHistory.reset({
                    stickers: saved.stickers ?? [],
                    texts: saved.texts ?? [],
                    layers: saved.layers ?? [],
                });
            } catch(error) {
                console.error("Could not restore your creation", error);
            } finally {
                if(!cancelled) {
                    setStudioReady(true);
                }
            }
        }

        void restoreCreation();

        return() => {
            cancelled = true;
        }
    }, [studioHistory.reset, isNewSession, initialCreation]);

    useEffect(() => {
        if(!studioReady) {
            return;
        }

        const timeout = window.setTimeout(() => {
            const creation: SavedStudioCreation = {
                version: 1,
                photos,
                themeId: selectedTheme.id,
                backgroundSelections,
                filterId: selectedFilterId,
                showBranding,
                stickers: studioHistory.current.stickers,
                texts: studioHistory.current.texts,
                layers: studioHistory.current.layers,
            };

            void saveStudioData(
                STUDIO_SAVE_KEY,
                creation
            ).catch((error) => {
                console.error("Could not autosave your creation: ", error);
            });
        }, 500);

        return() => window.clearTimeout(timeout);
    }, [
        studioReady,
        photos,
        selectedTheme,
        backgroundSelections,
        selectedFilterId,
        showBranding,
        studioHistory.current,
    ]);

    const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
    const selectedLayer = selectedTextId !== null ? {id: selectedTextId, type: "text" as const}
        : selectedStickerId !== null ? {id: selectedStickerId, type: "sticker" as const} : null;
    const selectedLayerIndex = selectedLayer ? layerOrder.findIndex((layer) =>
        layer.id === selectedLayer.id && layer.type === selectedLayer.type
    ) : -1;
    const selectedSticker = placedStickers.find((sticker) => sticker.id === selectedStickerId);
    const selectedText = placedTexts.find((text) => text.id === selectedTextId);
    const studioLayers = [...layerOrder].reverse().flatMap<StudioLayerItem>((layer) => {
        if(layer.type === "sticker") {
            const sticker = placedStickers.find((item) => item.id === layer.id);
            if(!sticker) {
                return [];
            }

            return[{
                id: layer.id,
                type: "sticker" as const,
                name: stickers.find(
                    (asset) => asset.id === sticker.assetId
                )?.name ?? "Unknown sticker",
            }];
        }

        const text = placedTexts.find((item) => item.id === layer.id);
        if(!text) {
            return [];
        }

        return[{
            id: layer.id,
            type: "text" as const,
            name: text.text || "Empty text",
        }];
    });

    useLayoutEffect(() => {
        if(!selectedText) {
            setTextControlBounds(null);
            return;
        }

        const textElement = Array.from(
            stripRef.current?.querySelectorAll<HTMLElement>(
                ".studio-placed-text"
            ) ?? []
        ).find(
            (element) =>
                    element.dataset.textId === String(selectedText.id)
        );

        const controlsLayer = textControlsLayerRef.current;

        if(!textElement || !controlsLayer) {
            return;
        }

        const textRect = textElement.getBoundingClientRect();
        const layerRect = controlsLayer.getBoundingClientRect();

        setTextControlBounds({
            x: textRect.left + textRect.width / 2 - layerRect.left,
            y: textRect.top + textRect.height / 2 - layerRect.top,
            width: textElement.offsetWidth,
            height: textElement.offsetHeight,
        });
    }, [
        selectedTextId,
        selectedText?.x,
        selectedText?.y,
        selectedText?.text,
        selectedText?.size,
        selectedText?.font,
        selectedText?.rotation,
    ]);
    const stripRef = useRef<HTMLDivElement>(null);
    const textControlsLayerRef = useRef<HTMLDivElement>(null);
    const [textControlBounds, setTextControlBounds] = useState<{
        x: number,
        y: number,
        width: number,
        height: number,
    } | null>(null);
    const controlsLayerRef = useRef<HTMLDivElement>(null);
    const draggingStickerId = useRef<number | null>(null);
    const textGestureStart = useRef<PlacedText[] | null>(null);
    const studioClipboard = useRef<
        | { type: "sticker"; item: PlacedSticker }
        | { type: "text"; item: PlacedText }
        | null
    >(null);
    const pasteCount = useRef(0);
    const textSliderStart = useRef<PlacedText[] | null>(null);
    const textDrag = useRef<{
        id: number;
        pointerId: number;
        startX: number;
        startY: number;
        originalX: number;
        originalY: number;
    } | null>(null);
    const textHandleDrag = useRef<{
        id: number,
        pointerId: number;
        mode: "resize" | "rotate";
        centerX: number;
        centerY: number;
        startDistance: number;
        startSize: number;
        startAngle: number;
        startRotation: number;
    } | null>(null); 
    const gestureStart = useRef<PlacedSticker[] | null>(null);

    const editingHandle = useRef<{
        id: number;
        mode: "resize" | "rotate";
        centerX: number;
        centerY: number;
        startDistance: number;
        startSize: number;
        startAngle: number;
        startRotation: number;
    } | null>(null);

    function commitStudioChange(
        nextStickers: PlacedSticker[],
        nextTexts: PlacedText[],
        nextLayers: StudioLayer[] = layerOrder
    ) {
        setPlacedStickers(nextStickers);
        setPlacedTexts(nextTexts);
        setLayerOrder(nextLayers);

        studioHistory.push({
            stickers: nextStickers,
            texts: nextTexts,
            layers: nextLayers,
        });
    }

    function commitStickerChange(nextStickers: PlacedSticker[]) {
        const ids = new Set(nextStickers.map((sticker) => sticker.id));
        const nextLayers = layerOrder.filter(
            (layer) => layer.type !== "sticker" || ids.has(layer.id)
        );
        commitStudioChange(nextStickers, placedTexts, nextLayers);
    }

    function commitTextChange(nextTexts: PlacedText[]) {
        const ids = new Set(nextTexts.map((text) => text.id));
        const nextLayers = layerOrder.filter(
            (layer) => layer.type !== "text" || ids.has(layer.id)
        );
        commitStudioChange(placedStickers, nextTexts, nextLayers);
    }

    function moveStudioLayer(
        id: number,
        type: "sticker" | "text",
        direction: "forward" | "backward"
    ) {
        const currentIndex = layerOrder.findIndex((layer) => layer.id === id && layer.type === type);
        if(currentIndex === -1) {
            return;
        }

        const nextIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;

        if(nextIndex < 0 || nextIndex >= layerOrder.length) {
            return;
        }

        const nextLayers = [...layerOrder];

        [nextLayers[currentIndex], nextLayers[nextIndex]] = [nextLayers[nextIndex], nextLayers[currentIndex],];
        commitStudioChange(placedStickers, placedTexts, nextLayers);
    }

    function duplicateSelectedLayer() {
        if(selectedStickerId !== null) {
            const original = placedStickers.find(
                (sticker) => sticker.id === selectedStickerId
            );

            if(!original) {
                return;
            }

            const copy = {
                ...original,
                id: Date.now() + Math.random(),
                x: Math.min(100, original.x + 5),
                y: Math.min(100, original.y + 5),
            };

            commitStudioChange(
                [...placedStickers, copy],
                placedTexts,
                [...layerOrder, {id: copy.id, type: "sticker"}]
            );

            setSelectedStickerId(copy.id);
            setSelectedTextId(null);
            return;
        }

        if(selectedTextId !== null) {
            const original = placedTexts.find(
                (text) => text.id === selectedTextId
            );

            if(!original) {
                return;
            }

            const copy = {
                ...original,
                id: Date.now() + Math.random(),
                x: Math.min(100, original.x + 5),
                y: Math.min(100, original.y + 5),
            };

            commitStudioChange(
                placedStickers,
                [...placedTexts, copy],
                [...layerOrder, {id: copy.id, type: "text"}]
            );

            setSelectedTextId(copy.id);
            setSelectedStickerId(null);
        }
    }

    function copySelectedLayer() {
        if(selectedTextId !== null) {
            const original = placedTexts.find((text) => text.id === selectedTextId);
            if(!original) {
                return;
            }

            studioClipboard.current = {
                type: "text",
                item: {...original},
            };
        } else if(selectedStickerId !== null) {
            const original = placedStickers.find((sticker) => sticker.id === selectedStickerId);
            if(!original) {
                return;
            }

            studioClipboard.current = {
                type: "sticker",
                item: {...original},
            };
        } else {
            return;
        }

        pasteCount.current = 0;
    }

    function pasteCopiedLayer() {
        const copied = studioClipboard.current;
        if(!copied) {
            return;
        }

        pasteCount.current += 1;
        const offset = pasteCount.current * 5;

        if(copied.type === "sticker") {
            const copy: PlacedSticker = {
                ...copied.item,
                id: Date.now() + Math.random(),
                x: Math.min(100, copied.item.x + offset),
                y: Math.min(100, copied.item.y + offset),
            };

            commitStudioChange(
                [...placedStickers, copy],
                placedTexts,
                [...layerOrder, {id: copy.id, type: "sticker"}]
            );

            setSelectedStickerId(copy.id);
            setSelectedTextId(null);
        } else {
            const copy: PlacedText = {
                ...copied.item,
                id: Date.now() + Math.random(),
                x: Math.min(100, copied.item.x + offset),
                y: Math.min(100, copied.item.y + offset),
            };

            commitStudioChange(
                placedStickers,
                [...placedTexts, copy], 
                [...layerOrder, {id: copy.id, type: "text"}]
            );

            setSelectedTextId(copy.id);
            setSelectedStickerId(null);
        }
    }

    function finishStickerGesture() {
        const before = gestureStart.current;
        gestureStart.current = null;

        if(!before) return;

        const changed = JSON.stringify(before) !== JSON.stringify(placedStickers);

        if(changed) {
            studioHistory.push({
                stickers: placedStickers,
                texts: placedTexts,
                layers: layerOrder,
            });
        }
    }

    function finishTextGesture() {
        const before = textGestureStart.current;
        textGestureStart.current = null;

        if(!before) return;

        const changed = JSON.stringify(before) !== JSON.stringify(placedTexts);

        if(changed) {
            studioHistory.push({
                stickers: placedStickers,
                texts: placedTexts,
                layers: layerOrder,
            });
        }
    }

    function finishTextTyping() {
        const before = textGestureStart.current;
        textGestureStart.current = null;

        if(!before) {
            return;
        }

        const changed = JSON.stringify(before) !== JSON.stringify(placedTexts);

        if(changed) {
            studioHistory.push({
                stickers: placedStickers,
                texts: placedTexts,
                layers: layerOrder,
            });
        }
    }

    function finishTextSlider() {
        const before = textSliderStart.current;
        textSliderStart.current = null;

        if(!before) {
            return;
        }

        if(JSON.stringify(before) !== JSON.stringify(placedTexts)) {
            studioHistory.push({
                stickers: placedStickers,
                texts: placedTexts,
                layers: layerOrder, 
            });
        }
    }

    useEffect(() => {
        function handleHistoryShortcuts(event: KeyboardEvent) {
            if(!(event.ctrlKey || event.metaKey)) {
                return;
            }

            if(event.key.toLowerCase() !== "z") {
                return;
            }

            const target = event.target;

            if(target instanceof HTMLElement && (
                target.isContentEditable ||
                ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
            )) {
                return;
            }

            if(event.altKey) {
                return;
            }

            event.preventDefault();

            if(event.shiftKey) {
                studioHistory.redo();
            } else {
                studioHistory.undo();
            }
        }

        window.addEventListener(
            "keydown",
            handleHistoryShortcuts
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleHistoryShortcuts
            );
        };
    }, [studioHistory.undo, studioHistory.redo]);

    useEffect(() => {
        function handleDeleteKey(event: KeyboardEvent) {
            if(event.key !== "Delete" && event.key !== "Backspace") {
                return;
            }

            const target = event.target;

            if(target instanceof HTMLElement &&
                (target.closest("input, textarea, select") ||
                    target.isContentEditable
                )
            ) {
                return;
            }

            if(event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            if(selectedTextId === null) {
                return;
            }

            event.preventDefault();

            commitTextChange(
                placedTexts.filter((text) => text.id !== selectedTextId)
            );

            setSelectedTextId(null);
            textHandleDrag.current = null;
            textDrag.current = null;
        }

        window.addEventListener("keydown", handleDeleteKey);

        return() => {
            window.removeEventListener("keydown", handleDeleteKey);
        };
    }, [selectedTextId, placedTexts, placedStickers, studioHistory.push]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if(
                event.key !== "Delete" &&
                event.key !== "Backspace"
            ) {
                return;
            }

            if(selectedStickerId === null) {
                return;
            }

            const target = event.target;

            if(
                target instanceof HTMLElement && (
                    target.isContentEditable ||
                    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
                )
            ) {
                return;
            }

            event.preventDefault();

            const nextStickers = placedStickers.filter(
                (sticker) => sticker.id !== selectedStickerId
            );

            commitStickerChange(nextStickers);
            setSelectedStickerId(null);
        }

        window.addEventListener("keydown", handleKeyDown);

        return() => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedStickerId, placedStickers, studioHistory.push]);

    useEffect(() => {
        function handleStudioShortcuts(event: KeyboardEvent) {
            const target = event.target;

            if(target instanceof HTMLElement && (
                target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
            )) {
                return;
            }

            if(event.key === "Escape") {
                setSelectedStickerId(null);
                setSelectedTextId(null);
                return;
            }

            if(!(event.ctrlKey || event.metaKey) || event.altKey) {
                return;
            }

            const key = event.key.toLowerCase();

            if(key === "c") {
                if(selectedStickerId === null && selectedTextId === null) {
                    return;
                }

                event.preventDefault();
                copySelectedLayer();
            }

            if(key === "v") {
                if(!studioClipboard.current) {
                    return;
                }

                event.preventDefault();
                pasteCopiedLayer();
            }

            if(key === "d") {
                if(selectedStickerId === null && selectedTextId === null) {
                    return;
                }

                event.preventDefault();
                duplicateSelectedLayer();
            }
        }

        window.addEventListener("keydown", handleStudioShortcuts);

        return() => {
            window.removeEventListener("keydown", handleStudioShortcuts);
        };
    }, [
        selectedStickerId,
        selectedTextId,
        placedStickers,
        placedTexts,
        layerOrder
    ]);

    function addSticker(assetId: string) {
        const newSticker: PlacedSticker = {
            id: Date.now() + Math.random(),
            assetId,
            x: 50,
            y: 50,
            size: 35,
            rotation: 0,
        };

        const nextStickers = [...placedStickers, newSticker];

        commitStudioChange(
            nextStickers,
            placedTexts,
            [...layerOrder, {id: newSticker.id, type: "sticker"}]
        );
        setSelectedStickerId(newSticker.id);
        setSelectedTextId(null);
    }

    function addTextSticker() {
        const newText: PlacedText = {
            id: Date.now() + Math.random(),
            text: "your text",
            x: 50,
            y: 50,
            size: 22,
            rotation: 0,
            font: "Georgia, serif",
            color: "#A85070",
        };

        commitStudioChange(
            placedStickers,
            [...placedTexts, newText],
            [...layerOrder, {id: newText.id, type: "text"}]
        );
        setSelectedTextId(newText.id);
        setSelectedStickerId(null);
    }

    function resizeSticker(id: number, newSize: number) {
        const size = Math.max(10, Math.min(100, newSize));

        setPlacedStickers((previous) =>
            previous.map((sticker) => 
                sticker.id === id ? { ...sticker, size } : sticker
            )
        )
    }

    function rotateSticker(id: number, newRotation: number) {
        setPlacedStickers((previous) =>
            previous.map((sticker) =>
                sticker.id === id
                    ? { ...sticker, rotation: newRotation }
                    : sticker
            )
        );
    }

    function moveSticker(
        event: PointerEvent<HTMLDivElement>,
        id: number
    ) {
        const strip = stripRef.current;
        if(!strip) return;

        const bounds = strip.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        setPlacedStickers((previous) =>
            previous.map((sticker) =>
                sticker.id === id
                ? {
                    ...sticker,
                    x: Math.max(0, Math.min(100, x)),
                    y: Math.max(0, Math.min(100, y)),
                } : sticker
            )
        );
    }

    function autoScrollWhileDebugging(clientY: number) {
        const edgeSize = 110;
        const scrollSpeed = 18;

        if(clientY < edgeSize) {
            window.scrollBy(0, -scrollSpeed);
        } else if(clientY > window.innerHeight - edgeSize) {
            window.scrollBy(0, scrollSpeed);
        }
    }

    function startHandleDrag(
        event: PointerEvent<HTMLButtonElement>,
        placed: PlacedSticker,
        mode: "resize" | "rotate"
    ) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.blur();

        gestureStart.current = placedStickers;

        const strip = stripRef.current;
        if(!strip) return;

        const bounds = strip.getBoundingClientRect();

        const centerX = bounds.left + (placed.x / 100) * bounds.width;
        const centerY = bounds.top + (placed.y / 100) * bounds.height;

        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        editingHandle.current = {
            id: placed.id,
            mode,
            centerX,
            centerY,
            startDistance: Math.max(1, Math.hypot(dx, dy)),
            startSize: placed.size,
            startAngle: Math.atan2(dy, dx),
            startRotation: placed.rotation,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function startTextHandleDrag(
        event: PointerEvent<HTMLButtonElement>,
        text: PlacedText,
        mode: "resize" | "rotate"
    ) {
        event.preventDefault();
        event.stopPropagation();

        textGestureStart.current = placedTexts;

        const textElement = Array.from(
            stripRef.current?.querySelectorAll<HTMLElement>(
                ".studio-placed-text"
            ) ?? []
        ).find(
            (element) => element.dataset.textId === String(text.id)
        );

        if(!textElement) {
            return;
        }

        const rect = textElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        textHandleDrag.current = {
            id: text.id,
            pointerId: event.pointerId,
            mode,
            centerX,
            centerY,
            startDistance: Math.max(1, Math.hypot(dx, dy)),
            startSize: text.size,
            startAngle: Math.atan2(dy, dx),
            startRotation: text.rotation,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveTextHandle(event: PointerEvent<HTMLButtonElement>) {
        const drag = textHandleDrag.current;

        if(!drag || drag.pointerId !== event.pointerId) {
            return;
        }

        const dx = event.clientX - drag.centerX;
        const dy = event.clientY - drag.centerY;

        if(drag.mode === "resize") {
            const distance = Math.hypot(dx, dy);
            const nextSize = Math.max(
                10,
                Math.min(100, drag.startSize * distance / drag.startDistance)
            );

            setPlacedTexts((previous) =>
                previous.map((item) =>
                    item.id === drag.id ? { ...item, size: Math.round(nextSize) } : item
                )
            );
        } else {
            const angle = Math.atan2(dy, dx);
            const degrees = (angle - drag.startAngle) * 180 / Math.PI;

            setPlacedTexts((previous) => 
                previous.map((item) =>
                    item.id === drag.id ? { ...item, rotation: drag.startRotation +degrees } : item
                )
            );
        }
    }

    function finishTextHandleDrag(event: PointerEvent<HTMLButtonElement>) {
        if(textHandleDrag.current?.pointerId === event.pointerId) {
            textHandleDrag.current = null;
            finishTextGesture();
        }

        if(event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function moveHandle(event: PointerEvent<HTMLButtonElement>) {
        const edit = editingHandle.current;
        if(!edit) return;

        const dx = event.clientX - edit.centerX;
        const dy = event.clientY - edit.centerY;

        if(edit.mode === "resize") {
            const distance = Math.hypot(dx, dy);
            const newSize = Math.max(
                10,
                Math.min(100, edit.startSize * (distance / edit.startDistance))
            );

            resizeSticker(edit.id, Math.round(newSize));
        } else {
            const angle = Math.atan2(dy, dx);

            const degrees = (angle - edit.startAngle) * (180 / Math.PI);

            rotateSticker(
                edit.id,
                Math.round(edit.startRotation + degrees)
            );
        }
    }

    function getStickerControlPosition(sticker: PlacedSticker) {
        const strip = stripRef.current;
        const controlsLayer = controlsLayerRef.current;

        if(!strip || !controlsLayer) {
            return null;
        }

        const stickerElement = Array.from(strip.querySelectorAll<HTMLElement>(".studio-sticker-wrapper"))
            .find((element) => element.dataset.stickerId === String(sticker.id));

        if(!stickerElement) {
            return null;
        }

        const stickerRect = stickerElement.getBoundingClientRect();
        const layerRect = controlsLayer.getBoundingClientRect();

        return {
            x: stickerRect.left + stickerRect.width / 2 - layerRect.left,
            y: stickerRect.top + stickerRect.height / 2 - layerRect.top,
        };
    }

    const isEditingSavedCreation = Boolean(initialCreation?.id);

    async function saveChanges() {
        if(!initialCreation?.id) {
            return;
        }

        const now = Date.now();

        let thumbnail: string | undefined;

        if(stripRef.current) {
            try {
                thumbnail = await exportStrip({
                    stripElement: stripRef.current,
                    stickers: placedStickers,
                    stickerAssets: stickers,
                    layers: layerOrder,
                    download: false,
                }) as string;
            } catch(error) {
                console.error("Could not generate thumbnail: ", error);
            }
        }

        const updatedCreation: SavedStudioCreation = {
            version: 1,
            id: initialCreation.id,
            name: initialCreation.name ?? "untitled memory",
            createdAt: initialCreation.createdAt ?? now,
            thumbnail: thumbnail ?? initialCreation.thumbnail,
            photos: [...photos],
            themeId: selectedTheme.id,
            backgroundSelections: { ...backgroundSelections },
            filterId: selectedFilterId,
            showBranding,
            stickers: placedStickers.map((sticker) => ({...sticker})),
            texts: placedTexts.map((text) => ({...text})),
            layers: layerOrder.map((layer) => ({...layer})),
        };

        try {
            setSaveMessage("");
            await saveGalleryCreation({
                id: initialCreation.id,
                name: updatedCreation.name ?? "untitled memory",
                createdAt: updatedCreation.createdAt ?? now,
                updatedAt: now,
                data: updatedCreation,
            });

            setSaveMessage("Changes saved successfully");
        } catch(error) {
            console.error("Could not save changes: ", error);
        }
    }

    async function saveToGallery() {
        const trimmedName = creationName.trim() || "untitled creation";
        const now = Date.now();

        let thumbnail: string | undefined;

        if(stripRef.current) {
            try {
                thumbnail = await exportStrip({
                    stripElement: stripRef.current,
                    stickers: placedStickers,
                    stickerAssets: stickers,
                    layers: layerOrder,
                    download: false,
                }) as string;
            } catch(error) {
                console.error("Could not generate a thumbnail: ", error);
            }
        }

        const creation: SavedStudioCreation = {
            version: 1,
            id: createCreationId(),
            name: trimmedName,
            createdAt: now,
            thumbnail,
            photos: [...photos],
            themeId: selectedTheme.id,
            backgroundSelections: {...backgroundSelections},
            filterId: selectedFilterId,
            showBranding,
            stickers: placedStickers.map((sticker) => ({...sticker})),
            texts: placedTexts.map((text) => ({...text})),
            layers: layerOrder.map((layer) => ({...layer})),
        };

        try {
            await saveGalleryCreation({
                id: creation.id!,
                name: trimmedName,
                createdAt: now,
                updatedAt: now,
                data: creation,
            });
            setShowSaveForm(false);
            setSaveMessage("Saved to my Creations");
            console.log("Creation saved successfully!", trimmedName);

        } catch(error) {
            setSaveMessage("Couldn't save your creation. Try again!")
            console.error("Could not save to gallery: ", error);
        }
    }

    async function downloadCreation() {
        if(!stripRef.current) return;

        try {
            await exportStrip({
                stripElement: stripRef.current,
                stickers: placedStickers,
                stickerAssets: stickers,
                layers: layerOrder,
            });
        } catch (error) {
            console.error("export failed: ", error);
        }
    } 

    return(
        <main className="studio-page"
            onPointerDown={(event) => {
                const target = event.target;

                if(
                    target instanceof Element &&
                    !target.closest(
                        ".studio-sticker-wrapper, .studio-placed-text, .studio-sidebar"
                    )
                ) {
                    setSelectedStickerId(null);
                }
            }}
        >
            <header className="studio-header">
                <button className="studio-back"
                    onClick={onBack}
                >
                    Back
                </button>

                <span className="studio-logo">clicksy</span>
            </header>

            <section className="studio-workspace">
                <div className="studio-preview">
                    <div className="studio-strip-editor">
                        <div className="studio-strip"
                        style={{
                            ...getBackgroundStyle(selectedBackground),
                            borderColor: selectedTheme.accentColor,
                        }}
                        ref={stripRef}
                        onPointerDown={(event) => {
                            const target = event.target;

                            if(
                                target instanceof Element &&
                                !target.closest(".studio-sticker-wrapper, .studio-placed-text")
                            ) {
                                setSelectedStickerId(null);
                            }
                        }}
                        >
                            {Array.from({ length: 4 }, (_, index) => (
                                <div className="studio-photo" key={index}>
                                    {photos[index] ? (
                                        <img src={photos[index]}
                                            alt={`Photo ${index+1}`}
                                            className="studio-photo-image"
                                            style={{ filter: activeFilter }}
                                        />
                                    ) : (
                                        <span>Photo {index + 1}</span>
                                    )}
                                </div>
                            ))}

                            <div className="studio-sticker-layer"
                                onPointerDown={(event) => {
                                    if(event.target === event.currentTarget) {
                                        setSelectedStickerId(null);
                                    }
                                }}
                            >
                                {placedStickers.map((placed) => {
                                    const asset = stickers.find(
                                        (item) => item.id === placed.assetId
                                    );

                                    if(!asset) return null;

                                    const selected = selectedStickerId === placed.id;

                                    return(
                                        <div key={placed.id}
                                            className={`studio-sticker-wrapper ${selected ? "selected" : ""}`}
                                            data-sticker-id={placed.id}
                                            style={{
                                                left: `${placed.x}%`,
                                                top: `${placed.y}%`,
                                                width: `${placed.size}px`,
                                                height: `${placed.size}px`,
                                                transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                                                zIndex: layerOrder.findIndex(
                                                    (layer) => layer.type === "sticker" && layer.id === placed.id
                                                ) + 1,
                                            }}
                                            onPointerDown={(event) => {
                                                if(event.target !== event.currentTarget) return;
                                                event.preventDefault();
                                                event.stopPropagation();

                                                gestureStart.current = placedStickers;
                                                draggingStickerId.current = placed.id;
                                                setSelectedStickerId(placed.id);
                                                setSelectedTextId(null);
                                                event.currentTarget.setPointerCapture(event.pointerId);
                                            }}
                                            onPointerMove={(event) => {
                                                if(draggingStickerId.current === placed.id) {
                                                    moveSticker(event, placed.id);
                                                }
                                            }}
                                            onPointerUp={(event) => {
                                                draggingStickerId.current = null;
                                                finishStickerGesture();

                                                if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                    event.currentTarget.releasePointerCapture(event.pointerId);   
                                                }   
                                            }}
                                            onPointerCancel={(event) => {
                                                draggingStickerId.current = null;
                                                finishStickerGesture();
                                            }}
                                        > 
                                            <img className="studio-placed-sticker"
                                                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset.svg)}`}
                                                alt={asset.name}
                                                draggable={false}
                                                onPointerDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();

                                                    draggingStickerId.current = placed.id;
                                                    setSelectedStickerId(placed.id);
                                                    setSelectedTextId(null);

                                                    event.currentTarget.parentElement?.setPointerCapture(
                                                        event.pointerId
                                                    )
                                                }}
                                                />
                                        </div>
                                    );
                                })}

                                {placedTexts.map((placed) => (
                                    <div key={placed.id}
                                        className={"studio-placed-text" + (selectedTextId === placed.id ? " selected" : "")}
                                        style={{
                                            left: `${placed.x}%`,
                                            top: `${placed.y}%`,
                                            fontSize: `${placed.size}px`,
                                            fontFamily: placed.font,
                                            color: placed.color,
                                            transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                                            zIndex: layerOrder.findIndex(
                                                (layer) => layer.type === "text" && layer.id === placed.id
                                            ) + 1,
                                        }}
                                        data-text-id={placed.id}
                                        onPointerDown={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();

                                            setSelectedTextId(placed.id);
                                            setSelectedStickerId(null);

                                            textGestureStart.current = placedTexts;

                                            textDrag.current={
                                                id: placed.id,
                                                pointerId: event.pointerId,
                                                startX: event.clientX,
                                                startY: event.clientY,
                                                originalX: placed.x,
                                                originalY: placed.y,
                                            };
                                            event.currentTarget.setPointerCapture(event.pointerId);
                                        }}
                                        onPointerMove={(event) => {
                                            const drag = textDrag.current;
                                            if (!drag || drag.id !== placed.id ||drag.pointerId !== event.pointerId) {
                                                return;
                                            }

                                            const strip = stripRef.current;
                                            if (!strip) return;

                                            const bounds = strip.getBoundingClientRect();

                                            const deltaX = ((event.clientX - drag.startX) / bounds.width) * 100;

                                            const deltaY = ((event.clientY - drag.startY) / bounds.height) * 100;

                                            const newX = Math.max(
                                                0,
                                                Math.min(100, drag.originalX + deltaX)
                                            );

                                            const newY = Math.max(
                                                0,
                                                Math.min(100, drag.originalY + deltaY)
                                            );

                                            setPlacedTexts((previous) =>
                                                previous.map((item) =>
                                                    item.id === placed.id
                                                        ? {
                                                            ...item,
                                                            x: newX,
                                                            y: newY,
                                                        }
                                                        : item
                                                )
                                            );
                                        }}
                                        onPointerUp={(event) => {
                                            if(textDrag.current?.pointerId === event.pointerId) {
                                                textDrag.current = null;
                                                finishTextGesture();
                                            }

                                            if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                event.currentTarget.releasePointerCapture(event.pointerId);
                                            }
                                        }}
                                        onPointerCancel={(event) => {
                                            if(textDrag.current?.pointerId === event.pointerId) {
                                                textDrag.current = null;
                                                finishTextGesture();
                                            }

                                            if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                event.currentTarget.releasePointerCapture(event.pointerId);
                                            }
                                        }}
                                    >
                                        {placed.text}
                                    </div>
                                ))}
                            </div>

                            {showBranding && (
                                <div className="studio-strip-brand"
                                    style={{
                                        color: selectedTheme.textColor,
                                    }}
                                >
                                    clicksy
                                </div>
                            )}
                        </div>

                        {selectedText && (
                            <div className="studio-text-controls-layer"
                                ref={textControlsLayerRef}
                            >
                                {textControlBounds && (
                                    <div className="studio-text-controls-wrapper"
                                        style={{
                                            left: `${textControlBounds.x}px`,
                                            top: `${textControlBounds.y}px`,
                                            width: `${textControlBounds.width}px`,
                                            height: `${textControlBounds.height}px`,
                                            transform: `translate(-50%, -50%) rotate(${selectedText.rotation}deg)`,
                                        }}
                                    >
                                        <button type="button"
                                            className="studio-rotate-handle"
                                            aria-label="Rotate text"
                                            onPointerDown={(event) => 
                                                startTextHandleDrag(event, selectedText, "rotate")
                                            }
                                            onPointerMove={moveTextHandle}
                                            onPointerUp={finishTextHandleDrag}
                                            onPointerCancel={finishTextHandleDrag}
                                        >
                                            ↻
                                        </button>

                                        <button type="button"
                                            className="studio-resize-handle"
                                            aria-label="Resize text"
                                            onPointerDown={(event) => 
                                                startTextHandleDrag(event, selectedText, "resize")
                                            }
                                            onPointerMove={moveTextHandle}
                                            onPointerUp={finishTextHandleDrag}
                                            onPointerCancel={finishTextHandleDrag}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedSticker && (
                            <div className="studio-edit-controls-layer"
                                ref={controlsLayerRef}
                            >
                                <div className="studio-edit-controls-wrapper"
                                    style={{
                                        left: `${selectedSticker.x}%`,
                                        top: `${selectedSticker.y}%`,
                                        width: `${selectedSticker.size}px`,
                                        height: `${selectedSticker.size}px`,
                                        transform: `translate(-50%, -50%) rotate(${selectedSticker.rotation}deg)`,
                                    }}
                                >
                                    <button type="button"
                                        className="studio-resize-handle"
                                        aria-label="Resize sticker"
                                        onPointerDown={(event) =>
                                            startHandleDrag(event, selectedSticker, "resize")
                                        }
                                        onPointerMove={moveHandle}
                                        onPointerUp={(event) => {
                                            editingHandle.current = null;
                                            finishStickerGesture();
                                            if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                event.currentTarget.releasePointerCapture(event.pointerId);
                                            }
                                        }}
                                    />

                                    <button type="button"
                                        className="studio-rotate-handle"
                                        aria-label="Rotate sticker"
                                        onPointerDown={(event) =>
                                            startHandleDrag(event, selectedSticker, "rotate")
                                        }
                                        onPointerMove={moveHandle}
                                        onPointerUp={(event) => {
                                            editingHandle.current = null;
                                            finishStickerGesture();

                                            if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                event.currentTarget.releasePointerCapture(event.pointerId);
                                            }
                                        }}
                                    >
                                        ↻
                                    </button>
                                </div>
                            </div>
                        )}

                        
                    </div>
                </div>

                <aside className="studio-sidebar">
                    <section className="studio-intro">
                        <span className="studio-eyebrow">
                            Creative Studio
                        </span>

                        <h1>a space to make your moment yours!</h1>
                    </section>
                    <div className="studio-panel-heading">
                        <span className="studio-panel-label">
                            Your theme
                        </span>

                        <h2>choose a mood</h2>

                        <p>
                            each theme has its own color, frame, and even tiny details
                        </p>
                    </div>

                    <div className="studio-theme-list">
                        {themes.map((theme) => (
                            <button key={theme.id}
                                className={`studio-theme-card ${
                                    selectedTheme.id === theme.id
                                    ? "selected"
                                    : ""
                                }`}

                                onClick={() => {
                                    setSelectedTheme(theme);
                                }}
                            >
                                <span className="studio-theme-swatch"
                                    style={{
                                        backgroundColor: theme.backgroundColor,
                                    }}
                                />

                                <span className="studio-theme-name">
                                    {theme.name}
                                </span>

                                <span className="studio-theme-arrow">
                                    {selectedTheme.id === theme.id
                                    ? "selected"
                                    : "select"}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="studio-background-panel">
                        <span className="studio-panel-label">
                            backgrounds
                        </span>

                        <h2>pick your backdrop</h2>

                        <div className="studio-background-list">
                            {selectedTheme.backgrounds.map((background) => (
                                <button key={background.id}
                                    type="button"
                                    className={`studio-background-option ${
                                        selectedBackground.id === background.id ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                        setBackgroundSelections((previous) => ({
                                            ...previous,
                                            [selectedTheme.id]: background.id,
                                        }));
                                    }}
                                >
                                    <span className="studio-background-swatch"
                                        style={getBackgroundStyle(background)}
                                    />

                                    <span className="studio-background-name">
                                        {background.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="studio-theme-details">
                        <span className="studio-panel-label">
                            details
                        </span>

                        <p>
                            frame: {selectedTheme.framePattern}
                        </p>

                        <p>
                            filter: {selectedTheme.filter}
                        </p>

                        <p>
                            {selectedTheme.stickers.length} stickers in this collection
                        </p>
                    </div>

                    <div className="studio-filters-panel">
                        <span className="studio-panel-label">
                            photo filters
                        </span>

                        <h2>find your mood!</h2>
                        
                        <div className="studio-filter-grid">
                            {(
                                Object.entries(PHOTO_FILTERS) as [
                                    PhotoFilterId,
                                    (typeof PHOTO_FILTERS)[PhotoFilterId]
                                ][]
                            ).map(([id, filter]) => (
                                <button key={id}
                                    type="button"
                                    className={`studio-filter-option ${
                                        selectedFilterId === id ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedFilterId(id)}
                                    aria-pressed={selectedFilterId === id}
                                >
                                    <div className="studio-filter-thumbnail">
                                        {photos[0] ? (
                                            <img src={photos[0]}
                                                alt=""
                                                style={{ filter: filter.css }}
                                            />    
                                        ) : (
                                            <span>{filter.name}</span>
                                        )}
                                    </div>

                                    <span className="studio-filter-name">
                                        {filter.name}
                                    </span>

                                    <span className="studio-filter-description">
                                        {filter.description}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="studio-sticker-panel">
                        <span className="studio-panel-label">stickers</span>
                        <h2>stickers</h2>

                        <div className="studio-sticker-list">
                            {stickersByTheme[
                                selectedTheme.id as keyof typeof stickersByTheme
                            ]?.map((sticker) => (
                                <button key={sticker.id} 
                                    type="button"
                                    className="studio-sticker-item"
                                    onClick={() => addSticker(sticker.id)}
                                >
                                    <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                                            sticker.svg
                                        )}`}
                                        alt={sticker.name}
                                    />
                                    <span>{sticker.name}</span>

                                    <span className="studio-sticker-count">
                                        {placedStickers.filter(
                                            (placed) => placed.assetId === sticker.id
                                        ).length} on strip
                                    </span>
                                </button>
                            ))}

                            <button type="button"
                                className="studio-sticker-item studio-text-sticker-item"
                                onClick={addTextSticker}
                            >
                                <span className="studio-text-sticker-icon">
                                    Aa
                                </span>

                                <span>Text</span>

                                <span className="studio-sticker-count">
                                    {placedTexts.length} on strip
                                </span>
                            </button>
                        </div>

                        {selectedStickerId !== null && (
                            <div className="studio-size-control">
                                <label htmlFor="sticker-size">
                                    sticker size
                                </label>

                                <input id="sticker-size"
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={
                                        placedStickers.find(
                                            (sticker) => sticker.id === selectedStickerId
                                        )?.size ?? 55 
                                    }

                                    onChange={(event) => 
                                        resizeSticker(
                                            selectedStickerId,
                                            Number(event.target.value)
                                        )
                                    }
                            />

                            <span>
                                {placedStickers.find(
                                    (sticker) => sticker.id === selectedStickerId
                                )?.size ?? 55}px
                            </span>
                            </div>
                            )}

                            {selectedStickerId !== null && (
                                <div className="studio-rotation-control">
                                    <label htmlFor="sticker-rotation">
                                        sticker rotation
                                    </label>

                                    <input id="sticker-rotation"
                                        type="range"
                                        min="-180"
                                        max="180"
                                        step="5"
                                        value={
                                            placedStickers.find(
                                                (sticker) => sticker.id === selectedStickerId
                                            )?.rotation ?? 0
                                        }
                                        onChange={(event) => 
                                            rotateSticker(
                                                selectedStickerId,
                                                Number(event.target.value)
                                            )
                                        }
                                />

                                <span>
                                    {placedStickers.find(
                                        (sticker) => sticker.id === selectedStickerId
                                    )?.rotation ?? 0}°
                                </span>
                            </div>
                        )}

                        {studioLayers.length > 0 && (
                            <div className="studio-layer-panel"> 
                                <div className="studio-layer-heading"> 
                                    <span className="studio-panel-label">
                                        sticker layers
                                    </span>

                                    <span className="studio-layers-count">
                                        {studioLayers.length} elements
                                    </span>
                                </div>

                                <div className="studio-layers-list">
                                    {studioLayers.map((layer) => {
                                        const selected = layer.type === "sticker" ? selectedStickerId === layer.id : selectedTextId === layer.id;

                                        return(
                                            <button key={`${layer.type}-${layer.id}`}
                                                type="button"
                                                className={
                                                    "studio-layer-item" + (selected ? " selected" : "")
                                                }
                                                onClick={() => {
                                                    if(layer.type === "sticker") {
                                                        setSelectedStickerId(layer.id);
                                                        setSelectedTextId(null);
                                                    } else {
                                                        setSelectedTextId(layer.id);
                                                        setSelectedStickerId(null);
                                                    }
                                                }}
                                            >
                                                <span className="studio-layer-position">
                                                    {layer.type === "text" ? "Aa" : ""}
                                                </span>

                                                <span className="studio-layer-name">
                                                    {layer.name}
                                                </span>

                                                {selected && (
                                                    <span className="studio-layer-selected">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <p className="studio-layers-hint">
                                    click a layer to select its element
                                </p>
                            </div>
                        )}

                        {selectedLayer && selectedLayerIndex !== -1 && (
                            <div className="studio-layer-controls">
                                <span className="studio-panel-label">
                                    arrange layers
                                </span>

                                <div className="studio-layer-buttons">
                                    <button type="button"
                                        disabled={selectedLayerIndex === 0} 
                                        onClick={() =>
                                            moveStudioLayer(
                                                selectedLayer.id,
                                                selectedLayer.type,
                                                "backward"
                                            )
                                        }
                                    >
                                        send backward
                                    </button>

                                    <button type="button"
                                        disabled={selectedLayerIndex === layerOrder.length - 1}
                                        onClick={() => 
                                            moveStudioLayer(
                                                selectedLayer.id,
                                                selectedLayer.type,
                                                "forward"
                                            )
                                        }
                                    >
                                        Bring forward
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedLayer && (
                            <button type="button"
                                className="studio-duplicate-button"
                                onClick={duplicateSelectedLayer}
                            >
                                Duplicate selected
                            </button>
                        )}

                        {selectedStickerId !== null && (
                            <button type="button"
                                className="studio-remove-sticker"
                                onClick={() => {
                                    const nextStickers = placedStickers.filter(
                                        (sticker) => sticker.id !== selectedStickerId
                                    );

                                    commitStickerChange(nextStickers);
                                    setSelectedStickerId(null);
                                }}
                            >
                                remove selected sticker
                            </button>
                        )}

                        {selectedTextId !== null && (
                            <div className="studio-text-edit-controls">
                                <span className="studio-panel-label">
                                    edit text
                                </span>

                                {placedTexts.filter((item) => item.id === selectedTextId)
                                    .map((item) => (
                                        <div key={item.id}>
                                            <input type="text"
                                                maxLength={60}
                                                value={item.text}
                                                onFocus={() => {
                                                    textGestureStart.current = placedTexts;
                                                }}
                                                onChange={(event) => {
                                                    const value = event.target.value;

                                                    setPlacedTexts((previous) => 
                                                        previous.map((text) => 
                                                            text.id === item.id ? {...text, text: value } : text
                                                        )
                                                    );
                                                }}
                                                onBlur={() => {
                                                    finishTextTyping();
                                                }}
                                                placeholder="your text..."
                                            />

                                            <label>
                                                font
                                                <select value={item.font}
                                                    onChange={(event) => {
                                                        const font = event.target.value;
                                                        if(font === item.font) {
                                                            return;
                                                        }

                                                        const nextTexts = placedTexts.map((text) =>
                                                            text.id === item.id ? {...text, font} : text
                                                        );

                                                        commitTextChange(nextTexts);
                                                    }}
                                                >
                                                    <option value="Georgia, serif">
                                                        Classic
                                                    </option>
                                                    <option value="'Comic Sans MS', cursive">
                                                        Handwritten
                                                    </option>
                                                    <option value="'Trebuchet MS', sans-serif">
                                                        Rounded
                                                    </option>
                                                </select>
                                            </label>

                                            <label>
                                                color
                                                <input type="color"
                                                    value={item.color}
                                                    onChange={(event) => {
                                                        const color = event.target.value;

                                                        if(color === item.color) {
                                                            return;
                                                        }

                                                        const nextTexts = placedTexts.map((text) =>
                                                            text.id === item.id ? {...text, color} : text
                                                        );
                                                        commitTextChange(nextTexts);
                                                    }}
                                                />
                                            </label>

                                            <label>
                                                size
                                                <input type="range"
                                                    min="10"
                                                    max="60"
                                                    value={item.size}
                                                    onPointerDown={() => {
                                                        textSliderStart.current = placedTexts;
                                                    }}
                                                    onKeyDown={() => {
                                                        if(!textSliderStart.current) {
                                                            textSliderStart.current = placedTexts;
                                                        }
                                                    }}
                                                    onChange={(event) => {
                                                        const size = Number(event.target.value);
                                                        setPlacedTexts((previous) =>
                                                            previous.map((text) =>
                                                                text.id === item.id ? {...text, size} : text
                                                            )
                                                        );
                                                    }}
                                                    onPointerUp={finishTextSlider}
                                                    onKeyUp={finishTextSlider}
                                                />
                                            </label>

                                            <label>
                                                rotation
                                                <input type="range"
                                                    min="-180"
                                                    max="180"
                                                    value={item.rotation}
                                                    onPointerDown={() => {
                                                        textSliderStart.current = placedTexts;
                                                    }}
                                                    onKeyDown={() => {
                                                        if(!textSliderStart.current) { 
                                                            textSliderStart.current = placedTexts;
                                                        }
                                                    }}
                                                    onChange={(event) => {
                                                        const rotation = Number(event.target.value);
                                                        setPlacedTexts((previous) =>
                                                            previous.map((text) =>
                                                                text.id === item.id ? {...text, rotation} : text
                                                            )
                                                        );
                                                    }}
                                                    onPointerUp={finishTextSlider}
                                                    onKeyUp={finishTextSlider}
                                                />
                                            </label>

                                            <button type="button"
                                                className="studio-remove-sticker"
                                                onClick={() => {
                                                    commitTextChange(
                                                        placedTexts.filter((text) => text.id !== item.id)
                                                    );

                                                    setSelectedTextId(null);
                                                    textHandleDrag.current = null;
                                                    textDrag.current = null;
                                                }}
                                            >
                                                remove selected text
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    <div className="studio-history-controls">
                        <button
                            type="button"
                            onClick={studioHistory.undo}
                            disabled={!studioHistory.canUndo}
                        >
                            ↶ Undo
                        </button>

                        <button 
                            type="button"
                            onClick={studioHistory.redo}
                            disabled={!studioHistory.canRedo}
                        >
                            ↷ Redo
                        </button>
                    </div>
                    <div className="studio-branding-control">
                        <label htmlFor="clicksy-branding">
                            <input id="clicksy-branding"
                                type="checkbox"
                                checked={showBranding}
                                onChange={(event) =>
                                    setShowBranding(event.target.checked)
                                }
                            />
                            <span>show Clicksy branding</span>
                        </label>
                    </div>

                    {showSaveForm && (
                        <div className="studio-save-form">
                            <label htmlFor="creation-name">
                                name your creation!
                            </label>
                            
                            <input id="creation-name"
                                type="text"
                                maxLength={60}
                                value={creationName}
                                onChange={(event) =>
                                    setCreationName(event.target.value)
                                }
                                placeholder="my memory"
                            />

                            <button type="button"
                                className="studio-download-button"
                                onClick={() => void saveToGallery()}
                            >
                                Confirm Save
                            </button>

                            <button type="button"
                                onClick={() => setShowSaveForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {isEditingSavedCreation && (
                        <button type="button"
                            className="studio-download-button"
                            onClick={() => void saveChanges()}
                        >
                            Save Changes
                        </button>
                    )}

                    {!showSaveForm && (
                        <button type="button"
                            className="studio-download-button"
                            onClick={() => setShowSaveForm(true)}
                        >
                            {isEditingSavedCreation
                                ? "Save as New Creation"
                                : "Save to my Creations"
                            }
                        </button>
                    )}
                    <button type="button"
                        className="studio-download-button"
                        onClick={downloadCreation}
                    > 
                        Download your creation!
                    </button>

                    {saveMessage && (
                        <p role="status"
                            aria-live="polite"
                            style={{
                                textAlign: "center",
                                fontSize: "13px",
                                color: saveMessage.startsWith(".") ? "#a34c70" : "#b42318",
                                marginTop: "10px",
                            }}
                        >
                            {saveMessage}
                        </p>
                    )}
                </aside>
            </section>
        </main>
    )
}