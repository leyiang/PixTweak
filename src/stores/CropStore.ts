// stores/counter.js
import type { ImgInfo } from '@/types/CropStoreType';
import { defineStore } from 'pinia'
export const useCropStore = defineStore('image', {
  state: () => {
    return {
      scale: 1,
      image: null as HTMLImageElement | null
    }
  },

  getters: {
    info(state) : ImgInfo {
      const { image } = state;

      if( image === null ) {
        throw new Error("img is null");
      }

      const nw = image.naturalWidth;
      const nh = image.naturalHeight;

      return {
        naturalWidth: nw,
        naturalHeight: nh,

        w: nw,
        h: nh,
        cw: nw * this.scale,
        ch: nh * this.scale,
      }
    }
  },

  actions: {
    setImage(image: HTMLImageElement) {
      this.image = image;
    },

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