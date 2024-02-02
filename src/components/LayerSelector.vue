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

                    <div
                        class="layer-preview"
                        :class="{selected: ! layer.paintOnMask}"
                        @click="layer.paintOnMask = false"
                    ></div>
                    <span>{{ layer.name }}</span>

                    <div
                        v-if="layer.mask !== null"
                        class="mask-preview"
                        :class="{selected: layer.paintOnMask}"
                        @click="layer.paintOnMask = true"
                    >
                    </div>
                </div>
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

const layerStore = useLayerStore();
const reversedLayers = computed(() => {
    return layerStore.layers.slice().reverse();
});

function addMask() {
    const layer = layerStore.getCurrentLayer();
    layer.createMask();
}
</script>
