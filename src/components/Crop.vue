<template>
    <button id="crop-btn" @click="crop">Crop</button>

    <div class="image-cropper" :class="imgCropperClass" @mouseup="resetMouse" @mousemove="mousemove" @mousedown="mousedown">
        <div class="image-wrap">
            <img :src="imgStore.image.src" v-if="imgStore.image">
            <div class="image-mask"></div>
        </div>

        <div class="crop-area" ref="dCropArea" :style="cropAreaStyle">

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
import { useImageStore } from "@/stores/ImageStore";
import { downloadCanvas } from "@/utils";
import { computed, reactive, ref } from "vue";
const imgStore = useImageStore();

const dCropArea = ref(null);

function crop() {
    if(imgStore.image === null) {
        throw new Error("Image cannot be null");
    }

    const canvas = document.createElement("canvas");

    // for getContext returning null, it can happen if you have already requested a different type of context.
    // we know for sure, ctx in only request once
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const scaleFactor = imgStore.info.naturalWidth / imgStore.info.cw;
    console.log(imgStore.info.cw, imgStore.info.naturalWidth, scaleFactor);

    let w = cropInfo.areaW, h = cropInfo.areaH;

    w *= scaleFactor;
    h *= scaleFactor;

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(imgStore.image, cropInfo.areaX *= scaleFactor, cropInfo.areaY *= scaleFactor, cropInfo.areaW *= scaleFactor, cropInfo.areaH *= scaleFactor, 0, 0, w, h);

    downloadCanvas( canvas, "save" );
}

const cropInfo = reactive({
    moveStart: false,
    resize: false,

    resizeL: false,
    resizeR: false,
    resizeT: false,
    resizeB: false,

    areaOldX: 0,
    areaOldY: 0,

    oldAreaW: 100,
    oldAreaH: 100,
    areaW: 100,
    areaH: 100,

    areaX: 0,
    areaY: 0,

    startX: 0,
    startY: 0,

    currentX: 0,
    currentY: 0,
});

const imgCropperClass = computed(() => {
    return {
        resizing: cropInfo.resize,
        "resize-left": cropInfo.resizeL,
        "resize-right": cropInfo.resizeR,
        "resize-top": cropInfo.resizeT,
        "resize-bottom": cropInfo.resizeB,
    }
});

const cropAreaStyle = computed(() => {
    return {
        width: cropInfo.areaW + "px",
        height: cropInfo.areaH + "px",
        transform: `translate(${cropInfo.areaX}px, ${cropInfo.areaY}px)`
    }
});

function resetMouse(e: MouseEvent) {
    if (cropInfo.moveStart) {
        // cropInfo.areaX = cropInfo
    }

    cropInfo.moveStart = false;
    cropInfo.resize = false;
    cropInfo.resizeR = false;
    cropInfo.resizeT = false;
    cropInfo.resizeL = false;
    cropInfo.resizeB = false;

    cropInfo.oldAreaH = cropInfo.areaH;
    cropInfo.oldAreaW = cropInfo.areaW;

    // dImageCopper.classList.remove("resizing");
    // dImageCopper.classList.remove("resize-left");
    // dImageCopper.classList.remove("resize-right");
    // dImageCopper.classList.remove("resize-top");
    // dImageCopper.classList.remove("resize-bottom");
}

window.addEventListener("mouseup", resetMouse);

function mousedown(e: MouseEvent) {

    if (e.target === dCropArea.value) {
        cropInfo.startX = e.clientX;
        cropInfo.startY = e.clientY;

        cropInfo.moveStart = true;

        cropInfo.areaOldX = cropInfo.areaX;
        cropInfo.areaOldY = cropInfo.areaY;

        return;
    }

    const { target } = e;

    if (target instanceof HTMLElement && target.classList.contains("crop-handle")) {
        cropInfo.startX = e.clientX;
        cropInfo.startY = e.clientY;

        cropInfo.resize = true;

        cropInfo.oldAreaH = cropInfo.areaH;
        cropInfo.oldAreaW = cropInfo.areaW;

        cropInfo.areaOldX = cropInfo.areaX;
        cropInfo.areaOldY = cropInfo.areaY;

        if (target.classList.contains("handle-left")) {
            cropInfo.resizeL = true;
        }

        if (target.classList.contains("handle-right")) {
            cropInfo.resizeR = true;
        }

        if (target.classList.contains("handle-top")) {
            cropInfo.resizeT = true;
        }

        if (target.classList.contains("handle-bottom")) {
            cropInfo.resizeB = true;
        }
    }
}

function mousemove(e: MouseEvent) {
    console.log("move", cropInfo.moveStart);

    if (cropInfo.moveStart || cropInfo.resize) {
        cropInfo.currentX = e.clientX;
        cropInfo.currentY = e.clientY;

        const dx = cropInfo.currentX - cropInfo.startX;
        const dy = cropInfo.currentY - cropInfo.startY;

        if (cropInfo.moveStart) {
            cropInfo.areaX = cropInfo.areaOldX + dx;
            if (cropInfo.areaX < 0) cropInfo.areaX = 0;
            if (cropInfo.areaX + cropInfo.areaW > imgStore.info.cw) {
                cropInfo.areaX = imgStore.info.cw - cropInfo.areaW;
            }

            cropInfo.areaY = cropInfo.areaOldY + dy;

            if (cropInfo.areaY < 0) cropInfo.areaY = 0;
            if (cropInfo.areaY + cropInfo.areaH > imgStore.info.ch) {
                cropInfo.areaY = imgStore.info.ch - cropInfo.areaH;
            }

            // cropInfo.areaX = cropInfo.areaOldX + dx;
            // cropInfo.areaY = cropInfo.areaOldY + dy;
        }

        if (cropInfo.resize) {
            if (cropInfo.resizeL) {
                cropInfo.areaX = cropInfo.areaOldX + dx;
                cropInfo.areaW = cropInfo.oldAreaW - dx;

                if (cropInfo.areaX < 0) {
                    let offset = cropInfo.areaX;
                    cropInfo.areaX = 0;
                    cropInfo.areaW += offset;
                }
            }

            if (cropInfo.resizeR) {
                cropInfo.areaW = cropInfo.oldAreaW + dx;
                if (cropInfo.areaW + cropInfo.areaX > imgStore.info.cw) {
                    cropInfo.areaW = imgStore.info.cw - cropInfo.areaX;
                }
            }

            if (cropInfo.resizeB) {
                cropInfo.areaH = cropInfo.oldAreaH + dy;
                if (cropInfo.areaH + cropInfo.areaY > imgStore.info.ch) {
                    cropInfo.areaH = imgStore.info.ch - cropInfo.areaY;
                }
            }

            if (cropInfo.resizeT) {
                cropInfo.areaY = cropInfo.areaOldY + dy;
                cropInfo.areaH = cropInfo.oldAreaH - dy;

                if (cropInfo.areaY < 0) {
                    let offset = cropInfo.areaY;
                    cropInfo.areaY = 0;
                    cropInfo.areaH += offset;
                }
            }
        }
    }
}
</script>