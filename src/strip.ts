export async function generateStrip(
    photos: string[],
    backgroundColor: string = "#ffffff"
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