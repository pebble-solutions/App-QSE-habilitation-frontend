import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'À propos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/suspensions',
    name: 'Suspensions',
    component: () => import(/* webpackChunkName: "about" */ '../views/Suspensions.vue'),
    children: [
      {
        path: 'personnel/:id',
        name: 'SuspensionsPersonnelInformations',
        component: () => import('../views/SuspensionsPersonnelInformations.vue')
      },
      {
        path: 'habilitation/:id',
        name: 'SuspensionsHabilitationInformations',
        component: () => import('../views/SuspensionsHabilitationInformations.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
