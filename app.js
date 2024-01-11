document.onpaste = (evt) => {
    const dT = evt.clipboardData || window.clipboardData;
    const file = dT.files[0];

    const url = URL.createObjectURL( file );
    console.log( url );
    const image = new Image();
    image.addEventListener("load", () => {
        document.body.appendChild( image );
    });
    image.src = url;
    console.log(file instanceof Blob);
};