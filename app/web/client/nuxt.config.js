
const apiBaseUrl = process.env.API_BASE_URL ||  'http://127.0.0.1:8004'

module.exports = {

  router: {
    base: '/vifeng'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'vifeng Alias',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1'
      }
    ],
    link: []
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#ED802F'
  },

  modules: [
    ['@nuxtjs/proxy', {
      proxy: {
          '/vifeng/api': apiBaseUrl
      }
    }]
  ],

  css: [
    'assets/main.css'
  ],

  env: {
    apiBaseUrl
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios']
  }
}
