import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueCryptojs from 'vue-cryptojs'
import VModal from 'vue-js-modal'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter)
Vue.use(VueResource)  // http requests
Vue.use(VueCryptojs)  // Encryption
Vue.use(VModal)

Vue.config.productionTip = false

// register routes
const router = new VueRouter({
    routes: Routes
})

new Vue({
  render: h => h(App),
  router: router,
}).$mount('#app')
