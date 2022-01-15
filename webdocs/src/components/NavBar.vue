<template>
  <div id="NavBar" class="glass">
    <div id="toggleBtn" @click="toggle()">
      <div class="toggleBtnLine"></div>
      <div class="toggleBtnLine"></div>
      <div class="toggleBtnLine"></div>
    </div>
    <figure>
      <router-link to="/">
        <img src="@/assets/logo.svg" alt="Vue logo">
      </router-link>
    </figure>
    <div class="links" v-bind:class="{ open }">
      <div class="topics" v-for="route of routes" v-bind:key="route">
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
      open: false
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
  display: flex;
  align-items: center;
}

a {
  font-weight: lighter;
  color: rgb(255, 255, 255);
  text-decoration: none;
}
a:hover{
  text-decoration: underline;
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
  margin-left: 15px
}

.toggleBtnLine {
  width: 30px;
  height: 2px;
  background-color: #2c3e50;
  transition: all 0.3s ease-in-out;
}

.links{
  position: fixed;
  left: 2.5vw;
  top: calc(var(--nav-bar-height) + 10px);
  width: 95vw;
  height: 100vh;
  transition: all 0.3s ease-in-out;
  display:flex;
  flex-wrap:wrap;
  padding: 5px;
  border-radius: 13px 13px 0 0;
  background: linear-gradient(145deg, #283848, #2f4256);
  overflow-y: scroll;
  box-sizing: border-box;
}

.links.open{
  top: calc(100vh + 12px);
}

.topics {
  margin: 10px;
}

h4{
  text-decoration: underline;
  color: rgb(255, 255, 255);
}

figure{
  margin: 0;
  padding: 0;
  width: 100%;
  display:flex;
  justify-content: center;
}

img{
  height: 40px;
  margin-right: 10px;
}
</style>
