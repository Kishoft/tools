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

navigator.mediaDevices.getUserMedia( { video: { facingMode: { exact: "environment" } } })
.then( mediaStream => {

    if (!('BarcodeDetector' in window)) {
        console.log('Barcode Detector is not supported by this browser.');
    }
    else {
        console.log('Barcode Detector supported!');

        

        BarcodeDetector.getSupportedFormats()
            .then(supportedFormats => {

                supportedFormats.forEach(format => console.log(format));
    
                let supportsEan13 = supportedFormats.includes('ean_13');
                
                if (supportsEan13) {

                    videoOutput.srcObject = mediaStream;
                    videoOutput.play()
    /*
                    let imagen = document.createElement('img')
                    imagen.src = './1200px-EAN13.svg.png';
    */
                    let barcodeDetector = new BarcodeDetector({ formats: ['code_39', 'codabar', 'ean_13'] });
                    let detectado = false;
                    do{
                        console.log("Detectando")
                        barcodeDetector.detect(getScreenshot(videoOutput, 1))
                        .then(barcodes => {
                            console.log(barcodes)
                            barcodes.forEach(barcode => console.log(barcode.rawData));
                            detectado = !detectado
                        })
                        .catch(err => {
                          console.log(err);
                        })
                    }
                    while(detectado)
                    
                }
    
                
    
    
            });
    
    
    
        // create new detector
    
    }


})
.catch(err => console.log(err));
