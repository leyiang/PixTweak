<template>
    <div class="layer-selector">
        <template v-if="layerStore.hasLayer()">
            <div class="layer-list">
                <div
                    v-for="(layer, index) in layerStore.layers"
                    class="layer-item"
                    :class="{selected: layerStore.currentLayerIndex === index}"
                    @click.self="layerStore.switchCurrentLayer(index)"
                >
                    <input
                        v-model="layer.visibility"
                        type="checkbox"
                        class="visibility-toggler"
                    >

                    <div class="layer-preview"></div>
                    <span>{{ layer.name }}</span>
                </div>
            </div>
        </template>

        <div v-else class="layer-item">
            No layers
        </div>

        <button @click="layerStore.addEmptyLayer">+</button>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/components/LayerSelectorStyle.css"
import { useLayerStore } from "@/stores/LayerStore";
import { computed } from "vue";

const layerStore = useLayerStore();
const reversedLayers = computed(() => {
    return layerStore.layers.slice().reverse();
});
</script>
