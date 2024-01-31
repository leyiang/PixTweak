// stores/counter.js
import type { ImgInfo, SupportImageSource, WorkSize } from '@/types/WorkStoreType';
import { defineStore } from 'pinia'
import { useWorkAreaDraggingStore } from './WorkAreaDraggingStore';

export const useWorkStore = defineStore('work-store', {
  state: () => {
    return {
      scale: 1,

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
    imageInfo(state) : ImgInfo {
      const image = state.editingImage;

      if( image === null ) {
        throw new Error("img is null");
      }

      let nw = 0, nh = 0;

      if( image instanceof HTMLImageElement ) {
        nw = image.naturalWidth;
        nh = image.naturalHeight;
      } else if ( image instanceof HTMLCanvasElement ) {
        nw = image.width;
        nh = image.height;
      }

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

    setImage(image: SupportImageSource) {
      setTimeout(() => {
        this.setEditingImage( image );
      }, 0);

      this.originImage = image;
    },

    setEditingImage(image: SupportImageSource) {
      const areaDraggingStore = useWorkAreaDraggingStore();

      this.editingImage = image;
      this.setDefaultScale();
      areaDraggingStore.resetMoveOffset();
    },

    setDefaultScale() {
      function getDefaultScale(imgInfo: ImgInfo, size: WorkSize) : number {
        let scale = 1;

        if( imgInfo.nh > size.height ) {
          scale = (size.height - 40) / imgInfo.nh;
        }

        return scale;
      }

      this.scale = getDefaultScale( this.imageInfo, this.size );
    },

    zoomIn( factor = .1) {
      this.scale += factor;
      console.log("Work Store: sacle changed", this.scale);
      
      // cropInfo.image.style.width = `${imgInfo.cw}px`;
      // cropInfo.image.style.height = `${imgInfo.ch}px`;

      // console.log(cropInfo.image);
    },

    zoomOut(factor = .1) {
      // min scale is .2
      if( this.scale <= .2 ) {
        return;
      }

      this.scale -= factor;
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