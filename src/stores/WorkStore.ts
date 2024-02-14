// stores/counter.js
import type { ImgInfo, SupportImageSource, WorkSize } from '@/types/WorkStoreType';
import { defineStore } from 'pinia'
import { usePanStore } from './PanStore';

export const useWorkStore = defineStore('work-store', {
  state: () => {
    return {
      // Uploaded Image without Change
      originImage: null as SupportImageSource | null,

      // Current Editing Image
      editingImage: null as SupportImageSource | null,

      size: {
        width: 0,
        height: 0,
      } as WorkSize,
    }
  },

  getters: {
    // imageInfo(state) : ImgInfo {
    //   const image = state.editingImage;

    //   if( image === null ) {
    //     throw new Error("img is null");
    //   }

    //   let nw = 0, nh = 0;

    //   if( image instanceof HTMLImageElement ) {
    //     nw = image.naturalWidth;
    //     nh = image.naturalHeight;
    //   } else if ( image instanceof HTMLCanvasElement ) {
    //     nw = image.width;
    //     nh = image.height;
    //   }

    //   return {
    //     nw: nw,
    //     nh: nh,

    //     w: nw,
    //     h: nh,
    //     cw: nw * this.scale,
    //     ch: nh * this.scale,
    //   }
    // }
  },

  actions: {
    setWorkSize(width: number, height: number) {
      this.size.width = width;
      this.size.height = height;
    },

    setImage(image: SupportImageSource) {
      setTimeout(() => {
        this.setEditingImage( image );
      }, 0);

      this.originImage = image;
    },

    setEditingImage(image: SupportImageSource) {
      const panStore = usePanStore();

      this.editingImage = image;
      // this.setDefaultScale();
      panStore.resetMoveOffset();
    },

    useOriginalImage() {
      if( this.originImage === null ) {
        // Log
        return;
      }

      this.setEditingImage( this.originImage );
    }
  },
})