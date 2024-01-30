// stores/counter.js
import { defineStore } from 'pinia'

export const useImageStore = defineStore('image', {
  state: () => {
    return {
      image: null as HTMLImageElement | null
    }
  },

  getters: {
    info(state) {
      const { image } = state;

      if( image === null ) {
        throw new Error("img is null");
      }

      return {
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,

        w: image.naturalWidth,
        h: image.naturalHeight,
        cw: image.naturalWidth,
        ch: image.naturalHeight,
      }
    }
  },

  actions: {
    setImage(image: HTMLImageElement) {
      this.image = image;
    }
  },
})