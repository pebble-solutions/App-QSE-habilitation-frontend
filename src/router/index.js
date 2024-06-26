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
    
      {
        path: ':idCollecte',
        name: 'readCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/TypeReadCollecte.vue')
      },
      {
        path: ':idForm/:idAgent',
        name: 'StatsAgent',
        component: () => import("../views/TypeReadStats.vue"),
      },
    ]
  },
  {
    path: '/suspension',
    name: 'suspension',
    meta: { transitionName: 'fade' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Suspension.vue'),
    children: [
        {
            path: ':idSuspension',
            name: 'suspensionInfo',
            component: () => import(/* webpackChunkName: "about" */ '../views/SuspensionFormModal.vue')
        }
    ]
  },
  {
    path:'/registre',
    name: 'registre',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Registre.vue')
  },
  {
    path:'/echeancier',
    name: 'echeancier',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Echeancier.vue')
  },
  {
    path:'/programmer',
    name: 'programmer',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Programmer.vue')
  },
  {
    path: '/habilitationPersonnel',
    name: 'programmerHabilitationPersonnel',
    component: () => import(/* webpackChunkName: "about" */ '../views/Programmer.vue'),
  },
  {
    path: '/habilitationPersonnel/:id',
    name: 'programmerHabilitationPersonnelInfo',
    component: () => import(/* webpackChunkName: "about" */ '../views/habilitation/HabilitationPersonnelStatus.vue'),
    children: [
      {
        path: 'suspension/:idSuspension/edit',
        name: 'editSuspensionHabilitationPersonnel',
        component: () => import('../views/SuspensionFormModal.vue'),
      },
      {
        path: 'suspension/:idPersonnel/create',
        name: 'createSuspensionHabilitationPersonnel',
        component: () => import('../views/SuspensionCreateFormModal.vue'),
      },
    ]
  },
  {
    path: '/habilitation',
    name: 'programmerHabilitation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Programmer.vue'),
  },
  {
    path: '/habilitationHab/:id',
    name: 'programmerHabilitationHab',
    component: () => import(/* webpackChunkName: "about" */ '../views/habilitation/HabilitationByHab.vue'),
  },
  {
    path:'/statistiques',
    name: 'statistiques',
    meta: { transitionName: 'fade' }, 
    component: () => import(/* webpackChunkName: "about" */ '../views/Statistiques.vue')
  },
  {
    path: '/operateur',
    name: 'operateur',
    component: () => import("../views/Operateur.vue"),
  },
  {
    path: '/operateur/:id',
    name: 'habilitationByAgent',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationByAgent.vue'),
    children: [
      {
        path: ':idForm',
        name: 'agentStats',
        component: () => import("../views/AgentReadStats.vue"),
      },
      {
        path: ':idCollecte',
        name: 'readCollecteOperateur',
        component: () => import(/* webpackChunkName: "about" */ '../views/PersonnelReadCollecte.vue')
      },
      {
        path: ':idSuspension/edit',
        name: 'editSuspension',
        component: () => import('../views/SuspensionFormModal.vue'),
      },
      {
        path: 'suspension/:idHabilitation/create',
        name: 'createSuspension',
        component: () => import('../views/SuspensionCreateFormModal.vue'),
      },
      // {
        //   path: ':idHab',
        //   name: 'controlHistory',
        //   component: () => import(/* webpackChunkName: "about" */ '../views/ControlHistory.vue'),
        //   children: [
          //     {
            //       path: ':idCollecte',
            //       name: 'controlView',
            //       component: () => import(/* webpackChunkName: "about" */ '../views/ControlVue.vue')
            //     }
            //   ]
            // },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
