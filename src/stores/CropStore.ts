// stores/counter.js
import { defineStore } from 'pinia'
import { useWorkStore } from './WorkStore';
import { cropImage, downloadCanvas } from '@/utils';
import { useCanvasStore } from './CanvasStore';
import { useLayerStore } from './LayerStore';
import { useToolStore } from './ToolStore';

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
    }
  },

  getters: {
    scaledRect(state) {
      const canvasStore = useCanvasStore();

      return {
        x: state.rect.x * canvasStore.scale,
        y: state.rect.y * canvasStore.scale,
        w: state.rect.w * canvasStore.scale,
        h: state.rect.h * canvasStore.scale,
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

    crop() {
      // const workStore = useWorkStore();

      // if(workStore.editingImage === null) {
      //     throw new Error("Image cannot be null");
      // }

      // Destination Width and Height
      // No need to scale
      const {w, h, x, y} = this.rect;

      // Set Canvas Sizes
      const canvasStore = useCanvasStore();
      canvasStore.setCanvasSize(w, h);

      const layerStore = useLayerStore();
      layerStore.layers.forEach( layer => {
        const resImage = cropImage(
            layer.source,
            x, y,
            w, h, w, h
        );

        layer.source = resImage;
      });

      this.updateCropInfo();
      const toolStore = useToolStore();

      toolStore.resetToolToDefault();
      // workStore.setEditingImage( resImage );
    }
  },
})