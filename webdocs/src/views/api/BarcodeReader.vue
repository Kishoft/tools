<template>
  <article>
    <h2>Barcode Reader</h2>
    <section>
      <h3>Comprobar que se pueda utilizar</h3>
      <code>
        <pre>
if ("BarcodeDetector" in window) {
    /*Barcode Reader se puede utilizar*/
}
else {
    /* API no disponible */
}
</pre
        >
      </code>
    </section>
    <section>
      <h3>Crear una instancia de lector con formatos para leer</h3>
      <code>
        <pre>
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
try{
    let supportedFormats = await BarcodeDetector.getSupportedFormats() //Hacer una comprobación del formato que busca
    if(supportedFormats.includes('ean_13')){
        //Lo soporta!
    }
    else{
        //Whops
    }
    let barcodes = await barcodeDetector.detect(image); //Devuelve sí o sí un array
}
catch(e){
    console.log(e)
}
        </pre>
      </code>
    </section>
    <section>
      <h3>Adquirir imagen de la cámara para usar el lector</h3>
      <code>
        <pre>
try{
    let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                exact: "environment"
            }
        }
    })
    let track = mediaStream.getVideoTracks()[0];
    let imageCapture = new ImageCapture(track);
    let blob = await imageCapture.takePhoto();
    let imageBitmap = await createImageBitmap(blob);
    let barcodes = await barcodeDetector(imageBitmap);
    //Hace algo con el código de barras
    //Por si se quiere representar el código en una imagen o canvas
    /*
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    const image = new Image()
    image.src = canvas.toDataURL();
    result.childNodes.forEach(c => c.remove())
    result.append(image)
    */
}
catch(e){
    console.log(e)
}
</pre
        >
      </code>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
