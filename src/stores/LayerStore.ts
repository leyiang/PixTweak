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
        const canvas = document.createElement("canvas");
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = "#000";
        canvas.width = canvasStore.w;
        canvas.height = canvasStore.h;
        context.fillRect(0, 0, canvas.width, canvas.height);

        this.addLayer( canvas );
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