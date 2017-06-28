import Vue from 'vue'
import Router from 'vue-router'
import Programs from '@/components/Programs'
import Program from '@/components/Program'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'programs',
      component: Programs
    },
    {
      path: '/program/:programId',
      name: 'program',
      component: Program
    }
  ]
})
