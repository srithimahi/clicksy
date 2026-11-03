export type Theme = {
    id: string;
    name: string;

    backgroundColor: string;
    accentColor: string;
    textColor: string;
    
    framePattern: "solid" | "gingham" | "polka-dot";
    filter: "none" | "warm" | "dreamy" | "vintage";

    stickers: string[];
};

//FIRST THEME: LITTLE BAKERY

export const littleBakery: Theme = {
    id: "little-bakery",
    name: "Little Bakery",
    backgroundColor: "#fff0d8",
    accentColor: "#d9a77e",
    textColor: "#885b42",

    framePattern: "gingham",
    filter: "warm",

    stickers: [
        "croissant",
        "muffin",
        "baguette",
        "toast",
        "coffee",
        "jam",
        "cookies",
    ],
};

//SECOND THEME: STRAWBERRY MILK

export const strawberryMilk: Theme = {
    id: "strawberry-milk",
    name: "Strawberry Milk",

    backgroundColor: "#ffe4eb",
    accentColor: "#e789a4",
    textColor: "#b94c70",

    framePattern: "gingham",
    filter: "none",

    stickers: [
        "strawberry-milk-cartons",
        "strawberry-sparkles",
    ],
};

export const themes: Theme[] = [
    littleBakery,
    strawberryMilk,
];

export function getThemeById(
    themeId: string
): Theme | undefined {
    return themes.find((theme) => theme.id === themeId);
}

export function getThemeStickerIds(
    themeId: string
): string[] {
    const theme = getThemeById(themeId);
    if(!theme) {
        return [];
    }

    return theme.stickers;
}

export function isValidThemeId(
    themeId: string
): boolean {
    return themes.some((theme) => theme.id === themeId);
}