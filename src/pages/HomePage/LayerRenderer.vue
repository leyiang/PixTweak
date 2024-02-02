<template>
    <canvas ref="dCanvas"></canvas>
</template>

<script setup lang="ts">
import "@/assets/style/components/EditingImageStyle.css"
import { useBrushStore } from "@/stores/BrushStore";
import { useCanvasStore } from "@/stores/CanvasStore";
import { useLayerStore } from "@/stores/LayerStore";
import { useWorkStore } from '@/stores/WorkStore';
import type { SupportImageSource } from '@/types/WorkStoreType';
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, watch } from 'vue';

const dCanvas = ref<HTMLCanvasElement | null>(null);

let currentScale = -1;

const layerStore = useLayerStore();
const workStore = useWorkStore();

const canvasStore = useCanvasStore();
const brushStore = useBrushStore();

const { scale } = storeToRefs(canvasStore);
const { layers } = storeToRefs(layerStore);
const { drawings } = storeToRefs(brushStore);

watch(layers, () => {
    renderLayers();
}, {
    deep: true
});

watch(drawings, () => {
    renderLayers();
}, {
    deep: true
});

// Keep track of scale value
// Remove the meaning less repaint on scale init
watch(scale,() => {
    /*
     * No need to repaint
     */
    if( scale.value === currentScale ) {
        return;
    }

    renderLayers();
});

function renderLayers() {
    currentScale = scale.value;
    
    const canvas = dCanvas.value;

    if( canvas === null ) {
        throw new Error("app is setting image, but canvas element cannot be retrived")
    }

    const ctx = canvas.getContext("2d");

    if( ctx === null ) {
        throw new Error("Someone reached the canvas, and getContext('webgl') before. Check it.")
    }

    // const { cw, ch } = workStore.imageInfo;

    const w = canvasStore.scaledWidth;
    const h = canvasStore.scaledHeight;

    canvas.width = w;
    canvas.height = h;

    layerStore.layers.forEach(layer => {
        if( layer.visibility ) {
            const source = layer.renderLayer();
            ctx.drawImage( source, 0, 0, w, h );
        }
    });

    canvasStore.setResultCanvas( canvas );
    return true;
}
</script>