<template>
    <header class="app-header">
        <div class="app-upper">
            <button @click="createNewFile">New Canvas</button>
            <button @click="canvasStore.downloadResultCanvas">Save</button>
            <input type="file" name="" id="">
        </div>

        <div class="tool-header">
            <component
                v-if="toolStore.currentTool.headerComponent"
                :is="toolStore.currentTool.headerComponent"
            ></component>

            <span v-else>
                No Header Component for this tool
            </span>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useCanvasStore } from '@/stores/CanvasStore';
import { useLayerStore } from '@/stores/LayerStore';
import { useToolStore } from '@/stores/ToolStore';

const toolStore = useToolStore();
const canvasStore = useCanvasStore();
const layerStore = useLayerStore();

function createNewFile() {
    layerStore.clear();
    canvasStore.setCanvasSize(500, 500);
    layerStore.addEmptyLayer();
}
</script>