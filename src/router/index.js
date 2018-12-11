import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Models from '@/components/Models'
import Reports from '@/components/Reports'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/models/:type',
      name: 'Models',
      component: Models
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports
    }
  ]
})
