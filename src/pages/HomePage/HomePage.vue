<template>
    <div class="app-wrap">
        <Header></Header>

        <main
            ref="dWorkWrap"
            class="work-wrap"
            :class="{dragging: workStore.dragging}"
        >
            <div
                class="working-area"
            >
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
import { computed, onMounted, ref } from "vue";
import { useWorkStore } from "@/stores/WorkStore";
import { KeyboardShortcut } from "@/core/KeyboardShortcut";
import { KeyboardState, PRESSED } from "@/core/KeyboardState";

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

const shortcut = new KeyboardShortcut();
const keyState = new KeyboardState();

keyState.addMapping(" ", (state: number) => {
    if( state === PRESSED ) {
        workStore.dragging = true;
    } else {
        workStore.dragging = false;
    }
});

keyState.listenTo();

shortcut.add("ctrl", "-", () => {
    workStore.downscale();
});

shortcut.add("ctrl", "=", () => {
    workStore.upscale();
});

shortcut.add("shift", "+", () => {
    workStore.upscale();
});

shortcut.add("shift", "_", () => {
    workStore.downscale();
});

shortcut.startListen();

window.addEventListener("wheel", e => {
    if( e.ctrlKey ) {
        e.preventDefault();

        // negative means zoom in
        // positive means zoom out
        const dir = Math.sign( e.deltaY );

        if( dir < 0 ) {
            workStore.upscale();
        } else {
            workStore.downscale();
        }
    }

}, { passive: false });
</script>
