<template>
    <label for="crop-w">width</label>
    <input type="number" v-model="cropStore.rect.w">

    <label for="crop-w">height</label>
    <input type="number" v-model="cropStore.rect.h">

    <label for="crop-w">x</label>
    <input type="number" v-model="cropStore.rect.x">

    <label for="crop-w">y</label>
    <input type="number" v-model="cropStore.rect.y">
</template>

<script setup lang="ts">
import { useCropStore } from '@/stores/CropStore';

const cropStore = useCropStore();
</script>