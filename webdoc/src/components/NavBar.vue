<template>
  <div id="NavBar">
    <div id="toggleBtn" @click="toggle()">
      <div class="toggleBtnLine"></div>
      <div class="toggleBtnLine"></div>
      <div class="toggleBtnLine"></div>
    </div>
    <figure>
      <img src="../assets/logo.png" alt="Vue logo">
      <span>WebDocs</span>
    </figure>
    <div class="links" v-bind:class="{ open }">
      <div v-for="route of routes" v-bind:key="route">
        <h4>{{route.name}}</h4>
        <nav v-for="child of route.children" v-bind:key="child">
          <router-link :to="route.path+'/'+child.path">{{child.name}}</router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: true
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    }
  },
  computed: {
    routes () {
      return this.$router.getRoutes().filter(route => route?.children?.length > 0)
    }
  },
  watch: {
    '$route' () {
      this.toggle()
    }
  }
}
</script>

<style scoped>
#NavBar {
  --nav-bar-height: 60px;
  position: sticky;
  top:0;
  width: 100%;
  height: var(--nav-bar-height);
  display: grid;
  grid-template-columns: 40px auto;
  grid-template-rows: auto;
  place-items: center;
  backdrop-filter: blur(12px);
  background-color: #ffffffc5;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}

#toggleBtn {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 40px;
  height: 30px;
  border: 1px solid #2c3e50;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 30px
}

.toggleBtnLine {
  width: 30px;
  height: 2px;
  background-color: #2c3e50;
  transition: all 0.3s ease-in-out;
}

.links{
  position: fixed;
  top: var(--nav-bar-height);
  background: white;
  width: 30%;
  left: -30%;
  height: calc(100vh - var(--nav-bar-height));
}

.links.open{
  left: 0;
}

figure{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
}

img{
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
