import BrushToolVue from '@/tools/BrushTool/BrushTool.vue';
import BrushToolHeaderVue from '@/tools/BrushTool/BrushToolHeader.vue';
import CropToolVue from '@/tools/CropTool/CropTool.vue';
import CropToolHeaderVue from '@/tools/CropTool/CropToolHeader.vue';
import CursorToolVue from '@/tools/CursorTool/CursorTool.vue'
import { defineStore } from 'pinia'
import { markRaw } from 'vue';

export const useToolStore = defineStore('tool-store', {
  state: () => {

    const tools = new Map()

    tools.set("cursor-tool", {
        name: "Cursor",
        icon: "fluent:cursor-16-regular",
        headerComponent: null,
        mainComponent: markRaw(CursorToolVue),
    });

    tools.set("crop-tool", {
        name: "Crop",
        icon: "ri:crop-line",
        headerComponent: markRaw(CropToolHeaderVue),
        mainComponent: markRaw(CropToolVue),
    });

    tools.set("brush-tool", {
        name: "Brush",
        icon: "ph:paint-brush-fill",
        headerComponent: markRaw(BrushToolHeaderVue),
        mainComponent: markRaw(BrushToolVue),
    });

    return {
        tools,
        currentID: "cursor-tool",
    }
  },

  getters: {
    currentTool(state) {
        return state.tools.get( state.currentID );
    }
  },

  actions: {
    resetToolToDefault() {
        this.setCurrentTool("cursor-tool");
    },

    setCurrentTool( id: string ) {
        this.currentID = id;
    },
  },
})