<template>
  <article>
    <h2>Media Devices API</h2>
    <section>
      <h3>Consigue información de todos los dispositivos</h3>
      <code>
        const devices = await navigator.mediaDevices.enumerateDevices();
      </code>
    </section>
    <section>
      <h3>Luego elige cuáles usar, y devolverá una promesa</h3>
      <code>
        <pre>
//Por si hay muchas cámaras, la ideal es la de más prioridad
let constraints = {
    audio: true,
    video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 776, ideal: 720, max: 1080 }
    }
}

// Cámara delantera
let constraint2 = { audio: true, video: { facingMode: "user" } }

// Cámara trasera
let constraint3 = { audio: true, video: { facingMode: { exact: "environment" } } }

// Por FPS
let constraints = { video: { frameRate: { ideal: 10, max: 15 } } };

navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
    /* usar el flujo de datos */
}).catch(function(err) {
    /* manejar el error */
});
</pre
        >
      </code>
      <h3>Un ejemplo de cómo hacer un cambio de cámara</h3>
      <code>
        <pre>
let front = false;
document.getElementById('flip-button').onclick = function() { front = !front; };

let constraints = { video: { facingMode: (front? "user" : "environment") } };
</pre
        >
      </code>
    </section>
    <section>
      <h3>Permisos en el Manifest.json</h3>
      <code>
        <pre>
"permissions": {
    "audio-capture": {
      "description": "Required to capture audio using getUserMedia()"
    },
    "video-capture": {
      "description": "Required to capture video using getUserMedia()"
    }
}
</pre>
      </code>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
