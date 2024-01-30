<template>
    <div class="app-wrap">
        <Header></Header>

        <main class="work-wrap" ref="dWorkWrap">
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
import HugeSampleImage from "@/assets/images/huge_sample.jpg";
import { loadImage } from "@/utils";
import { useCropStore } from "@/stores/CropStore";
import Header from "./Header.vue";
import { onMounted, ref } from "vue";
import { useWorkStore } from "@/stores/WorkStore";

const cropStore = useCropStore();
const workStore = useWorkStore();
const dWorkWrap = ref<HTMLElement | null>(null);

onMounted(() => {
    if( dWorkWrap.value === null ) {
        throw new Error("Dom Ref Value is Null inside onMounted");
    }

    const rect = dWorkWrap.value.getBoundingClientRect();
    workStore.setWorkSize(rect.width, rect.height);
});


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
        workStore.setImage( image );
    });
};

loadImage( HugeSampleImage ).then( image => {
    workStore.setImage( image );
});

window.addEventListener("keydown", e => {
    if (e.key === "-" && e.ctrlKey) {
        e.preventDefault();
        console.log(("CTRL+-"));
    }

    if (e.key === "=" && e.ctrlKey) {
        e.preventDefault();
        workStore.upscale();
    }
});
</script>
