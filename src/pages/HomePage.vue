<template>
    <div class="app-wrap">
        <header class="app-header">
            <p>Header Here</p>
        </header>

        <main class="work-wrap">
            <div class="working-area">
                <input type="file" name="photo">
                <Crop></Crop>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/pages/HomePageStyle.css";
import Crop from "@/components/Crop.vue";
import SampleImage from "@/assets/images/sample.png";
import { useImageStore } from "@/stores/ImageStore";
import { loadImage } from "@/utils";

const imgStore = useImageStore();

// document.onpaste = (evt) => {
//     const dT = evt.clipboardData || window.clipboardData;
//     const file = dT.files[0];

//     const url = URL.createObjectURL(file);
//     console.log(url);
//     const image = new Image();
//     image.addEventListener("load", () => {
//         getImage( image );
//     });
//     image.src = url;
//     console.log(file instanceof Blob);
// };

/** For Test */

loadImage( SampleImage ).then( image => {
    imgStore.setImage( image );
});


// function updateArea() {
//     dCropArea.style.transform = `translate(${cropInfo.areaX}px, ${cropInfo.areaY}px)`;
//     dCropArea.style.width = `${cropInfo.areaW}px`;
//     dCropArea.style.height = `${cropInfo.areaH}px`;
// }


// let factor = 1;

// function scale() {
//     factor += .25;

//     imgInfo.cw = imgInfo.w * factor;
//     imgInfo.ch = imgInfo.h * factor;

//     cropInfo.image.style.width = `${imgInfo.cw}px`;
//     cropInfo.image.style.height = `${imgInfo.ch}px`;

//     console.log(cropInfo.image);
// }

// window.addEventListener("keydown", e => {
//     if (e.key === "-" && e.ctrlKey) {
//         e.preventDefault();
//         console.log(("CTRL+-"));
//     }

//     if (e.key === "=" && e.ctrlKey) {
//         e.preventDefault();
//         scale();
//     }
// });
</script>
