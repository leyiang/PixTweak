<template>
    <canvas ref="dCanvas"></canvas>
</template>

<script setup lang="ts">
import { useWorkStore } from '@/stores/WorkStore';
import type { SupportImageSource } from '@/types/WorkStoreType';
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, watch } from 'vue';

const dCanvas = ref<HTMLCanvasElement | null>(null);

let currentScale = -1;

const workStore = useWorkStore();

const { scale, editingImage } = storeToRefs(workStore);

watch(editingImage,() => {
    drawEditingImage( editingImage.value )
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

    drawEditingImage( editingImage.value )
});

/**
 * Return value indicates is repaint processed 
 */
function drawEditingImage( imageSource: SupportImageSource | null ) : boolean {
    currentScale = scale.value;
    
    if( imageSource === null ) {
        // Image is Null Logic
        return false;
    }

    const canvas = dCanvas.value;

    if( canvas === null ) {
        throw new Error("app is setting image, but canvas element cannot be retrived")
    }

    const ctx = canvas.getContext("2d");

    if( ctx === null ) {
        throw new Error("Someone reached the canvas, and getContext('webgl') before. Check it.")
    }

    console.log("REpaint!", imageSource );

    const { cw, ch } = workStore.imageInfo;

    canvas.width = cw;
    canvas.height = ch;

    ctx.drawImage( imageSource, 0, 0, cw, ch);

    return true;
}
</script>