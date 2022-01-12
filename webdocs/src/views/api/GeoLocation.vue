<template>
  <article>
    <h2>Geolocation API</h2>
    <section>
      <h3>Comprobar que se pueda utilizar</h3>
      <code>
        <pre>
if ("geolocation" in navigator) {
    /* Geolocation se puede utilizar */
} else {
    /* API no disponible */
}
</pre
        >
      </code>
    </section>
    <section>
      <h3>Obtener la ubicación actual</h3>
      <p>
        Esto inicia una solicitud asíncrona para detectar la posición del
        usuario, y consulta el hardware de posicionamiento para obtener
        información actualizada. Cuando se determina la posición, se ejecuta la
        función de callback. Si lo desea, puede proporcionar otra función de
        callback que se ejecuta si se produce un error. Un tercer parámetro
        opcional, es un objeto de opciones donde se puede establecer la edad
        máxima de la posición devuelta, el tiempo de espera para una solicitud y
        si se requiere una alta precisión para la posición.
      </p>
      <strong
        >Por defecto, <code>getCurrentPosition()</code> intenta responder tan
        rápido como sea posible con un resultado de baja precisión. Es útil
        cuando se necesita una respuesta rápida sin importar su exactitud. A los
        dispositivos con GPS, por ejemplo, les puede tomar más de un minuto
        obtener una posición, por lo que datos menos precisos (localización por
        IP o wifi) pueden ser devueltos por
        <code>getCurrentPosition()</code>.</strong
      >
      <code>
        <pre>
navigator.geolocation.getCurrentPosition((position) => {
    haz_algo(position.coords.latitude, position.coords.longitude);
});
</pre
        >
      </code>
    </section>
    <section>
      <h3>Rastreando la posición actual</h3>
      <p>
        Si los datos de ubicación cambian (si el dispositivo se mueve o
        información geográfica más precisa es recibida), puede definir una
        función de callback que se ejecuta al cambiar la posición. Esto se logra
        a través de la función <code>watchPosition()</code>, que recibe los
        mismos parámetros que <code>getCurrentPosition()</code>. La función de
        callback es ejecutada varias veces, permitiendo al navegador actualizar
        la ubicación cada vez que cambia, o proporcionar una posición con mayor
        exactitud utilizando distintas técnicas de geolocalización. La función
        de callback de error, la cual es opcional como en
        <code>getCurrentPosition()</code>, es llamada solo una vez, cuando nunca
        serán devueltos resultados correctos.
      </p>
      <strong
        >Es posible usar la función <code>watchPosition()</code> sin haber
        ejecutado antes <code>getCurrentPosition()</code>.</strong
      >
      <code> navigator.geolocation.clearWatch(watchID); </code>
    </section>
    <section>
      <h3>Afinar la respuesta</h3>
      <p>
        Ambos métodos, <code>getCurrentPosition()</code> y
        <code>watchPosition()</code> aceptan una función de callback en caso de
        éxito, una función callback opcional si ocurre algún error, y un objeto
        <code>PositionOptions</code> también opcional.
      </p>

      <code>
        <pre>
let wpid = navigator.geolocation.watchPosition(
    (position) => { /* Función de callback de éxito */ },
    (err) => { /* Función de callback de error */ },
    {
        enableHighAccuracy: true,
        maximumAge        : 30000,
        timeout           : 27000
    }
);
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
