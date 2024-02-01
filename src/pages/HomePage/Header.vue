<template>
    <header class="app-header">
        <div class="app-upper">
            <button @click="canvasStore.downloadResultCanvas">Save</button>
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
import { useToolStore } from '@/stores/ToolStore';

const toolStore = useToolStore();
const canvasStore = useCanvasStore();
</script>