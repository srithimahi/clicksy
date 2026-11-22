export type QuickFilter = 
    | "none" | "warm" | "cool" | "bw" | "sepia" | "vintage" | "retro";

export type QuickFrame = "classic" | "retro-film";

const filterStyles: Record<QuickFilter, string> = {
    none: "none",
    warm: "sepia(18%) saturate(115%) brightness(105%)",
    cool: "saturate(90%) hue-rotate(12deg) brightness(105%)",
    bw: "grayscale(100%)",
    sepia: "sepia(85%)",
    vintage: "sepia(30%) saturate(75%) contrast(90%)",
    retro: "sepia(28%) saturate(80%) contrast(88%) brightness(108%)",
};

export async function generateStrip(
    photos: string[],
    backgroundColor: string = "#ffffff",
    filter: QuickFilter = "none",
    frame: QuickFrame = "classic"
): Promise<string> {
    if(photos.length !== 4) {
        throw new Error("A strip needs 4 photos, bud.");
    }

    const width = 600;
    const photoWidth = 540;
    const photoHeight = 405;
    const padding = 30;
    const gap = 20;
    const footerHeight = 90;
    const height = padding * 2 + photoHeight * 4 + gap * 3 + footerHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if(!context) {
        throw new Error("Canvas is not supported");
    }

    const isRetroFilm = frame === "retro-film";

    context.fillStyle = isRetroFilm ? "#171717" : backgroundColor;
    context.fillRect(0, 0, width, height);

    if(!isRetroFilm && backgroundColor.toUpperCase() === "#fff0d8") {
        const squareSize = 24;
        const stripeColor = "rgba(217, 167, 126, 0.22)";
        context.fillStyle = stripeColor;

        for(let x = 0; x < width; x += squareSize * 2) {
            context.fillRect(x, 0, squareSize, height);
        }

        for(let y = 0; y < height; y += squareSize * 2) {
            context.fillRect(0, y, width, squareSize);
        }
    }

    for(let i = 0; i< photos.length; i++) {
        const image = new Image();
        image.src = photos[i];

        await image.decode();

        const x = padding;
        const y = padding + i * (photoHeight + gap);

        const scale = Math.max(photoWidth / image.width, photoHeight / image.height);

        const sourceWidth = photoWidth / scale;
        const sourceHeight = photoHeight / scale;

        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;

        context.save();
        context.filter = filterStyles[filter];

        context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            x,
            y,
            photoWidth,
            photoHeight
        );

        context.restore();
    }

    if(isRetroFilm) {
        const holeWidth = 16;
        const holeHeight = 26;
        const holeGap = 14;
        const holeOffset = 7;

        context.fillStyle = "#fff8ed";

        for(let y = 12; y + holeHeight < height - 10; y += holeHeight + holeGap) {
            context.fillRect(holeOffset, y, holeWidth, holeHeight);
            context.fillRect(width-holeOffset-holeWidth, y, holeWidth, holeHeight);
        }
    }

    context.fillStyle = isRetroFilm || backgroundColor.toUpperCase() === "#292535" ? "#ffffff" : "#d76b9a";

    context.font = "bold 38px 'Trebuchet MS', Arial, sans-serif";
    context.textAlign = "center";

    context.fillText("clicksy", width / 2, height - 45);

    return canvas.toDataURL("image/png");
}