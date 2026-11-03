type ExportSticker = {
    assetId: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
};

type ExportOptions = {
    stripElement: HTMLDivElement;
    stickers: ExportSticker[];
    stickerAssets: { id: string; svg: string }[];
}

function loadImage(src: string) : Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Image failed to load"));
        image.src = src;
    });
}

export async function exportStrip({
    stripElement,
    stickers,
    stickerAssets,
}: ExportOptions) {
    const bounds = stripElement.getBoundingClientRect();
    if(!bounds.width || !bounds.height) {
        throw new Error("Photo strip has no visible dimensions");
    }

    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bounds.width * scale);
    canvas.height = Math.round(bounds.height * scale);

    const ctx = canvas.getContext("2d");
    if(!ctx) throw new Error("Canvas is unavailable");

    ctx.scale(scale, scale);

    const stripStyle = getComputedStyle(stripElement);

    ctx.fillStyle = stripStyle.backgroundColor;
    ctx.fillRect(0, 0, bounds.width, bounds.height);

    if(stripElement.classList.contains("studio-strip-gingham")) {
        const patternSize = 18;

        ctx.fillStyle = "rgba(190, 130, 95, 0.09)";

        for(let x = 0; x < bounds.width; x += patternSize) {
            for(let y = 0; y < bounds.height; y += patternSize) {
                if(
                    (Math.floor(x / patternSize) + Math.floor(y / patternSize)) % 2 == 0
                ) {
                    ctx.fillRect(x, y, patternSize, patternSize);
                }
            }
        }
    }

    const backgroundImage = stripStyle.backgroundImage;

    if(backgroundImage && backgroundImage !== "none") {
        const match = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if(match) {
            const background = await loadImage(match[1]);

            const pattern = ctx.createPattern(background, "repeat");

            if(pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, bounds.width, bounds.height);
            }
        }
    }

    const photoElements = Array.from(
        stripElement.querySelectorAll<HTMLImageElement>(
            ".studio-photo-image"
        )
    );

    for(const photo of photoElements) {
        const image = await loadImage(photo.src);
        const rect = photo.getBoundingClientRect();

        const photoStyle = getComputedStyle(photo);

        ctx.save();
        ctx.filter = photoStyle.filter;

        const x = rect.left - bounds.left;
        const y = rect.top - bounds.top;

        const targetWidth = rect.width;
        const targetHeight = rect.height;

        const ratio = Math.max(
            targetWidth / image.naturalWidth,
            targetHeight / image.naturalHeight
        );

        const sourceWidth = targetWidth / ratio;
        const sourceHeight = targetHeight / ratio;

        const sourceX = (image.naturalWidth - sourceWidth) / 2;
        const sourceY = (image.naturalHeight - sourceHeight) / 2;

        ctx.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            x,
            y,
            targetWidth,
            targetHeight
        );

        ctx.restore();
    }

    for(const placed of stickers) {
        const asset = stickerAssets.find(
            (item) => item.id === placed.assetId
        );

        if(!asset) continue;

        const url = "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(asset.svg);

        const image = await loadImage(url);

        const centerX = (placed.x / 100) * bounds.width;
        const centerY = (placed.y / 100) * bounds.height;

        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate((placed.rotation * Math.PI) / 180);

        ctx.drawImage(
            image,
            -placed.size / 2,
            -placed.size / 2,
            placed.size,
            placed.size
        );

        ctx.restore();
    }

    const footer = stripElement.querySelector<HTMLElement>(
        ".studio-strip-brand"
    );

    if(footer) {
        const rect = footer.getBoundingClientRect();
        const style = getComputedStyle(footer);

        ctx.fillStyle = style.color;
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            footer.textContent?.trim() || "clicksy",
            rect.left - bounds.left + rect.width / 2,
            rect.top - bounds.top + rect.height / 2,
        );
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
            if(result) resolve(result);
            else reject(new Error("PNG export failed"));
        }, "image/png");
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "clicksy-creation.png";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}