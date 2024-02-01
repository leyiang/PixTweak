<template>
    <div class="tool-list">
        <button
            v-for="[id, tool] in toolStore.tools"
            @click="toolStore.setCurrentTool(id)"
            class="tool-item"
            :title="tool.name"
        >
            <Icon :icon="tool.icon"></Icon>
        </button>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import "@/assets/style/components/ToolListStyle.css"
import { useToolStore } from '@/stores/ToolStore';

const toolStore = useToolStore();
</script>