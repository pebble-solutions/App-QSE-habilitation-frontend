import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/registre/',
    name: 'registre',
    component: () => import(/* webpackChunkName: "about" */ '../views/Registrehabilitation.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/Registrehabilitation.vue'),
      },
    ],
  },
  {
    path: '/registre/information/:idhabilitation',
    name: 'registreInformation',
    component: () => import(/* webpackChunkName: "about" */ '../views/InformationProcessusModal.vue'),
  },
  {
    path: '/element/:id',
    name: 'Element',
    component: () => import(/* webpackChunkName: "about" */ '../views/Element.vue'),
    children: [
      {
        path: 'properties',
        component: () => import('../views/ElementProperties.vue')
      },
      {
        path: 'informations',
        component: () => import('../views/ElementInformations.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
