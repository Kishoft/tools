<template>
  <UnderDevelopment />
  <NavBar />
  <router-view/>
  <Footer />
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import UnderDevelopment from '@/components/UnderDevelopment.vue'
export default {
  components: { NavBar, Footer, UnderDevelopment }
}
</script>

<style>
:root{
  --text-color: #2c3e50;
  --background-color: #ffffffc5;
}
html, body{
    margin: 0;
    padding: 0;
}
body{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1,h2,h3{
  text-align: center;
}
article{
  margin: auto;
  width: 95%;
  max-width: 1100px;
}

code {
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

.glass{
  backdrop-filter: blur(12px);
  background: rgba( 255, 255, 255, 0.25 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
}
</style>
