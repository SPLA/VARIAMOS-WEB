import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/models/:project/:folder/:type',
      name: 'Models',
      component: () => import('./views/Multi-models.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('./views/Reports.vue')
    },
    {
      path: '/applies',
      name: 'Applies',
      component: () => import('./views/Applies.vue')
    },
    {
      path: '/fragop',
      name: 'FragOP',
      component: () => import('./views/FragOP.vue')
    },
    {
      path: '/hlvl',
      name: 'HLVL',
      component: () => import('./views/HLVL.vue')
    },
    {
      path: '/requireX',
      name: 'RequireX',
      component: () => import('./views/RequireX.vue')
    }
  ]
})
