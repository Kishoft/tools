<template>
  <article>
    <h2>Sensors API</h2>
    <section>
      <h3>Tipos de sensores en la Web</h3>
      <ul>
        <li>"ambient-light"</li>
        <li>"accelerometer"</li>
        <li>"linear-acceleration"</li>
        <li>"gravity"</li>
        <li>"gyroscope"</li>
        <li>"magnetometer"</li>
        <li>"uncalibrated-magnetometer"</li>
        <li>"absolute-orientation"</li>
        <li>"relative-orientation"</li>
        <li>"geolocation"</li>
        <li>"proximity"</li>
      </ul>
    </section>
    <section>
      <h3>Accelerometer</h3>
      <h4>Comprueba disponibilidad</h4>
      <code>
        <pre>
    if ('Accelerometer' in window) {
        // Soporta Acelerómetro.
    }
</pre
        >
      </code>
      <h4>Mide la aceleración</h4>
      <code>
        <pre>
try{
    let accelerometer = new Accelerometer({ frequency: 10 });

    accelerometer.addEventListener('reading', e => {
        console.log(e.currentTarget);
    });

    accelerometer.addEventListener('error', event => {
        if (event.error.name === 'NotAllowedError') {
            console.log('El permiso al sensor ha sido denegado.');
        } else if (event.error.name === 'NotReadableError') {
            console.log('No se puede leer el sensor.');
        }
    })

    accelerometer.start();
}
catch(e){
    console.log(e);
}
</pre
        >
      </code>
    </section>
    <section>
      <h3>Ambient Light Sensor</h3>
      <h4>Comprueba disponibilidad</h4>
      <code>
        <pre>
if ( 'AmbientLightSensor' in window ) {
    //Soporta sensor de luz ambiental
}
</pre
        >
      </code>
      <h4>Mide la luz ambiental</h4>
      <code>
        <pre>
const sensor = new AmbientLightSensor();

sensor.addEventListener('reading', () =>{
    console.log('Current light level:', sensor.illuminance);
})

sensor.addEventListener('error', e => {
    console.log(event.error.name, event.error.message);
})

sensor.start();
</pre
        >
      </code>
    </section>
    <section>
      <h3>Gyroscope</h3>
      <h4>Comprobando disponibilidad</h4>
      <code>
        <pre>
if("Gyroscope" in window){
    //Soporta giroscopio
}
</pre
        >
      </code>
      <h4>Mide la velocidad angular del dispositivo</h4>
      <code>
        <pre>
let gyroscope = new Gyroscope({frequency: 60});

gyroscope.addEventListener('reading', e => {
    //Se puede leer cualquiera de los dos
    console.log(e)
    console.log(gyroscope)
});

gyroscope.start();
</pre
        >
      </code>
    </section>
    <section>
      <h3>Magnetometer</h3>
      <h4>Comprobando disponibilidad</h4>
      <code>
        <pre>
if("Magnetometer" in window){
    //Soporta giroscopio
}
</pre
        >
      </code>
      <h4>Mide la velocidad angular del dispositivo</h4>
      <code>
        <pre>
let magSensor = new Magnetometer({frequency: 10});

magSensor.addEventListener('reading', e => {
    console.log(e);
    console.log(magSensor);
});

magSensor.addEventListener('error',e =>{
    console.log(e);
})

magSensor.start();
</pre
        >
      </code>
    </section>
    <section>
      <h3>Absolute Orientation Sensor</h3>
      <h4>Comprobando disponibilidad</h4>
      <code>
        <pre>
if("AbsoluteOrientationSensor" in window){
    //Soporta sensor de orientación absoluta de intel
}
</pre
        >
      </code>
      <h4>Mide la orientación absoluta</h4>
      <code>
        <pre>
const sensor = new AbsoluteOrientationSensor({ frequency: 60, referenceFrame: 'device' });

sensor.addEventListener('reading', e => {
    console.log(e);
    //model.quaternion.fromArray(sensor.quaternion).inverse();
});
sensor.addEventListener('error', error => {
    if (event.error.name == 'NotReadableError') {
        console.log("Sensor no disponible.");
    }
});
sensor.start();
</pre
        >
      </code>
    </section>
    <section>
      <h3>Relative Orientation Sensor</h3>
      <h4>Comprobando disponibilidad</h4>
      <code>
        <pre>
if("RelativeOrientationSensor" in window){
    //Soporta sensor de orientación relativa de intel
}
</pre
        >
      </code>
      <h4>Mide la orientación relativa</h4>
      <code>
        <pre>
const sensor = new RelativeOrientationSensor({ frequency: 60, referenceFrame: 'device' });

sensor.addEventListener('reading', e => {
    console.log(e);
    //model.quaternion.fromArray(sensor.quaternion).inverse();
});
sensor.addEventListener('error', error => {
    if (event.error.name == 'NotReadableError') {
        console.log("Sensor no disponible.");
    }
});
sensor.start();
</pre
        >
      </code>
    </section>
    <section>
      <h3>Proximity Sensor</h3>
      <h4>Comprobando disponibilidad</h4>
      <code>
        <pre>
if ("ProximitySensor" in window) {
    // Soporta sensor de proximidad
}
</pre
        >
      </code>
      <h4>Mide la distancia</h4>
      <code>
        <pre>
const sensor = new ProximitySensor({ frequency: 60, referenceFrame: 'device' });

sensor.addEventListener('reading', e => {
    console.log(e);
});
sensor.addEventListener('error', error => {
    if (event.error.name == 'NotReadableError') {
        console.log("Sensor no disponible.");
    }
});
sensor.start();
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
