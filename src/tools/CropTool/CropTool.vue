<template>
        <div class="image-cropper" :class="imgCropperClass">
            <div
                class="image-mask"
                v-show="! panStore.dragging"
            ></div>

            <div
                class="crop-area"
                :style="cropAreaStyle"
                v-show="! panStore.dragging"
            >
                <div class="crop-handle handle-top handle-left"></div>
                <div class="crop-handle handle-top handle-hmid"></div>
                <div class="crop-handle handle-top handle-right"></div>
                <div class="crop-handle handle-vmid handle-left"></div>
                <div class="crop-handle handle-vmid handle-right"></div>
                <div class="crop-handle handle-bottom handle-left"></div>
                <div class="crop-handle handle-bottom handle-hmid"></div>
                <div class="crop-handle handle-bottom handle-right"></div>
            </div>
        </div>
</template>

<script setup lang="ts">
import "@/assets/style/tools/CropToolStyle.css"
import { mouseState } from "@/core/MouseState";
import { useCanvasStore } from "@/stores/CanvasStore";
import { useCropStore } from "@/stores/CropStore";
import { usePanStore } from "@/stores/PanStore";
import { useWorkStore } from "@/stores/WorkStore";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";

const canvasStore = useCanvasStore();
const cropStore = useCropStore();
const workStore = useWorkStore();

const { editingImage } = storeToRefs(workStore);
const panStore = usePanStore();

// watch(editingImage, () => {
//     cropStore.updateCropInfo();
// });

document.addEventListener("keydown", e => {
    if( e.key === "Enter" ) {
        cropStore.crop(); 
    }
});

const imgCropperClass = computed(() => {
    return {
        resizing: cropStore.isResizing,
        "resize-left": cropStore.resizing.left,
        "resize-right": cropStore.resizing.right,
        "resize-top": cropStore.resizing.top,
        "resize-bottom": cropStore.resizing.bottom,
    }
});

const cropAreaStyle = computed(() => {
    return {
        width: cropStore.scaledRect.w + "px",
        height: cropStore.scaledRect.h + "px",
        transform: `translate(${cropStore.scaledRect.x}px, ${cropStore.scaledRect.y}px)`
    }
});

function resetMouse(e: MouseEvent) {
    cropStore.isMoving = false;

    cropStore.isResizing = false;
    cropStore.resizing.right = false;
    cropStore.resizing.top = false;
    cropStore.resizing.bottom = false;
    cropStore.resizing.left = false;

    cropStore.oldRect.w = cropStore.rect.w;
    cropStore.oldRect.h = cropStore.rect.h;
}

mouseState.onMouseUp( resetMouse );
mouseState.onMouseDown((e: MouseEvent) => {
    cropStore.isMoving = true;

    cropStore.oldRect.x = cropStore.rect.x;
    cropStore.oldRect.y = cropStore.rect.y;
}, ".crop-area" );


mouseState.onMouseDown((e: MouseEvent) => {
    // This is sure checked inside mouseState
    const target = e.target as Element;

    cropStore.isResizing = true;

    cropStore.oldRect.w = cropStore.rect.w;
    cropStore.oldRect.h = cropStore.rect.h;

    cropStore.oldRect.x = cropStore.rect.x;
    cropStore.oldRect.y = cropStore.rect.y;

    if (target.classList.contains("handle-left")) {
        cropStore.resizing.left = true;
    }

    if (target.classList.contains("handle-right")) {
        cropStore.resizing.right = true;
    }

    if (target.classList.contains("handle-top")) {
        cropStore.resizing.top = true;
    }

    if (target.classList.contains("handle-bottom")) {
        cropStore.resizing.bottom = true;
    }
}, ".crop-handle");

// Moveing Crop Area
mouseState.onMouseMove((e, dx, dy) => {
    console.log(dx, dy );
    
    dx /= canvasStore.scale;
    dy /= canvasStore.scale;

    cropStore.rect.x = cropStore.oldRect.x + dx;

    if (cropStore.rect.x < 0) cropStore.rect.x = 0;
    if (cropStore.rect.x + cropStore.rect.w > canvasStore.w) {
        cropStore.rect.x = canvasStore.w - cropStore.rect.w;
    }

    cropStore.rect.y = cropStore.oldRect.y + dy;

    if (cropStore.rect.y < 0) cropStore.rect.y = 0;
    if (cropStore.rect.y + cropStore.rect.h > canvasStore.h) {
        cropStore.rect.y = canvasStore.h - cropStore.rect.h;
    }
}, () => cropStore.isMoving);


// Resizing Crop Area
mouseState.onMouseMove((e, dx, dy) => {
    dx /= canvasStore.scale;
    dy /= canvasStore.scale;

    if (cropStore.resizing.left) {
        cropStore.rect.x = cropStore.oldRect.x + dx;
        cropStore.rect.w = cropStore.oldRect.w - dx;

        if (cropStore.rect.x < 0) {
            let offset = cropStore.rect.x;
            cropStore.rect.x = 0;
            cropStore.rect.w += offset;
        }
    }

    if (cropStore.resizing.right) {
        cropStore.rect.w = cropStore.oldRect.w + dx;
        if (cropStore.rect.w + cropStore.rect.x > canvasStore.w) {
            cropStore.rect.w = canvasStore.w - cropStore.rect.x;
        }
    }

    if (cropStore.resizing.bottom) {
        cropStore.rect.h = cropStore.oldRect.h + dy;
        if (cropStore.rect.h + cropStore.rect.y > canvasStore.h) {
            cropStore.rect.h = canvasStore.h - cropStore.rect.y;
        }
    }

    if (cropStore.resizing.top) {
        cropStore.rect.y = cropStore.oldRect.y + dy;
        cropStore.rect.h = cropStore.oldRect.h - dy;

        if (cropStore.rect.y < 0) {
            let offset = cropStore.rect.y;
            cropStore.rect.y = 0;
            cropStore.rect.h += offset;
        }
    }
}, () => cropStore.isResizing);
</script>