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
        cropInfo.startX = e.clientX;
        cropInfo.startY = e.clientY;

        cropInfo.moveStart = true;

        cropInfo.areaOldX = cropInfo.areaX;
        cropInfo.areaOldY = cropInfo.areaY;

        return;
    }

    const { target } = e;

    if (target.classList.contains("crop-handle")) {
        cropInfo.startX = e.clientX;
        cropInfo.startY = e.clientY;

        cropInfo.resize = true;

        cropInfo.oldAreaH = cropInfo.areaH;
        cropInfo.oldAreaW = cropInfo.areaW;

        cropInfo.areaOldX = cropInfo.areaX;
        cropInfo.areaOldY = cropInfo.areaY;

        if (target.classList.contains("handle-left") ) {
            cropInfo.resizeL = true;
        }

        if (target.classList.contains("handle-right") ) {
            cropInfo.resizeR = true;
        }

        if (target.classList.contains("handle-top") ) {
            cropInfo.resizeT = true;
        }

        if (target.classList.contains("handle-bottom") ) {
            cropInfo.resizeB = true;
        }
    }
});

dImageCopper.addEventListener("mousemove", e => {

    if (cropInfo.moveStart || cropInfo.resize) {
        cropInfo.currentX = e.clientX;
        cropInfo.currentY = e.clientY;

        const dx = cropInfo.currentX - cropInfo.startX;
        const dy = cropInfo.currentY - cropInfo.startY;

        if (cropInfo.moveStart) {
            cropInfo.areaX = cropInfo.areaOldX + dx;
            if( cropInfo.areaX < 0 ) cropInfo.areaX = 0;
            if( cropInfo.areaX + cropInfo.areaW > 512 ) {
                cropInfo.areaX = 512 - cropInfo.areaW;
            }

            cropInfo.areaY =  cropInfo.areaOldY + dy;
            if( cropInfo.areaY < 0 ) cropInfo.areaY = 0;
            if( cropInfo.areaY + cropInfo.areaH > 512 ) {
                cropInfo.areaY = 512 - cropInfo.areaH;
            }

            // cropInfo.areaX = cropInfo.areaOldX + dx;
            // cropInfo.areaY = cropInfo.areaOldY + dy;
            updateArea();
        }

        if (cropInfo.resize) {
            if( cropInfo.resizeL ) {
                cropInfo.areaX = cropInfo.areaOldX + dx;
                cropInfo.areaW = cropInfo.oldAreaW - dx;
            }

            if (cropInfo.resizeR) {
                cropInfo.areaW = cropInfo.oldAreaW + dx;
            }

            if (cropInfo.resizeB) {
                cropInfo.areaH = cropInfo.oldAreaH + dy;
            }

            if (cropInfo.resizeT) {
                cropInfo.areaY = cropInfo.areaOldY + dy;
                cropInfo.areaH = cropInfo.oldAreaH - dy;
            }

            updateArea();
        }
    }
});

function resetMouse(e) {
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
}

dImageCopper.addEventListener("mouseup", resetMouse);
dImageCopper.addEventListener("mouseout", e => {
    if( e.target === dImageCopper ) {
        resetMouse();
    }
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