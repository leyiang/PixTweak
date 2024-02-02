import type { SupportImageSource, WorkSize } from '@/types/WorkStoreType'
import { defineStore } from 'pinia'
import { useWorkStore } from './WorkStore';
import { markRaw } from 'vue';
import { downloadCanvas } from '@/utils';

export const useCanvasStore = defineStore('canvas-store', {
  state: () => {
    return {
      canvasInit: false,
      w: 0,
      h: 0,
      scale: 1,

      drawings: [],
      resultCanvas: null as null | HTMLCanvasElement
    }
  },

  getters: {
    scaledWidth: (state) => {
      return state.w * state.scale;
    },

    scaledHeight: (state) => {
      return state.h * state.scale;
    }
  },

  actions: {
    setCanvasSizeBy(source: SupportImageSource) {
      let nw = 0, nh = 0;

      if( source instanceof HTMLImageElement ) {
        nw = source.naturalWidth;
        nh = source.naturalHeight;
      } else if ( source instanceof HTMLCanvasElement ) {
        nw = source.width;
        nh = source.height;
      }

      this.setCanvasSize(nw, nh);
    },

    setCanvasSize(w: number, h:number) {
      this.w = w;
      this.h = h;

      this.setDefaultScale();
    },

    setDefaultScale() {
      function getDefaultScale(w: number, h: number, size: WorkSize) : number {
        let scale = 1;

        if( h > size.height ) {
          scale = (size.height - 40) / h;
        }

        return scale;
      }

      const workStore = useWorkStore();

      // this.scale = getDefaultScale( this.w, this.h, workStore.size );
      this.scale = 1;
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

    setResultCanvas( canvas: HTMLCanvasElement ) {
      this.resultCanvas = markRaw(canvas);
    },

    downloadResultCanvas() {
      if( this.resultCanvas === null ) {
        return;
      }

      downloadCanvas( this.resultCanvas, "save");
    },

    getEmptyCanvas() {
        const canvas = document.createElement("canvas");

        canvas.width = this.w;
        canvas.height = this.h;

        return canvas;
    }
  },
})