import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueResource from 'vue-resource'
import VueCryptojs from 'vue-cryptojs'
import VModal from 'vue-js-modal'

Vue.use(VueResource)  // http requests
Vue.use(VueCryptojs)  // Encryption
Vue.use(VModal)


Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
