<template>
    <div class="image-cropper" :class="imgCropperClass">
        <div class="image-wrap">
            <canvas ref="dCanvas"></canvas>
            <div
                class="image-mask"
                v-show="! areaDraggingStore.dragging"
            ></div>
        </div>

        <div
            class="crop-area"
            ref="dCropArea"
            :style="cropAreaStyle"
            v-show="! areaDraggingStore.dragging"
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
import "@/assets/style/components/CropStyle.css"
import { useCropStore } from "@/stores/CropStore";
import { useWorkAreaDraggingStore } from "@/stores/WorkAreaDraggingStore";
import { useWorkStore } from "@/stores/WorkStore";
import type { SupportImageSource } from "@/types/WorkStoreType";
import { downloadCanvas } from "@/utils";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";

const cropStore = useCropStore();
const workStore = useWorkStore();
const dCropArea = ref(null);
const dCanvas = ref<HTMLCanvasElement | null>(null);

const { scale, editingImage } = storeToRefs(workStore);
const areaDraggingStore = useWorkAreaDraggingStore();

watch(editingImage,() => {
    const repaintProcessed = updateEditingImage( editingImage.value )

    if( repaintProcessed ) {
        cropStore.updateCropInfo();
    }
});

// Keep track of scale value
// Remove the meaning less repaint on scale init
let currentScale = -1;

watch(scale,() => {
    /*
     * No need to repaint
     */
    if( scale.value === currentScale ) {
        return;
    }

    updateEditingImage( editingImage.value )
});

watch(scale, () => {
    cropStore.applyScale( scale.value );
});

/**
 * Return value indicates is repaint processed 
 */
function updateEditingImage( imageSource: SupportImageSource | null ) : boolean {
    currentScale = scale.value;
    
    if( imageSource === null ) {
        // Image is Null Logic
        return false;
    }

    const canvas = dCanvas.value;

    if( canvas === null ) {
        throw new Error("app is setting image, but canvas element cannot be retrived")
    }

    const ctx = canvas.getContext("2d");

    if( ctx === null ) {
        throw new Error("Someone reached the canvas, and getContext('webgl') before. Check it.")
    }

    console.log("REpaint!", imageSource );

    const { cw, ch } = workStore.imageInfo;

    canvas.width = cw;
    canvas.height = ch;

    ctx.drawImage( imageSource, 0, 0, cw, ch);

    return true;
}

document.addEventListener("keydown", e => {
    if( e.key === "Enter" ) {
        cropStore.crop(); 
    }
});

const mouseInfo = reactive({
    startX: 0,
    startY: 0,

    currentX: 0,
    currentY: 0,
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

window.addEventListener("mouseup", resetMouse);
window.addEventListener("mousemove", mousemove);
window.addEventListener("mousedown", mousedown);

function mousedown(e: MouseEvent) {

    if (e.target === dCropArea.value) {
        mouseInfo.startX = e.clientX;
        mouseInfo.startY = e.clientY;

        cropStore.isMoving = true;

        cropStore.oldRect.x = cropStore.rect.x;
        cropStore.oldRect.y = cropStore.rect.y;

        return;
    }

    const { target } = e;

    if (target instanceof HTMLElement && target.classList.contains("crop-handle")) {
        mouseInfo.startX = e.clientX;
        mouseInfo.startY = e.clientY;

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
    }
}

function mousemove(e: MouseEvent) {
    const imgInfo = workStore.imageInfo;

    if (cropStore.isMoving || cropStore.isResizing) {
        mouseInfo.currentX = e.clientX;
        mouseInfo.currentY = e.clientY;

        const dx = (mouseInfo.currentX - mouseInfo.startX) / workStore.scale;
        const dy = (mouseInfo.currentY - mouseInfo.startY) / workStore.scale;

        if (cropStore.isMoving) {
            cropStore.rect.x = cropStore.oldRect.x + dx;

            if (cropStore.rect.x < 0) cropStore.rect.x = 0;
            if (cropStore.rect.x + cropStore.rect.w > imgInfo.w) {
                cropStore.rect.x = imgInfo.w - cropStore.rect.w;
            }

            cropStore.rect.y = cropStore.oldRect.y + dy;

            if (cropStore.rect.y < 0) cropStore.rect.y = 0;
            if (cropStore.rect.y + cropStore.rect.h > imgInfo.h) {
                cropStore.rect.y = imgInfo.h - cropStore.rect.h;
            }
        }

        if (cropStore.isResizing) {
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
                if (cropStore.rect.w + cropStore.rect.x > imgInfo.w) {
                    cropStore.rect.w = imgInfo.w - cropStore.rect.x;
                }
            }

            if (cropStore.resizing.bottom) {
                cropStore.rect.h = cropStore.oldRect.h + dy;
                if (cropStore.rect.h + cropStore.rect.y > imgInfo.h) {
                    cropStore.rect.h = imgInfo.h - cropStore.rect.y;
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
        }
    }
}
</script>