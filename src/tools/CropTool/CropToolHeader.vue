<template>
    <span>Crop Tool </span>

    <label for="crop-w">width</label>
    <input type="number" v-model="cropStore.rect.w">

    <label for="crop-w">height</label>
    <input type="number" v-model="cropStore.rect.h">

    <label for="crop-w">x</label>
    <input type="number" v-model="cropStore.rect.x">

    <label for="crop-w">y</label>
    <input type="number" v-model="cropStore.rect.y">

    <button id="crop-btn" @click="cropStore.crop()">Crop</button>
    <button @click="resetCrop">Reset</button>
</template>

<script setup lang="ts">
import { useCropStore } from '@/stores/CropStore';
import { useWorkStore } from '@/stores/WorkStore';

const cropStore = useCropStore();
const workStore = useWorkStore();

function resetCrop() {
    workStore.useOriginalImage();
}
</script>