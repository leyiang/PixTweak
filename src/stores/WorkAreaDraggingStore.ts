import { defineStore } from 'pinia'

export const useWorkAreaDraggingStore = defineStore('work-area-dragging', {
  state: () => {

    return {
      // User able to drag zoomed image
      dragging: false,

      // User drag dx,dy data
      moveOffset: {
        x: 0,
        y: 0
      },

      oldOffset: {
        x: 0,
        y: 0
      }
    }
  },


  actions: {
    resetMoveOffset() {
        this.moveOffset.x = 0;
        this.moveOffset.y = 0;
    }
  },
})