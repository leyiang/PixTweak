<template>
    <span>Brush Tool</span>

    <input type="color" name="" id="" v-model="brushStore.color">
</template>

<script setup lang="ts">
import { useBrushStore } from '@/stores/BrushStore';

const brushStore = useBrushStore();
</script>