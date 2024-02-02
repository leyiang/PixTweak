import type { SupportImageSource } from "@/types/WorkStoreType";
import { defineStore } from 'pinia'
import { useCanvasStore } from "./CanvasStore";
import { Layer } from "@/core/Layer";

export const useLayerStore = defineStore('layer-store', {
  state: () => {
    return {
        layers: [] as Layer[],
        currentLayerIndex: 0,
    }
  },

  actions: {
    addLayer(source: SupportImageSource, name = "no-name") {
        this.layers.push(
            new Layer(name, source)
        );

        this.switchCurrentLayer( this.layers.length - 1 );
    },

    addEmptyLayer() {
        const canvasStore = useCanvasStore();
        const canvas = canvasStore.getEmptyCanvas();

        this.addLayer( canvas );
    },

    addSolidLayer( fill="#FFF" ) {
        const canvasStore = useCanvasStore();
        const canvas = canvasStore.getEmptyCanvas();
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = fill;
        context.fillRect(0, 0, canvas.width, canvas.height);
    },

    getCurrentLayer() {
        return this.layers[ this.currentLayerIndex ];
    },

    switchCurrentLayer( index:number ) {
        this.currentLayerIndex = index;
    },

    hasLayer() {
        return this.layers.length > 0;
    }
  },
})