import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transitionName: 'fade' }, 
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
    path: '/types',
    name: 'types',
    meta: { transitionName: 'fade' } ,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Types.vue'),
    children: [
      {
        path: 'new',
        name: 'newConfig',
        component: () => import(/* webpackChunkName: "about" */ '../views/TypeConfigNew.vue')
      },

    ],
  },
  {
    path: '/types/:id',
    name: 'typeConfig',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TypeConfig.vue'),
    children: [
      
      {
        path: 'edit',
        name: 'editConfig',
        component: () => import(/* webpackChunkName: "about" */ '../views/TypeConfigEdit.vue')
      },
      {
        path: 'veille/new',
        name: 'newVeille',
        component: () => import(/* webpackChunkName: "about" */ '../views/TypeVeilleNew.vue')
      },
      {
        path: 'veille/edit/:idVeille',
        name: 'editVeille',
        component: () => import(/* webpackChunkName: "about" */ '../views/TypeVeilleEdit.vue')
      },
    ]
  },
  {
    path: '/personnels',
    name: 'personnels',
    meta: { transitionName: 'fade' }, 
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Personnels.vue'),
  },
  {
    path: '/suspension',
    name: 'suspension',
    meta: { transitionName: 'fade' }, 
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Suspension.vue'),
  },
  {
    path: '/personnels/:id',
    name: 'ficheIndividuelleSuivi',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/FicheIndividuelle.vue'),
  },
  {
    path:'/echeancier',
    name: 'Echeancier',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Echeancier.vue')
  },
  {
    path:'/statistiques',
    name: 'Statistiques',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Statistiques.vue')
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
