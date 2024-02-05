<template>
    <div class="brush-area"
        @mouseout="mouseout"
        @mouseenter="mouseenter"
        ref="dArea"
    >
        <div
            class="brush-cursor"
            :style="brushCursorStyle"
        ></div>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/tools/BrushToolStyle.css"
import { Vec } from "@/core/Vec";
import { useBrushStore } from "@/stores/BrushStore";
import { useCanvasStore } from "@/stores/CanvasStore";
import { useLayerStore } from "@/stores/LayerStore";
import { computed, reactive, ref } from "vue";

const cursorInfo = reactive({
    pos: new Vec(0, 0),
    hidden: false,
});

const brushStore = useBrushStore();
const canvasStore = useCanvasStore();

const brushCursorStyle = computed(() => {
    const { pos } = cursorInfo;
    const scale = canvasStore.scale;
    const radius  = (brushStore.lineWidth / 2) * scale;

    return {
        width: radius * 2  + "px",
        height: radius * 2 + "px",
        opacity: cursorInfo.hidden ? 0 : 1,
        transform: `translate(${ pos.x - radius }px, ${ pos.y - radius }px)`
    };
});

const paintStart = ref(false);

window.addEventListener("mousedown", e => {
    if( ! (e.target instanceof HTMLElement) ) {
        return;
    }

    // Only left click can draw
    if( e.target.classList.contains("brush-area") && e.buttons === 1 ) {
        paintStart.value = true;
    }
});


window.addEventListener("mousemove", e => {
    // While resizing the brush
    // Stop udpateing position
    // TODO: using pointer lock
    if( ! brushStore.resizing ) {
        cursorInfo.pos.set(e.offsetX, e.offsetY);
    }
    
    if( paintStart.value ) {
        brushStore.drawings.push(
            new Vec(e.offsetX, e.offsetY)
        );

        const layer = layerStore.getCurrentLayer();
        const ctx = layer.getContext();;

        brushStore.renderDrawings( ctx, layer.paintOnMask );
    }
});

const layerStore = useLayerStore();

function resetDrawing() {
    paintStart.value = false;
    brushStore.drawings.length = 0;
}

function mouseout() {
    cursorInfo.hidden = true;
    resetDrawing();
}

function mouseenter() {
    cursorInfo.hidden = false;
}

window.addEventListener("mouseup", resetDrawing);
</script>