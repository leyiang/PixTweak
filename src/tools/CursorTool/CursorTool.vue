<template>
    <div class="interact-area" @mousedown="mousedown">

    </div>
</template>

<script setup lang="ts">
import { Vec } from '@/core/Vec';
import { useLayerStore } from '@/stores/LayerStore';

const layerStore = useLayerStore();

let selected = false;

const start = new Vec();

function mousedown(e: MouseEvent) {
    const layer = layerStore.getCurrentLayer();
    const point = new Vec( e.offsetX, e.offsetY );

    if( layer.isPointInside( point ) ) {
        selected = layer;
        start.set( e.offsetX, e.offsetY );

        oldPos.set( layer.pos.x, layer.pos.y );
    }
}

const current = new Vec();

const oldPos = new Vec();

let isMoving = false;

window.addEventListener("mousedown", e => {
    if( selected !== null ) {
        isMoving = true;
    }

});

window.addEventListener("mousemove", e => {
    if( selected && isMoving ) {

        current.set( e.offsetX, e.offsetY );
        const dx = current.x - start.x;
        const dy = current.y - start.y;

        selected.pos.x = oldPos.x + dx;
        selected.pos.y = oldPos.y + dy;
    }
});

window.addEventListener("mouseup", e => {
    isMoving = false;
});
</script>