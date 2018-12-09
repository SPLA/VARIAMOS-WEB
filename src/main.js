// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../static/css/dashboard.css'
import '../static/css/fontawesome/all.css'
import i18n from './i18n'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.use(VueI18n)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  i18n,
  components: { App }
})
