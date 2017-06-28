let path = require('path')
let Nuxt = require('nuxt')
let nuxtConfig = require('./nuxt.config')

nuxtConfig.dev = process.env.NODE_ENV !== 'production'
nuxtConfig.modules = []
nuxtConfig.rootDir = path.resolve(__dirname)
nuxtConfig.srcDir = path.resolve(__dirname)
nuxtConfig.cache = true

let nuxt = new Nuxt(nuxtConfig)
module.exports = nuxt
