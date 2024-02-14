<template>
    <div class="interact-area" @mousedown="mousedown">

    </div>
</template>

<script setup lang="ts">
import type { Layer } from '@/core/Layer';
import { mouseState } from '@/core/MouseState';
import { Vec } from '@/core/Vec';
import { useLayerStore } from '@/stores/LayerStore';
import { usePanStore } from '@/stores/PanStore';
import { onBeforeUnmount } from 'vue';

const layerStore = useLayerStore();

let selected = null as null | Layer;

function mousedown(e: MouseEvent) {
    const layer = layerStore.getCurrentLayer();
    const point = new Vec( e.offsetX, e.offsetY );

    if( layer.isPointInside( point ) ) {
        selected = layer;

        oldPos.set( layer.pos.x, layer.pos.y );
    } else {
        selected = null;
    }
}

const oldPos = new Vec();
let isMoving = false;
const panStore = usePanStore();

let cleanupMouseDown = mouseState.onMouseDown((e) => {
    if( selected === null ) return;

    const mouse = new Vec(e.offsetX, e.offsetY);
    if( selected.isPointInside( mouse ) ) {
        isMoving = true;
    }
}, () => ! panStore.dragging );

let cleanupMouseMove = mouseState.onMouseMove((e, dx, dy) => {
    if( selected && isMoving ) {
        selected.pos.x = oldPos.x + dx;
        selected.pos.y = oldPos.y + dy;
    }
}, () => ! panStore.dragging );

const cleanupMouseUp = mouseState.onMouseUp(() => {
    isMoving = false;
});

onBeforeUnmount(() => {
    cleanupMouseDown();
    cleanupMouseMove();
    cleanupMouseUp();
});
</script>