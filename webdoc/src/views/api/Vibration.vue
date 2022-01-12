<template>
  <article>
    <h2>Vibration API</h2>
    <section>
      <h3>Comprobar que se pueda utilizar</h3>
      <code>
        <pre>
if("vibrate" in window.navigator) {
    /* Vibration API se puede utilizar */
} else {
    /* API no disponible */
}
</pre>
      </code>
    </section>
    <section>
      <h3>Consumiendo la API</h3>
      <code>window.navigator.vibrate([200, 100, 200]);</code>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
