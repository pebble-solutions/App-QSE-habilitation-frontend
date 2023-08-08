<template>
    <h1 class="m-3">HABILITATIONS</h1>

    <div class="d-flex align-items-center ms-3 mb-3">
        <h2 class="text-secondary me-2">#{{ $route.params.id }}</h2>
        <h2>{{ getPersonnelName }}</h2>
    </div>

<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex">
        <div class="col-4">
            habilitation {{ hab.habilitation_type_id }}
            {{ getHabilitationTypeName(hab.habilitation_type_id) }}
        </div>
        <div class="col-4">
            date début : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class=" col-4">
            date fin : {{ displayDateFormat(hab.df) }}
        </div>
    </div>
</div>
</template>

<script>

import {dateFormat} from '../js/app/date';
import { mapState } from 'vuex';

export default {

	data() {
		return {
		}
	},

	computed: {
		...mapState(['habilitations', 'personnels', 'habilitationType']),

        getHabilitations(){
            return this.habilitations.filter(e => e.personnel_id == this.$route.params.id)
        },

        getPersonnelName(){
            let personnel = this.personnels.find(e => e.id == this.$route.params.id)
            if (personnel){
                return personnel.cache_nom
            } else {
                return "Aucun nom d'operateur renseigné"
            }
        },

	},

    methods:{
        displayDateFormat(el){
            return dateFormat(el);
        },

        getHabilitationTypeName(id){
            let habType = this.habilitationType.find(e => e.id == id);
            return habType.nom
        }
    },

}
</script>