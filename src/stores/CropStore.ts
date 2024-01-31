// stores/counter.js
import { defineStore } from 'pinia'
import { useWorkStore } from './WorkStore';
import { cropImage, downloadCanvas } from '@/utils';

const defaultCropWidth = 100;
const defaultCropHeight = 100;

export const useCropStore = defineStore('crop-store', {
  state: () => {

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
      },

      currentScale: 1,
    }
  },

  getters: {
    scaledRect(state) {
      return {
        x: state.rect.x * state.currentScale,
        y: state.rect.y * state.currentScale,
        w: state.rect.w * state.currentScale,
        h: state.rect.h * state.currentScale,
      }
    }
  },

  actions: {
    updateCropInfo() {
      this.rect = {
        x: 0,
        y: 0,
        w: defaultCropWidth,
        h: defaultCropHeight,
      };
    },

    syncOldRect() {
      console.log( this.oldRect );
      Object.assign( this.oldRect, this.rect );
      console.log( this.oldRect );
    },

    applyScale( scale: number ) {
      if( scale === this.currentScale ) return;
      this.currentScale = scale;
    },

    crop() {
      const workStore = useWorkStore();

      if(workStore.editingImage === null) {
          throw new Error("Image cannot be null");
      }

      // Destination Width and Height
      // No need to scale
      let {w, h, x, y} = this.rect;

      const resImage = cropImage(
          workStore.editingImage,
          x, y,
          w, h, w, h
      );

      workStore.setEditingImage( resImage );
    }
  },
})