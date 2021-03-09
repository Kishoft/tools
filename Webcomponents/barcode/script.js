if (!('BarcodeDetector' in window)) {
    console.log('Barcode Detector is not supported by this browser.');
}
else {
    console.log('Barcode Detector supported!');
}

let videoOutput = document.getElementById('camara')

function getScreenshot(videoEl, scale) {
    scale = scale || 1;

    const canvas = document.createElement("canvas");
    canvas.width = videoEl.clientWidth * scale;
    canvas.height = videoEl.clientHeight * scale;
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const image = new Image()
    image.src = canvas.toDataURL();
    return image;
}


let barcodeDetector = new BarcodeDetector({ formats: ['code_39', 'codabar', 'ean_13'] });

BarcodeDetector.getSupportedFormats().then(supportedFormats => {
    supportedFormats.forEach(format => console.log(format));
    let supportsEan13 = supportedFormats.includes('ean_13');

    if (supportsEan13) {

    }

});


navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: {
            exact: "environment"
        }
    }
})
.then(mediaStream => {
    videoOutput.srcObject = mediaStream;
    videoOutput.play()
    
    setInterval(() => {
        barcodeDetector.detect(getScreenshot(videoOutput, 1))
            .then(barcodes => {
                console.log(barcodes)
                barcodes.forEach(barcode => console.log(barcode.rawData));
            })
            .catch(err => {
                console.log(err);
            })
    }, 500)
})
.catch(err => console.log(err));
