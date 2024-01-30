// stores/counter.js
import { defineStore } from 'pinia'
export const useCropStore = defineStore('crop-store', {
  state: () => {
    const defaultCropWidth = 100;
    const defaultCropHeight = 100;

    return {
      rect: {
        x: 0,
        y: 0,
        w: defaultCropWidth,
        h: defaultCropHeight,
      },

      oldRect: {
        x: 0,
        y: 0,
        w: defaultCropWidth,
        h: defaultCropHeight,
      },

      isMoving: false,
      isResizing: false,

      resizing: {
        left: false,
        top: false,
        bottom: false,
        right: false,
      }
    }
  },


  actions: {
  },
})