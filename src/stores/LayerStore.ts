import type { SupportImageSource } from "@/types/WorkStoreType";
import { defineStore } from 'pinia'
import { useCanvasStore } from "./CanvasStore";
import { Layer } from "@/core/Layer";

export const useLayerStore = defineStore('layer-store', {
  state: () => {
    return {
        layers: [] as Layer[],
        currentLayerIndex: 0,

        currentDraggingID: null as null | number,
    }
  },

  actions: {
    addLayer(source: SupportImageSource, name = null as null | string) {
        const canvasStore = useCanvasStore();
        const { canvas } = canvasStore.getEmptyCanvas();

        this.layers.push(
            new Layer(name, source, canvas)
        );

        this.switchCurrentLayer( this.layers.length - 1 );
    },

    addEmptyLayer() {
        const canvasStore = useCanvasStore();
        const { canvas } = canvasStore.getEmptyCanvas();

        this.addLayer( canvas );
    },

    addSolidLayer( fill="#FFF" ) {
        const canvasStore = useCanvasStore();
        const { canvas, context } = canvasStore.getEmptyCanvas();

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
    },

    setCurrentDragging(id: number | null) {
        this.currentDraggingID = id;
    },

    getLayerIndexByID( id: number ) {
        return this.layers.findIndex(layer => layer.id === id);
    },

    /*
     * Time Complexity: O(2N), N is the length of layers
     * TODO: fix it.
     */
    swapLayer(id1: number, id2: number) {
        const index1 = this.getLayerIndexByID( id1 );
        const index2 = this.getLayerIndexByID( id2 );

        if( index1 === -1  || index2 === -1 ) return;

        const tmp = this.layers[index1];
        this.layers[index1] = this.layers[index2];
        this.layers[index2] = tmp;
    }
  },
})