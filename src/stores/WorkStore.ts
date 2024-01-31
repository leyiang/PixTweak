// stores/counter.js
import type { ImgInfo, WorkSize } from '@/types/WorkStoreType';
import { defineStore } from 'pinia'

export const useWorkStore = defineStore('work-store', {
  state: () => {
    return {
      scale: 1,

      // Uploaded Image without Change
      originImage: null as HTMLImageElement | null,

      // Current Editing Image
      editingImage: null as HTMLImageElement | null,

      size: {
        width: 0,
        height: 0,
      } as WorkSize
    }
  },

  getters: {
    imageInfo(state) : ImgInfo {
      const image = state.editingImage;

      if( image === null ) {
        throw new Error("img is null");
      }

      const nw = image.naturalWidth;
      const nh = image.naturalHeight;

      return {
        nw: nw,
        nh: nh,

        w: nw,
        h: nh,
        cw: nw * this.scale,
        ch: nh * this.scale,
      }
    }
  },

  actions: {
    setWorkSize(width: number, height: number) {
      this.size.width = width;
      this.size.height = height;
    },

    setImage(image: HTMLImageElement) {
      this.originImage = image;
      this.setEditingImage( image );
    },

    setEditingImage(image: HTMLImageElement) {
      function getDefaultScale(imgInfo: ImgInfo, size: WorkSize) : number {
        let scale = 1;

        if( imgInfo.nh > size.height ) {
          scale = (size.height - 40) / imgInfo.nh;
        }

        return scale;
      }

      this.editingImage = image;
      this.scale = getDefaultScale( this.imageInfo, this.size );
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