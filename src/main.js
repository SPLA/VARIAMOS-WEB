import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/dashboard.css'
import './assets/css/fontawesome.css'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.config.productionTip = false
Vue.use(VueI18n)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
