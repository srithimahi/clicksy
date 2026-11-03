export async function generateStrip(
    photos: string[],
    backgroundColor: string = "#ffffff",
    filter: "none" | "warm" = "none"
): Promise<string> {
    if(photos.length !== 4) {
        throw new Error("A strip requires 4 photos, bud.");
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
        throw new Error("Canvas is not supported, sorry!");
    }

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    if(backgroundColor.toUpperCase() === "#FFF0D8") {
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

    for(let i = 0; i < photos.length; i++) {
        const image = new Image();
        image.src = photos[i];

        await image.decode();

        const x = padding;
        const y = padding + i * (photoHeight + gap);

        const scale = Math.min(photoWidth / image.width, photoHeight / image.height);
        const sourceWidth = photoWidth / scale;
        const sourceHeight = photoHeight / scale;

        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;

        context.save();

        if(filter === "warm") {
            context.filter = "sepia(18%) saturate(115%) brightness(105%)";
        }

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

    context.fillStyle =
        backgroundColor.toUpperCase() === "#292535"
            ? "#FFFFFF"
            : "#D76B9A";
    context.font = "bold 38px 'Trebuchet MS', Ariel, sans-serif";
    context.textAlign = "center";
    context.fillText("clicksy", width / 2, height - 45);

    return canvas.toDataURL("image/png");
}