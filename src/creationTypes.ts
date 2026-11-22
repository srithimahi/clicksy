export type SavedStudioCreation = {
    version: 1;
    id?: string;
    name?: string;
    createdAt?: number;
    thumbnail?: string;
    photos: string[];
    themeId: string;
    backgroundSelections: Record<string, string>;
    filterId: string;
    showBranding: boolean;
    stickers: {
        id: number;
        assetId: string;
        x: number;
        y: number;
        size: number;
        rotation: number;
    }[];
    texts: {
        id: number;
        text: string;
        x: number;
        y: number;
        size: number;
        rotation: number;
        font: string;
        color: string;
    }[];
    layers: {
        id: number;
        type: "sticker" | "text";
    }[];
}