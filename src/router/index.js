import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from "../components/search.vue";
//import Glossary from "./components/glossary.vue"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Search
  },
  {
    path: '/lexicon',
    name: 'Lexicon',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/glossary.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
