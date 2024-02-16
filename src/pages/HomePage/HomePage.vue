<template>
    <div class="app-wrap">
        <Header></Header>

        <ToolList></ToolList>

        <main
            ref="dWorkWrap"
            class="work-wrap"
            :class="{dragging: panStore.dragging}"
        >
            <div
                class="working-area"
                :style="workAreaStyle"
            >
                <div class="editing-image-wrap">
                    <LayerRenderer></LayerRenderer>
                    <!-- <CropTool></CropTool> -->

                    <div class="tool-wrap">
                        <component :is="toolStore.currentTool.mainComponent"></component>
                    </div>
                </div>
            </div>

            <LayerSelector></LayerSelector>
        </main>
    </div>
</template>

<script setup lang="ts">
import "@/assets/style/pages/HomePageStyle.css";
import SampleImage from "@/assets/images/sample.png";
import HugeSampleImage from "@/assets/images/huge_sample.jpg";
import { loadImage } from "@/utils";
import Header from "./Header.vue";
import { computed, onMounted, ref } from "vue";
import { useWorkStore } from "@/stores/WorkStore";
import { KeyboardShortcut } from "@/core/KeyboardShortcut";
import { KeyboardState, PRESSED } from "@/core/KeyboardState";
import { useToolStore } from "@/stores/ToolStore";
import ToolList from "@/components/ToolList.vue";
import LayerSelector from "@/components/LayerSelector/LayerSelector.vue";
import LayerRenderer from "./LayerRenderer.vue";
import { useLayerStore } from "@/stores/LayerStore";
import { useCanvasStore } from "@/stores/CanvasStore";
import { useBrushStore } from "@/stores/BrushStore";
import BrushTool from "@/tools/BrushTool/BrushTool.vue";
import { usePanStore } from "@/stores/PanStore";
import { useKeyboardStore } from "@/stores/KeyboardStore";

const toolStore = useToolStore();
const workStore = useWorkStore();
const panStore = usePanStore();
const dWorkWrap = ref<HTMLElement | null>(null);

const workAreaStyle = computed(() => {
    return {
        transform: `translate(${ panStore.moveOffset.x }px, ${ panStore.moveOffset.y }px)`
    }
});

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
        layerStore.addLayer(image, "new year");
    });
};

const layerStore = useLayerStore();
const canvasStore = useCanvasStore();


loadImage( HugeSampleImage ).then( image => {
    canvasStore.setCanvasSizeBy(image);
    layerStore.addLayer(image, "new layer");

    // loadImage( SampleImage ).then( image => {
    //     layerStore.addLayer(image, "new layer");
    // });
});

const keyStore = useKeyboardStore();

keyStore.keyState.addMapping(" ", (state: number) => {
    if( state === PRESSED ) {
        panStore.dragging = true;
    } else {
        panStore.dragging = false;
    }
});

keyStore.keyState.listenTo();

keyStore.keyShortcut.add("ctrl", "-", () => {
    canvasStore.zoomOut();
});

keyStore.keyShortcut.add("ctrl", "=", () => {
    canvasStore.zoomIn();
});

keyStore.keyShortcut.add("ctrl", "0", () => {
    canvasStore.setDefaultScale();
    panStore.resetMoveOffset();
});

keyStore.keyShortcut.add("shift", "+", () => {
    canvasStore.zoomIn();
});

keyStore.keyShortcut.add("shift", "_", () => {
    canvasStore.zoomOut();
});

keyStore.keyShortcut.startListen();
toolStore.registerShortcuts();

window.addEventListener("wheel", e => {
    if( e.ctrlKey ) {
        e.preventDefault();

        // negative means zoom in
        // positive means zoom out
        const dir = Math.sign( e.deltaY );

        if( dir < 0 ) {
            canvasStore.zoomIn();
        } else {
            canvasStore.zoomOut();
        }
    }

}, { passive: false });


const start = {
    x: 0, y: 0
}

const cur = {
    x: 0, y: 0
}

let startDragging = false;

const brushStore = useBrushStore();

window.addEventListener("mousedown", e => {

    if( brushStore.resizing || panStore.dragging ) {
        start.x = e.clientX;
        start.y = e.clientY;
    }

    if( panStore.dragging ) {
        startDragging = true;
    }
});

let oldSize = 0;
window.addEventListener("contextmenu", e => {
    if( e.altKey ) {
        start.x = e.clientX;
        start.y = e.clientY;

        e.preventDefault();
        brushStore.resizing = true;
        oldSize = brushStore.lineWidth;
    }
});

window.addEventListener("mousemove", e => {
    if( brushStore.resizing || panStore.dragging ) {
        cur.x = e.clientX;
        cur.y = e.clientY;

        const dx = cur.x - start.x;
        const dy = cur.y - start.y;

        if( brushStore.resizing ) {
            console.log(dx);
            
            brushStore.lineWidth = oldSize + dx;
        }

        if( panStore.dragging && startDragging ) {
            panStore.moveOffset.x = panStore.oldOffset.x + dx;
            panStore.moveOffset.y = panStore.oldOffset.y + dy;
        }
    }

});

window.addEventListener("mouseup", e => {
    brushStore.resizing = false;
    startDragging = false;

    panStore.oldOffset.x = panStore.moveOffset.x;
    panStore.oldOffset.y = panStore.moveOffset.y;
});


window.addEventListener("keydown", e => {
    if( e.key === "Escape" ) {
        toolStore.resetToolToDefault();
    }

    if( e.key === "]" ) {
        brushStore.increaseBrusSize();
    }

    if( e.key === "[" ) {
        brushStore.decreaseBrusSize();
    }

    if( e.key === "x" ) {
        brushStore.switchBlackWhiteColor();
    }
});

</script>