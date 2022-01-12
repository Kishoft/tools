<template>
  <article>
    <h2>Permission API</h2>
    <section>
      <h3>Muestra todos los permisos posibles dentro de lo que hay</h3>
      <code>
        <pre>
let apis = [
    "accelerometer",
    "ambient-light-sensor",
    "background-fetch",
    "background-sync",
    "bluetooth",
    "camera",
    "clipboard-write",
    "device-info",
    "display-capture",
    "geolocation",
    "gyroscope",
    "magnetometer",
    "microphone",
    "midi",
    "nfc",
    "notifications",
    "persistent-storage",
    "push",
    "speaker-selection"
]

apis.forEach(api => {
    navigator.permissions.query({
        name : api
    }).then(p => console.log({
        api : api,
        p
    }))
})
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
