import BrushToolVue from '@/tools/BrushTool/BrushTool.vue';
import BrushToolHeaderVue from '@/tools/BrushTool/BrushToolHeader.vue';
import CropToolHeaderVue from '@/tools/CropTool/CropToolHeader.vue';
import CursorToolVue from '@/tools/CursorTool/CursorTool.vue'
import { defineStore } from 'pinia'
import { markRaw } from 'vue';
import { useKeyboardStore } from './KeyboardStore';
import CropToolVue from '@/tools/CropTool/CropTool.vue';
import { Tool } from '@/core/Tool';

export const useToolStore = defineStore('tool-store', {
    state: () => {

        const tools = new Map() as Map<string, Tool>;

        const toolList = [
            new Tool("cursor-tool", markRaw(CursorToolVue), {
                name: "Cursor",
                icon: "fluent:cursor-16-regular",
                headerComponent: null,
                shortcut: "v",
            }),
            new Tool("crop-tool", markRaw(CropToolVue), {
                name: "Crop",
                icon: "ri:crop-line",
                headerComponent: markRaw(CropToolHeaderVue),
                shortcut: "c",
            }),
            new Tool("brush-tool", markRaw(BrushToolVue), {
                name: "Brush",
                icon: "ph:paint-brush-fill",
                headerComponent: markRaw(BrushToolHeaderVue),
                shortcut: "b",
            }),
        ];

        toolList.forEach(tool => {
            tools.set(tool.id, tool);
        });

        return {
            tools,
            currentID: "cursor-tool",
        }
    },

    getters: {
        currentTool(state) {
            return state.tools.get(state.currentID);
        }
    },

    actions: {
        resetToolToDefault() {
            this.setCurrentTool("cursor-tool");
        },

        setCurrentTool(id: string) {
            this.currentID = id;
        },

        registerShortcuts() {
            const keyStore = useKeyboardStore();

            for (let [key, tool] of this.tools) {
                keyStore.keyState.addMapping(tool.shortcut, () => {
                    this.setCurrentTool(key);
                });
            }
        }
    },
})