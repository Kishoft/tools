<template>
  <article>
    <h2>Clipboard API</h2>
    <section>
      <h3>Comprobar que se pueda utilizar</h3>
      <code>
        <pre>
if ("Clipboard" in window) {
    /*Clipboard se puede utilizar*/
}
else {
    /* API no disponible */
}
</pre
        >
      </code>
    </section>
    <section>
      <h3>Métodos</h3>
      <h4>read()</h4>
      <p>
        Lee información arbitraria (como imágenes, por ejemplo) del portapapeles
        (clipboard)
      </p>
      <h4>readText()</h4>
      <p>Lee solo texto del portapapeles</p>
      <h4>write()</h4>
      <p>
        Escribe información arbitraria (como imágenes, por ejemplo) en el
        portapapeles (clipboard)
      </p>
      <h4>writeText()</h4>
      <p>Escribe solo texto en el portapapeles</p>
    </section>
    <section>
      <h3>Consumiendo la API</h3>
      <code> let copiedText = await navigator.clipboard.readText(); </code>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
