<template>
  <div id="app">
    <div class="header">
      <ul>
        <li><router-link :to="{ name: 'index' }">🏠</router-link></li>
        <li><router-link :to="{ name: 'help-how-to-subscribe' }">❓</router-link></li>
      </ul>
      <h1>Vifeng Alias</h1>
    </div>
    <div>
      <nuxt/>
    </div>
    <div class="footer">
      <span>Powered by <a href="/" target="_blank">Kyle He</a></span>
      <span class="dot">·</span>
      <span><a href="https://github.com/599316527/vifeng-alias" target="_blank">Fork on Github</a></span>
    </div>
  </div>
</template>

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
  padding-right: 30px;
  background: url(../assets/phoenix_logo.svg) no-repeat center right / 20px auto;
}
.header ul {
  margin: 0;
  padding: 0;
  list-style: none;
  float: right;
  font-size: 20px;
  margin-top: -1px;
}
.header li {
  float: left;
  margin-left: 10px;
}
.header a {
  color: #ED802F;
  text-decoration: none;
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


.lowdash {
  position: relative;
}
.lowdash::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  margin-left: -22px;
  width: 44px;
  border-top: 1px solid #aaa;
}
</style>
