<template>
  <div id="app" :style="{
    'padding-top': scrollTop > 0 ? headerHeight + 'px' : null
  }">
    <div class="header" :class="{
      fixed: scrollTop > 0,
      'scroll-up': scrollTop > 400
    }" ref="header">
      <div class="title">
        <router-link :to="{ name: 'index' }">VifengAlias</router-link>
      </div>
      <ul>
        <li><router-link :to="{ name: 'help-how-to-subscribe' }">㉄</router-link></li>
        <li class="logo"><div @click="scrollToTop"></div></li>
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
  methods: {
    scrollToTop() {
      let start
      let startScrollTop = this.scrollTop
      let targetScrollTop = 0
      let duration = Math.abs(targetScrollTop - startScrollTop) * .8

      if (duration) {
        window.requestAnimationFrame(scroll)
      }

      function scroll(timestamp) {
        if (!start) {
          start = timestamp
        }

        let progress = Math.min(100, (timestamp - start) / duration)
        progress = inOutCube(progress)
        let scrollTop = startScrollTop + (targetScrollTop - startScrollTop) * progress
        window.scrollTo(0, scrollTop)

        if (progress < 1) {
          window.requestAnimationFrame(scroll)
        }
      }
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

function inOutCube(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n;
  return 0.5 * ((n -= 2 ) * n * n + 2);
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
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom-color: rgba(51, 51, 51, 0.1);
}
.header ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 20px;
}
.header li {
  float: left;
  margin-left: 12px;
}
.header a {
  color: #ED802F;
  text-decoration: none;
}
.header .title a {
  color: #333;
  font-weight: bolder;
}
.header .logo {
  margin-top: 3px;
  width: 1em;
  height: 1em;
  overflow: hidden;
}
.header .logo div {
  width: 1em;
  height: 2.5em;
  display: block;
  background: url(../assets/phoenix_logo.svg) no-repeat 0 0 / 100% auto,
    url(../assets/scroll-up.png) no-repeat 0 bottom / 100% auto;
  transform: translate(0);
  transition: transform 600ms cubic-bezier(.42,.26,.43,1.32);
}
.header.scroll-up .logo div {
  transform: translate(0, -60%);
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
