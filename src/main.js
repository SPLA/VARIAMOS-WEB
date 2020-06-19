import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/dashboard.css'
import './assets/css/fontawesome.css'
import store from './store'
import messages from './assets/js/common/messages'

Vue.use(VueI18n)
Vue.config.productionTip = false

//Set variable on the global object.
global.messages = messages

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
