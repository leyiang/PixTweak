<template>
    <div class="brush-area" @mouseout="resetDrawing">
        <div
            class="brush-cursor"
            :style="brushCursorStyle"
        ></div>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/tools/BrushToolStyle.css"
import { useCanvasStore } from "@/stores/CanvasStore";
import { useLayerStore } from "@/stores/LayerStore";
import { renderDrawings } from "@/utils";
import { computed, reactive, ref } from "vue";

const pos = reactive({
    x: 0,
    y: 0,
    hidden: false,
});

const brushCursorStyle = computed(() => {
    return {
        opacity: pos.hidden ? 0 : 1,
        transform: `translate(${ pos.x }px, ${ pos.y }px)`
    };
});

function hideCursor() {
    pos.hidden = true;
}

const paintStart = ref(false);

window.addEventListener("mousedown", e => {
    if( ! (e.target instanceof HTMLElement) ) {
        return;
    }

    if( e.target.classList.contains("brush-area") ) {
        paintStart.value = true;
    }
});

const canvasStore = useCanvasStore();

window.addEventListener("mousemove", e => {
    if( paintStart.value ) {
        canvasStore.drawings.push( {x: e.offsetX, y:e.offsetY} );

    const layer = layerStore.getCurrentLayer();
    const ctx = layer.source.getContext("2d");
    renderDrawings( canvasStore.drawings, ctx, canvasStore.scale );
    }
});

const layerStore = useLayerStore();

function resetDrawing() {
    paintStart.value = false;
    canvasStore.drawings = [];
}

window.addEventListener("mouseup", e => {
    paintStart.value = false;
    canvasStore.drawings = [];
});
</script>