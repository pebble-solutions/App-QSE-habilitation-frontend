<template>
    <div class="container">
     <div class="d-flex align-items-center row justify-content-between">
         <div class="ps-1 col-1">
             <i class="bi" :class="icon"></i>
         </div>
         <div class="col-9">{{ getTypeName }}</div>
         <div class="col"></div>
         <div class="badge bg-secondary col-1" v-if="num">{{ num }}</div>
     </div>
    </div>
 </template>
 <script>
 import { mapState } from 'vuex';
 export default {
     props: {
         habilitation: Object,
         icon: {
             type: String,
             default: 'bi bi-patch-check-fill'
         },
         num: {
             type: Number,
             default: null
         }
     },
     computed: {
         ...mapState(['types']),
         getTypeName() {
             const habilitationType = this.types.find(type => type.id === this.habilitation.habilitation_type_id);
             return habilitationType ? habilitationType.nom : '';
         }
     }
 };
 </script>
 <style>
 .custom-text {
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     max-width: 100%;
 }
 </style>
 
 
 
 
 
 
 
 
 
 