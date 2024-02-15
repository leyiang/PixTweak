<template>
    <div class="layer-selector">
        <template v-if="layerStore.hasLayer()">
            <div class="layer-list">
                <TransitionGroup name="list">
                    <LayerItem
                        v-for="(layer, index) in layerStore.layers"
                        :key="layer.id"
                        :layer="layer"
                        :class="{selected: layerStore.currentLayerIndex === index}"
                        @click.self="layerStore.switchCurrentLayer(index)"
                    />
                </TransitionGroup>
            </div>
        </template>

        <div v-else class="layer-item">
            No layers
        </div>

        <div class="layer-actions">
            <button
                class="layer-action-btn"
                @click="layerStore.addEmptyLayer"
            >+</button>

            <button
                class="layer-action-btn"
                @click="addMask"
            >
                <Icon icon="radix-icons:mask-on"></Icon>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/components/LayerSelectorStyle.css"
import { useLayerStore } from "@/stores/LayerStore";
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import LayerItem from "./LayerItem.vue";

const layerStore = useLayerStore();
const reversedLayers = computed(() => {
    return layerStore.layers.slice().reverse();
});

function addMask() {
    const layer = layerStore.getCurrentLayer();
    layer.createMask();
}
</script>
