<template>
    <header class="app-header">
        <component
            v-if="toolStore.currentTool.headerComponent"
            :is="toolStore.currentTool.headerComponent"
        ></component>

        <span v-else>
            No Header Component for this tool
        </span>
    </header>
</template>

<script setup lang="ts">
import { useToolStore } from '@/stores/ToolStore';

const toolStore = useToolStore();
</script>