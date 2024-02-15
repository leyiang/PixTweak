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
            class="layer-preview"
            :class="{selected: ! layer.paintOnMask}"
            @click="layer.paintOnMask = false"
        ></div>

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
import { useLayerStore } from '@/stores/LayerStore';
import { ref } from 'vue';

const layerStore = useLayerStore();
const props = defineProps({
    layer: { type: Layer, required: true }
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