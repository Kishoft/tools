<template>
  <NavBar />
  <router-view/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
  components: { NavBar }
}
</script>

<style>
html, body{
    margin: 0;
    padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1,h2,h3,h4,h5,h6{
  text-align: center;
}

pre {
    background: #f4f4f4;
    border: 1px solid #ddd;
    border-left: 3px solid #2c3e50;
    color: #666;
    page-break-inside: avoid;
    font-family: monospace;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 1.6em;
    max-width: 100%;
    overflow: auto;
    padding: 1em 1.5em;
    display: block;
    word-wrap: break-word;
}
</style>
