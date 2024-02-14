import { defineStore } from 'pinia'
import { useToolStore } from './ToolStore'

export const useSelectStore = defineStore('select-store', {
  state: () => {

    return {

    }
  },


  actions: {
    mousedown(e: MouseEvent) {
        const toolStore = useToolStore();
        console.log( toolStore.currentTool );
    }
  },
})