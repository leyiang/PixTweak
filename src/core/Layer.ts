import type { SupportImageSource } from "@/types/WorkStoreType";
import { getNewCanvas } from "@/utils";

export class Layer {
    visibility: boolean;
    source: HTMLCanvasElement;
    name: string;
    paintOnMask: boolean;
    showMask: boolean;
    mask: null | HTMLCanvasElement;

    constructor(name: string, source: SupportImageSource) {
        this.name = name;
        this.visibility = true;
        this.source = this.formatSource( source );

        this.mask = null;
        this.showMask = false;
        this.paintOnMask = false;
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

    getContext(): CanvasRenderingContext2D {
        let context = null;

        if( this.paintOnMask && this.mask !== null ) {
            context = this.mask.getContext("2d");
        } else {
            context = this.source.getContext("2d");
        }

        if( context === null ) {
            throw new Error("context is null for layer");
        }

        return context;
    }

    createMask() {
        if( this.mask !== null ) {
            return;
        }

        const {canvas, context } = getNewCanvas(
            this.source.width,
            this.source.height,
        ); 

        // context.fillStyle = "#FFF";
        // context.fillRect(0, 0, canvas.width, canvas.height);

        this.mask = canvas;
    }

    renderLayer() : HTMLCanvasElement {
        if( this.mask === null ) {
            return this.source;
        } else {
            // apply mask
            const { canvas, context } = getNewCanvas(this.source.width, this.source.height);

            // const maskContext = this.mask.getContext("2d") as CanvasRenderingContext2D;
            // const data = maskContext.getImageData( 0, 0, this.mask.width, this.mask.height );
            // let i = 0;
            // while( i < data.data.length ) {
            //     const rgb = data.data[i++] + data.data[i++] + data.data[i++];
            //     data.data[i++] = rgb / 3;
            // }
            // maskContext.putImageData(data, 0, 0);

            context.drawImage( this.source, 0, 0);
            context.globalCompositeOperation = "destination-out";
            context.drawImage( this.mask, 0, 0 );
            context.globalCompositeOperation = "source-over";

            return canvas;
        }
    }
}