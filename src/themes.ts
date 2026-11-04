export type ThemeBackground = {
    id: string;
    name: string;
    color: string;
    pattern: "solid" | "gingham";
    stripeColor?: string;
    overlapColor?: string;
}

export type Theme = {
    id: string;
    name: string;

    backgroundColor: string;
    accentColor: string;
    textColor: string;
    
    framePattern: "solid" | "gingham" | "polka-dot";
    filter: "none" | "warm" | "dreamy" | "vintage";

    stickers: string[];
    backgrounds: ThemeBackground[];
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

    backgrounds: [
        {
            id: "vanilla-latte",
            name: "Vanilla Latte",
            color: "fff0d8",
            pattern: "solid",
        },
        {
            id: "rose-frosting",
            name: "Rose Frosting",
            color: "#f5d3d0",
            pattern: "gingham",
            stripeColor: "#e9b8bD",
            overlapColor: "#dba0a9",
        },
        {
            id: "peach-custard",
            name: "Peach Custard",
            color: "#ffd6c5",
            pattern: "solid",
        },
        {
            id: "milky-caramel",
            name: "Milky Caramel",
            color: "#e9d8cb",
            pattern: "solid",
        },
        {
            id: "sugar-glaze",
            name: "Sugar Glaze",
            color: "#fff5e8",
            pattern: "gingham",
            stripeColor: "#eaddd0",
            overlapColor: "#dfccba",

        },
        {
            id: "iced-macchiato",
            name: "Iced Maccchiato",
            color: "#fff0d8",
            pattern: "gingham",
            stripeColor: "#e9c9a7",
            overlapColor: "#d8ad84",
        },
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

    backgrounds: [
        {
            id: "strawberry-milk",
            name: "Strawberry Milk",
            color: "#fff2f5",
            pattern: "gingham",
            stripeColor: "#f8c7d4",
            overlapColor: "#efa8bc",
        },
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