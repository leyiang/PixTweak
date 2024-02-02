import type { SupportImageSource } from "@/types/WorkStoreType";

export class Layer {
    visibility: boolean;
    source: HTMLCanvasElement;
    name: string;

    constructor(name: string, source: SupportImageSource) {
        this.name = name;
        this.visibility = true;
        this.source = this.formatSource( source );
    }

    formatSource( source: SupportImageSource ) : HTMLCanvasElement {
        function convertImageToCanvas( image: HTMLImageElement ): HTMLCanvasElement {
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.drawImage( image, 0, 0 );

            return canvas;
        }

        if( source instanceof HTMLImageElement ) {
            source = convertImageToCanvas( source );
        }

        return source;
    }
}