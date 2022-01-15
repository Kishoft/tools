<template>
  <article>
    <section>
    <h3>Bienvenid@ a WebDocs, una web abierta y llena de documentación para desarrollo web, escrita en su mayoría en español.</h3>
    <p>Idea: es una iniciativa sin ánimo de lucro, es para que las personas de habla hispana que se encuentran perdidas y tienen mucho que aprender de golpe, tengan un pantallazo de lo que pueden encontrarse, es posible que la documentación tarde un poco en actualizarse por la disponibilidad de tiempo. Espero que pueda serle de ayuda a alguien, también lo uso de manera personal para no andar buscando documentación en todas partes o para tener disponible documentación offline en un solo lugar.</p>
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
