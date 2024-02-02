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

export function getNewCanvas( width:number, height:number ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    return { canvas, context };
}