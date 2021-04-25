if (!('BarcodeDetector' in window)) {
    console.log('Barcode Detector is not supported by this browser.');
}
else {
    console.log('Barcode Detector supported!');
}

let videoOutput = document.getElementById('camara')
let capture = document.getElementById('capture')
let btnCapturar = document.getElementById('capturar')
let result = document.getElementById('res')

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


let barcodeDetector = new BarcodeDetector({
    formats: [
        'aztec',
        'code_128',
        'code_39',
        'code_93',
        'codabar',
        'data_matrix',
        'ean_13',
        'ean_8',
        'itf',
        'pdf417',
        'qr_code',
        'upc_a',
        'upc_e'
    ]
});

BarcodeDetector.getSupportedFormats().then(supportedFormats => {
    supportedFormats.forEach(format => console.log(format));
    let supportsEan13 = supportedFormats.includes('ean_13');
    let supportsPDF417 = supportedFormats.includes('pdf417')
    if (supportsEan13) {
        console.log("Soporta ean 13 !")
    }
    if (supportsPDF417) {
        console.log("Soporta pdf417")
    }

});

function detectarCodigo(img) {
    return barcodeDetector
        .detect(img)
        .then(barcode => barcode)
}

function hacerCaptura() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                exact: "environment"
            }
        }
    })
        .then(mediaStream => {

            let imageCapture;

            //videoOutput.srcObject = mediaStream;

            const track = mediaStream.getVideoTracks()[0];
            imageCapture = new ImageCapture(track);



            //videoOutput.play()
            /*
            setInterval(() => {
                barcodeDetector.detect(getScreenshot(videoOutput, 1))
                    .then(barcodes => {
                        console.log(barcodes)
                        barcodes.forEach(barcode => console.log(barcode.rawData));
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }, 10000)*/

            imageCapture.takePhoto()
                .then(blob => createImageBitmap(blob))
                .then(imageBitmap => {
                    
                    const canvas = document.createElement("canvas");
                    canvas.width = imageBitmap.width;
                    canvas.height = imageBitmap.height;
                    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

                    const image = new Image()
                    image.src = canvas.toDataURL();
                    result.childNodes.forEach(c => c.remove())
                    result.append(image)
                    
                    barcodeDetector.detect(imageBitmap)
                        .then(barcodes => {
                            barcodes.forEach(barcode => console.log(barcode))
                            
                        })
                        .finally(() => {
                        })
                        
                })
        })
        .catch(err => console.log(err));
}

btnCapturar.addEventListener('click', e => {
    e.preventDefault()
    hacerCaptura()
})
//barcodeDetector.detect(document.getElementById('foto1')).then(barcode => console.log(barcode))
//barcodeDetector.detect(document.getElementById('foto2')).then(barcode => console.log(barcode))
setInterval(() => hacerCaptura(), 1000)