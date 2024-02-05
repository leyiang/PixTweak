<template>
    <div class="interact-area" @mousedown="mousedown">

    </div>
</template>

<script setup lang="ts">
import { Vec } from '@/core/Vec';
import { useLayerStore } from '@/stores/LayerStore';
import { onBeforeUnmount } from 'vue';

const layerStore = useLayerStore();

let selected = null;

const start = new Vec();

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

const current = new Vec();

const oldPos = new Vec();

let isMoving = false;

function myMousedown(e: MouseEvent) {
    start.set( e.offsetX, e.offsetY );

    if( selected !== null ) {
        console.log( selected );
        
        if( selected.isPointInside(start) ) {
            isMoving = true;
        }
    }
}

function myMousemove(e) {
    if( selected && isMoving ) {

        current.set( e.offsetX, e.offsetY );
        const dx = current.x - start.x;
        const dy = current.y - start.y;

        selected.pos.x = oldPos.x + dx;
        selected.pos.y = oldPos.y + dy;
    }
}

function myMouseup() {
    isMoving = false;
}
window.addEventListener("mousedown", myMousedown);
window.addEventListener("mousemove", myMousemove);
window.addEventListener("mouseup", myMouseup);

onBeforeUnmount(() => {
    window.removeEventListener("mousedown", myMousedown);
    window.removeEventListener("mousemove", myMousemove);
    window.removeEventListener("mouseup", myMouseup);
});
</script>