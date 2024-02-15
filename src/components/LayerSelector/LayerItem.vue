<template>
    <div
        class="layer-item"
        :class="{ drag: dragging, 'drag-over': dragOver }"
        draggable="true"

        @dragstart="handleDragStart"
        @dragenter="handleDragEnter"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @dragend="handleDragEnd"
    >
        <input
            v-model="layer.visibility"
            type="checkbox"
            class="visibility-toggler"
        >

        <div
            :class="{selected: ! layer.paintOnMask}"
            :style="previewSize"
            @click="layer.paintOnMask = false"

            class="layer-preview"
        >
            <canvas ref="previewCanvas"></canvas>
        </div>

        <span>{{ layer.name }}</span>

        <div
            v-if="layer.mask !== null"
            class="mask-preview"
            :class="{selected: layer.paintOnMask}"
            @click="layer.paintOnMask = true"
        >
        </div>
    </div>
</template>

<script setup lang="ts">
import { Layer } from '@/core/Layer';
import { useBrushStore } from '@/stores/BrushStore';
import { useCanvasStore } from '@/stores/CanvasStore';
import { useLayerStore } from '@/stores/LayerStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';

const layerStore = useLayerStore();
const canvasStore = useCanvasStore();
const brushStore = useBrushStore();
const { drawings } = storeToRefs( brushStore )

const previewCanvas = ref<null | HTMLCanvasElement>(null);
let previewCtx = null as null | CanvasRenderingContext2D;

const props = defineProps({
    layer: { type: Layer, required: true }
});

watch(drawings, () => {
    drawPreview();
}, {
    deep: true
});
// watch(props.layer, () => {
//     console.log( props.layer );
// });

function drawPreview() {
    if( previewCanvas.value === null ) return;

    if( previewCtx === null ) {
        previewCtx = previewCanvas.value.getContext("2d");
    }

    if( previewCtx === null ) {
        // previewCanvas called getContext with 'webgl' somewhere else
        // Error
        throw new Error("Wrong context see here");
    }

    const scale = props.layer.source.width / DEFAULT_PREVIEW_WIDTH;
    props.layer.renderLayer( previewCtx, 1 / scale );
}

onMounted(() => {
    if( previewCanvas.value === null ) {
        return;
    }

    previewCanvas.value.width = DEFAULT_PREVIEW_WIDTH;
    previewCanvas.value.height = DEFAULT_PREVIEW_WIDTH * (canvasStore.h / canvasStore.w);
    drawPreview();
});

const DEFAULT_PREVIEW_WIDTH = 40;

const previewSize = computed(() => {
    const h = DEFAULT_PREVIEW_WIDTH * (canvasStore.h / canvasStore.w);

    return {
        width: DEFAULT_PREVIEW_WIDTH + "px",
        height: h + "px",
    }
});

const dragging = ref(false);
const dragOver = ref(false);

function handleDragStart(e: DragEvent) {
    dragging.value = true;
    layerStore.setCurrentDragging( props.layer.id );
}

function handleDragEnter(e: DragEvent) {
    if( layerStore.currentDraggingID === props.layer.id ) {
        return;
    }
    
    dragOver.value = true;
}

function handleDragOver(e: DragEvent) {
    e.preventDefault();
}

function handleDragEnd() {
    dragging.value = false;
    layerStore.setCurrentDragging( null );
}

function handleDragLeave() {
    dragOver.value = false;
}

function handleDrop() {
    dragOver.value = false;

    if( layerStore.currentDraggingID !== null ) {
        layerStore.swapLayer( props.layer.id, layerStore.currentDraggingID );
    }
}
</script>