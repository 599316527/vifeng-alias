<template>
  <div id="app">
    <div class="header">
      <h1>Vifeng Alias</h1>
    </div>
    <router-view></router-view>
    <div class="footer">
      <span>Powered by <a href="/" target="_blank">Kyle He</a></span>
      <span class="dot">·</span>
      <span><a href="https://github.com/599316527/vifeng-alias" target="_blank">Fork on Github</a></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 18px;
  font-weight: normal;

}

h2 {
  font-size: 16px;
  font-weight: normal;
}

.header {
  background: url(./assets/phoenix_logo.svg) no-repeat top right / 20px auto;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #ccc;
  line-height: 1.5;
}
.footer a {
  color: inherit;
  text-decoration: none;
}
.footer .dot {
  font-weight: bolder;
  margin: 0 5px;
}
</style>
