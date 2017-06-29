<template>
  <div id="app" :style="{
    'padding-top': scrollTop > 0 ? headerHeight + 'px' : null
  }">
    <div class="header" :class="{ fixed: scrollTop > 0 }" ref="header">
      <div class="title">
        <router-link :to="{ name: 'index' }">VifengAlias</router-link>
      </div>
      <ul>
        <li><router-link :to="{ name: 'help-how-to-subscribe' }">㉄</router-link></li>
        <li><img src="../assets/phoenix_logo.svg"></li>
      </ul>
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

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      headerHeight: 0
    }
  },
  mounted() {
    this.scrollTop = document.body.scrollTop
    this.headerHeight = this.$refs.header.getBoundingClientRect().height

    window.addEventListener('scroll', () => {
      this.scrollTop = document.body.scrollTop
    })
  }
}
</script>

<style>
body {
  margin: 10px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 4em;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(51, 51, 51, 0.2);
}
.header.fixed {
  padding: 10px calc(4em + 10px) 5px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(255, 255, 255, 0.7)
}
.header ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 20px;
}
.header li {
  float: left;
  margin-left: 10px;
}
.header a {
  color: #ED802F;
  text-decoration: none;
}
.header .title a {
  color: #333;
  font-weight: bolder;
}
.header li img {
  width: 1em;
  display: block;
  margin-top: 3px;
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

@media (max-width: 650px) {
  #app {
    margin: 0 .5em;
  }
  .header.fixed {
    padding: 10px calc(.5em + 10px) 5px;
  }
}
</style>
