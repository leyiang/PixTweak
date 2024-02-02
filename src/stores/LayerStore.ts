import type { SupportImageSource } from "@/types/WorkStoreType";
import type { Layer } from '@/types/LayerStoreType';
import { defineStore } from 'pinia'
import { useCanvasStore } from "./CanvasStore";

export const useLayerStore = defineStore('layer-store', {
  state: () => {
    return {
        layers: [] as Layer[],
        currentLayerIndex: 0,
    }
  },

  actions: {
    addLayer(source: SupportImageSource, name = "no-name") {
        console.log("Update layers");
        
        this.layers.push({
            name,
            source,
            visibility: true,
        });

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