<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <Leipzig />
    <Search />
  </div>
</template>

<script>
import Search from './components/search.vue'
import Leipzig from './components/Leipzig.vue'

export default {
  name: 'App',
  components: {
    Search,
    Leipzig
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
span.matchedtoken {
  background: rgba(255, 255, 0, 0.582);
  /* padding: 0.08em 0.1em; */
  /* border-radius: 6px; */
}
.gloss__line--free span.matchedtoken {
  background: rgba(136, 255, 0, 0.561);
}
html {
  scroll-behavior: smooth !important;
}
</style>
