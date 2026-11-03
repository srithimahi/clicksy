import { littleBakeryStickers } from "./littleBakery";
import { strawberryMilkStickers } from "./strawberryMilk";

export const stickersByTheme = {
    "little-bakery": littleBakeryStickers,
    "strawberry-milk": strawberryMilkStickers,
};

export const stickers = [
    ...littleBakeryStickers,
    ...strawberryMilkStickers,
];

export function getStickerById(
    stickerId: string
) {
    return stickers.find((sticker) => sticker.id === stickerId);
}

export function getStickersForTheme(
    themeId: string
) {
    return(stickersByTheme[
        themeId as keyof typeof stickersByTheme
    ] ?? []); 
}

export function stickerBelongsToTheme(
    stickerId: string,
    themeId: string
): boolean {
    const themeStickers = getStickersForTheme(themeId);

    return themeStickers.some((sticker) => sticker.id === stickerId);
}