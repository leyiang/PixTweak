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