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

//Axio client HTTP basado en promesas.
import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueI18n)
Vue.use(VueAxios, axios);
Vue.config.productionTip = false

//Set variable on the global object.
global.messages = messages

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
