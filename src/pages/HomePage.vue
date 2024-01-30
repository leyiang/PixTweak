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
import { loadImage } from "@/utils";
import { useCropStore } from "@/stores/CropStore";

const cropStore = useCropStore();

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
    cropStore.setImage( image );
});


// let factor = 1;

// function scale() {
// }

window.addEventListener("keydown", e => {
    if (e.key === "-" && e.ctrlKey) {
        e.preventDefault();
        console.log(("CTRL+-"));
    }

    if (e.key === "=" && e.ctrlKey) {
        e.preventDefault();

        cropStore.upscale();
    }
});
</script>
