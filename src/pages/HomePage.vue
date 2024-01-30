<template>
    <div class="app-wrap">
        <header class="app-header">
            <p>Header Here</p>
        </header>

        <main class="work-wrap">
            <div class="working-area">
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

function isImage( mimeString: string ) : boolean {
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    return allowed.includes( mimeString );
}

document.onpaste = (evt) => {
    const data = evt.clipboardData;

    if( data === null ) {
        console.log("onpaste event triggerd, but data is empty");
        return;
    }

    const file = data.files[0];

    if( ! file ) {
        // clipboard data is not file
        return;
    }

    if( ! isImage(file.type) ) {
        console.log("onpaste event triggerd, file is not image");
        return;
    }
    
    const url = URL.createObjectURL(file);

    loadImage( url ).then(image => {
        cropStore.setImage( image );
    });
};

loadImage( SampleImage ).then( image => {
    cropStore.setImage( image );
});

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
