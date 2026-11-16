import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { themes } from "./themes";
import { stickers, stickersByTheme } from "./stickers/index";
import {exportStrip} from "./exportStrip";
import { useHistory } from "./hooks/useHistory";

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
}: CreativeStudioProps) {
    const [selectedTheme, setSelectedTheme] = useState(themes[0]);
    const [backgroundSelections, setBackgroundSelections] = 
        useState<Record<string, string>>({});

    const selectedBackgroundId = backgroundSelections[selectedTheme.id] ?? selectedTheme.backgrounds[0]?.id;

    const selectedBackground = selectedTheme.backgrounds.find(
        (background) => background.id === selectedBackgroundId 
    ) ?? selectedTheme.backgrounds[0];
    const [selectedFilterId, setSelectedFilterId] = useState<PhotoFilterId>("original");
    const activeFilter = PHOTO_FILTERS[selectedFilterId].css;
    const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
    const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const stickerHistory = useHistory<PlacedSticker[]>([]);
    useEffect(() => {
        setPlacedStickers(stickerHistory.current);
    }, [stickerHistory.current]);
    const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
    const selectedStickerIndex = placedStickers.findIndex((sticker) => sticker.id === selectedStickerId);
    const selectedSticker = placedStickers.find((sticker) => sticker.id === selectedStickerId);
    const stickerLayers = placedStickers.map((sticker, index) => ({
        sticker, 
        index,
    })).reverse();
    const stripRef = useRef<HTMLDivElement>(null);
    const controlsLayerRef = useRef<HTMLDivElement>(null);
    const draggingStickerId = useRef<number | null>(null);
    const textDrag = useRef<{
        id: number;
        pointerId: number;
        startX: number;
        startY: number;
        originalX: number;
        originalY: number;
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

    function commitStickerChange(nextStickers: PlacedSticker[]) {
        setPlacedStickers(nextStickers);
        stickerHistory.push(nextStickers);
    }

    function moveStickerLayer(
        id: number,
        direction: "forward" | "backward"
    ) {
        const currentIndex = placedStickers.findIndex(
            (sticker) => sticker.id === id
        );

        if(currentIndex === -1) return;

        const nextIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;

        if(nextIndex < 0 || nextIndex >= placedStickers.length) {
            return;
        }

        const nextStickers = [...placedStickers];

        [nextStickers[currentIndex], nextStickers[nextIndex]] = [
            nextStickers[nextIndex],
            nextStickers[currentIndex],
        ];

        commitStickerChange(nextStickers);
        setSelectedStickerId(id);
    }

    function finishStickerGesture() {
        const before = gestureStart.current;
        gestureStart.current = null;

        if(!before) return;

        const changed = JSON.stringify(before) !== JSON.stringify(placedStickers);

        if(changed) {
            stickerHistory.push(placedStickers);
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
                stickerHistory.redo();
            } else {
                stickerHistory.undo();
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
    }, [stickerHistory.undo, stickerHistory.redo]);

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
    }, [selectedStickerId, placedStickers, stickerHistory.push]);

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

        commitStickerChange(nextStickers);
        setSelectedStickerId(newSticker.id);
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

        setPlacedTexts((previous) => [...previous, newText]);
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

    async function downloadCreation() {
        if(!stripRef.current) return;

        try {
            await exportStrip({
                stripElement: stripRef.current,
                stickers: placedStickers,
                stickerAssets: stickers,
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
                                            }}
                                            onPointerDown={(event) => {
                                                if(event.target !== event.currentTarget) return;
                                                event.preventDefault();
                                                event.stopPropagation();

                                                gestureStart.current = placedStickers;
                                                draggingStickerId.current = placed.id;
                                                setSelectedStickerId(placed.id);
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
                                        }}
                                        onPointerDown={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();

                                            setSelectedTextId(placed.id);
                                            setSelectedStickerId(null);

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
                                            }

                                            if(event.currentTarget.hasPointerCapture(event.pointerId)) {
                                                event.currentTarget.releasePointerCapture(event.pointerId);
                                            }
                                        }}
                                        onPointerCancel={(event) => {
                                            if(textDrag.current?.pointerId === event.pointerId) {
                                                textDrag.current = null;
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

                            <div className="studio-strip-brand"
                                style={{
                                    color: selectedTheme.textColor,
                                }}
                            >
                                clicksy
                            </div>
                        </div>

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

                        {placedStickers.length > 0 && (
                            <div className="studio-layer-panel"> 
                                <div className="studio-layer-heading"> 
                                    <span className="studio-panel-label">
                                        sticker layers
                                    </span>

                                    <span className="studio-layers-count">
                                        {placedStickers.length} stickers
                                    </span>
                                </div>

                                <div className="studio-layers-list"> 
                                    {stickerLayers.map(({ sticker, index}) => (
                                        <button key={sticker.id}
                                            type="button"
                                            className={"studio-layer-item" +
                                                (selectedStickerId === sticker.id
                                                    ? " selected"
                                                    : ""
                                                )
                                            }
                                            onClick={() => 
                                                setSelectedStickerId(sticker.id)
                                            }
                                        >
                                            <span className="studio-layer-position">
                                                {index + 1}
                                            </span>

                                            <span className="studio-layer-name">
                                                {stickers.find((asset) => asset.id === sticker.assetId)?.name ?? "Unknown sticker"}
                                            </span>

                                            {selectedStickerId === sticker.id && (
                                                <span className="studio-layer-selected">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <p className="studio-layers-hint">
                                    click a layer to select its sticker
                                </p>
                            </div>
                        )}

                        {selectedStickerId !== null && (
                            <div className="studio-layer-controls"> 
                                <span className="studio-panel-label">
                                    stickers layers
                                </span>

                                <div className="studio-layer-buttons"> 
                                    <button type="button"
                                        disabled={selectedStickerIndex <= 0}
                                        onClick={() => 
                                            moveStickerLayer(
                                                selectedStickerId,
                                                "backward"
                                            )
                                        }
                                    >
                                        Send backward
                                    </button>

                                    <button type="button"
                                        disabled={
                                            selectedStickerIndex === placedStickers.length-1
                                        }
                                        onClick={() => 
                                            moveStickerLayer(
                                                selectedStickerId,
                                                "forward"
                                            )
                                        }
                                    >
                                        Bring forward
                                    </button>
                                </div>
                            </div>
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
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    setPlacedTexts((previous) => 
                                                        previous.map((text) => 
                                                            text.id === item.id ? {...text, text: value} : text
                                                        )
                                                    );
                                                }}
                                                placeholder="your text..."
                                            />

                                            <label>
                                                font
                                                <select value={item.font}
                                                    onChange={(event) => {
                                                        const font = event.target.value;

                                                        setPlacedTexts((previous) =>
                                                            previous.map((text) =>
                                                                text.id === item.id ? {...text, font } : text
                                                            )
                                                        );
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

                                                        setPlacedTexts((previous) => 
                                                            previous.map((text) =>
                                                                text.id === item.id ? { ...text, color } : text
                                                            )
                                                        );
                                                    }}
                                                />
                                            </label>

                                            <label>
                                                size
                                                <input type="range"
                                                    min="10"
                                                    max="60"
                                                    value={item.size}
                                                    onChange={(event) => {
                                                        const size = Number(event.target.value);

                                                        setPlacedTexts((previous) =>
                                                            previous.map((text) =>
                                                                text.id === item.id ? { ...text, size } : text
                                                            )
                                                        );
                                                    }}
                                                />
                                            </label>

                                            <label>
                                                rotation
                                                <input type="range"
                                                    min="-180"
                                                    max="180"
                                                    value={item.rotation}
                                                    onChange={(event) => {
                                                        const rotation = Number(event.target.value);

                                                        setPlacedTexts((previous) => 
                                                            previous.map((text) => 
                                                                text.id === item.id ? { ...text, rotation } : text
                                                            )
                                                        );
                                                    }}
                                                />
                                            </label>

                                            <button type="button"
                                                className="studio-remove-sticker"
                                                onClick={() => {
                                                    setPlacedTexts((previous) =>
                                                        previous.filter(
                                                            (text) => text.id !== item.id
                                                        )
                                                    );
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
                            onClick={stickerHistory.undo}
                            disabled={!stickerHistory.canUndo}
                        >
                            ↶ Undo
                        </button>

                        <button 
                            type="button"
                            onClick={stickerHistory.redo}
                            disabled={!stickerHistory.canRedo}
                        >
                            ↷ Redo
                        </button>
                    </div>
                    <button type="button"
                        className="studio-download-button"
                        onClick={downloadCreation}
                    > 
                        Download your creation!
                    </button>
                </aside>
            </section>
        </main>
    )
}