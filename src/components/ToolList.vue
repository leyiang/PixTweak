<template>
    <div class="tool-list">
        <button
            v-for="[id, tool] in toolStore.tools"
            @click="toolStore.setCurrentTool(id)"
        >{{ tool.name }}</button>
    </div>
</template>

<script setup lang="ts">
import { useToolStore } from '@/stores/ToolStore';

const toolStore = useToolStore();
</script>