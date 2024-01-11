document.onpaste = (evt) => {
    const dT = evt.clipboardData || window.clipboardData;
    const file = dT.files[0];

    const url = URL.createObjectURL(file);
    console.log(url);
    const image = new Image();
    image.addEventListener("load", () => {
        document.body.appendChild(image);
    });
    image.src = url;
    console.log(file instanceof Blob);
};


const dImageCopper = document.querySelector(".image-cropper");
const dCropArea = document.querySelector(".crop-area");

const cropInfo = {
    moveStart: false,
    resize: false,
    resizeW: false,
    resizeH: false,

    areaOldX: 0,
    areaOldY: 0,

    oldAreaW: 100,
    oldAreaH: 100,
    areaW: 100,
    areaH: 100,

    areaX: 0,
    areaY: 0,

    startX: null,
    startY: null,

    currentX: null,
    currentY: null,
};

function updateArea() {
    dCropArea.style.transform = `translate(${cropInfo.areaX}px, ${cropInfo.areaY}px)`;
    dCropArea.style.width = `${cropInfo.areaW}px`;
    dCropArea.style.height = `${cropInfo.areaH}px`;
}

dImageCopper.addEventListener("mousedown", e => {
    if (e.target === dCropArea) {
        cropInfo.startX = e.offsetX;
        cropInfo.startY = e.offsetY;
        cropInfo.moveStart = true;

        cropInfo.areaOldX = cropInfo.areaX;
        cropInfo.areaOldY = cropInfo.areaY;

        return;
    }

    const { target } = e;

    if (target.classList.contains("crop-handle")) {
        cropInfo.resize = true;

        cropInfo.oldAreaH = cropInfo.areaH;
        cropInfo.oldAreaW = cropInfo.areaW;

        if (target.classList.contains("handle-left") || target.classList.contains("handle-right")) {
            cropInfo.resizeW = true;
        }

        if (target.classList.contains("handle-top") || target.classList.contains("handle-bottom")) {
            cropInfo.resizeH = true;
        }
    }
});

dImageCopper.addEventListener("mousemove", e => {
    if (cropInfo.moveStart || cropInfo.resize) {
        cropInfo.currentX = e.offsetX;
        cropInfo.currentY = e.offsetY;

        const dx = cropInfo.currentX - cropInfo.startX;
        const dy = cropInfo.currentY - cropInfo.startY;

        if (cropInfo.moveStart) {
            cropInfo.areaX += dx;
            cropInfo.areaY += dy;
            // cropInfo.areaX = cropInfo.areaOldX + dx;
            // cropInfo.areaY = cropInfo.areaOldY + dy;
            updateArea();
        }

        if (cropInfo.resize) {

            if (cropInfo.resizeW) {
                cropInfo.areaW = cropInfo.oldAreaW + dx;
            }

            if (cropInfo.resizeH) {
                cropInfo.areaH = cropInfo.oldAreaH + dy;
            }

            updateArea();
        }
    }
});

dImageCopper.addEventListener("mouseup", e => {
    if (cropInfo.moveStart) {
        // cropInfo.areaX = cropInfo
        cropInfo.moveStart = false;
    }

    cropInfo.resize = false;
    cropInfo.resizeW = false;
    cropInfo.resizeH = false;

    cropInfo.oldAreaH = cropInfo.areaH;
    cropInfo.oldAreaW = cropInfo.areaW;
});

const dCropButton = document.querySelector("#crop-btn");
const dCropImg = document.querySelector(".img-el");
const dCropImgWarp = document.querySelector(".image-wrap");

function loadImage(src) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.src = src;
    });
}


loadImage("./sample.png").then(image => {
    cropInfo.image = image;
    dCropImgWarp.prepend(image);
});


dCropButton.addEventListener("click", crop);

function crop() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropInfo.areaW;
    canvas.height = cropInfo.areaH;

    ctx.drawImage(cropInfo.image, cropInfo.areaX, cropInfo.areaY, cropInfo.areaW, cropInfo.areaH, 0, 0, cropInfo.areaW, cropInfo.areaH);

    canvas.toBlob(blob => {
        const imageData = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([imageData]);
    });
}

window.addEventListener("keydown", e => {
    if (e.key === "-" && e.ctrlKey) {
        e.preventDefault();
        console.log(("CTRL+-"));
    }

    if (e.key === "=" && e.ctrlKey) {
        e.preventDefault();
        console.log(("CTRL++"));
    }
});