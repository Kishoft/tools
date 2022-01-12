<template>
  <article>
    <section>
    <h3>Bienvenid@ a WebDocs, una web abierta y llena de documentación para desarrollo web, escrita en su mayoría en español.</h3>
    </section>
    <section>
      <Changelogs />
    </section>
  </article>
</template>

<script>
import Changelogs from '@/views/Changelogs.vue'
export default {
  name: 'Home',
  components: { Changelogs }
}
</script>
