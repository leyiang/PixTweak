export function loadImage(src: string) : Promise<HTMLImageElement> {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.src = src;
    });
}

export function downloadCanvas( canvas: HTMLCanvasElement, filename="result" ) {
    canvas.toBlob(blob => {
        if( blob === null ) {
            throw new Error("Got empty blob");
        }

        if( filename.length < 1 ) {
            throw new Error("filename can't be empty");
        }

        // Download File
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.target = "_blank";
        a.download = `${ filename }.png`;
        a.href = url;
        a.click();
    });
}

export function copyCanvasToClipboard( canvas: HTMLCanvasElement ) {
    canvas.toBlob(blob => {
        if( blob === null ) {
            throw new Error("Got empty blob");
        }

        const imageData = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([imageData]);
    });
}

/**
 * args as same as context.drawImage 
 * for more info, check its documentation
 */
export function cropImage( imageToCrop: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dw:number, dh:number ) {
    const canvas = document.createElement("canvas");

    // for getContext returning null, it can happen if you have already requested a different type of context.
    const ctx = canvas.getContext("2d");

    if( ctx === null ) {
        throw new Error("Context2D is null");
    }

    canvas.width = dw;
    canvas.height = dh;

    ctx.drawImage(imageToCrop, sx, sy, sw, sh, 0, 0, dw, dh);

    return canvas;
}

export function renderDrawings( drawingPoints, ctx: CanvasRenderingContext2D, scale = 1) {
    scale = 1 / scale;
        ctx.beginPath();
    for(let i = 1; i < drawingPoints.length; i++) {
        const prev = drawingPoints[i-1];
        const current = drawingPoints[i];

        if( i === 1 ) {
            ctx.moveTo( prev.x * scale, prev.y * scale );
            ctx.lineTo( current.x * scale, current.y * scale );
        } else {
            const start = drawingPoints[i-2];
            const lastX = (start.x + prev.x) / 2;
            const lastY = (start.y + prev.y) / 2;

            const x = (prev.x + current.x) / 2;
            const y = (prev.y + current.y) / 2;
            ctx.moveTo( lastX * scale, lastY * scale );
            ctx.quadraticCurveTo( prev.x * scale, prev.y * scale, x * scale, y * scale);
        }
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = "round";
    ctx.lineWidth = 30;
    ctx.stroke();
}