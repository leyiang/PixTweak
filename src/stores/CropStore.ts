// stores/counter.js
import { defineStore } from 'pinia'
export const useCropStore = defineStore('crop-store', {
  state: () => {

    return {
    }
  },


  actions: {
    upscale( factor = .25) {
      this.scale += factor;

      // cropInfo.image.style.width = `${imgInfo.cw}px`;
      // cropInfo.image.style.height = `${imgInfo.ch}px`;

      // console.log(cropInfo.image);
    },

    downscale() {

    },
  },
})