import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'spin',
    component: () => import('@/views/spin')
  },
  {
    path: '/game/:type',
    name: 'game',
    component: () => import('@/views/game')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
