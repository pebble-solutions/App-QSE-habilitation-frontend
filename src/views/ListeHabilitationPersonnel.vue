<template>
    <h1 class="m-3">HABILITATIONS</h1>
    {{ personnels[0].cache_nom }}

    <div class="d-flex align-items-center ms-3 mb-3">
        <h2 class="text-secondary me-2">#{{ $route.params.id }}</h2>
        <h2>{{ getPersonnelName }}</h2>
    </div>
    <h3>Validité en cours</h3>
    <div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex border border-3 border-success m-1">
        <div class="col-5">
            habilitation {{ hab.habilitation_type_id }}
            {{ getHabilitationTypeName(hab.habilitation_type_id) }}
        </div>
        <div class="col-3">
            date début : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class=" col-3">
            date fin : {{ displayDateFormat(hab.df) }} 22/12/2023
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>
        </div>
    </div>
</div>
<h3>Suspensions en cours</h3>
<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex border border-3 border-warning m-1">
        <div class="col-5">
            <!-- nom habilitation suspendue-->
            <p>motif et date : </p>
        </div>
        <div class=" col-3">
            date début  : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class=" col-3">
            date fin : {{ displayDateFormat(hab.df) }}
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link mx-2 d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>

        </div>
    </div>
</div>
<h3>Suspensions passées </h3>
<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex border border-3 border-warning m-1">
        <div class="col-5">
            <!--mettre ici nom habilitation suspendue motif suspension et date suspension -->
            <p>motif et date : </p>
        </div>
        <div class=" col-3">
            date début  : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class=" col-3">
            date fin : {{ displayDateFormat(hab.df) }}
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>
        </div>
    </div>
</div>
<h3>Expirées</h3>
<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex bg-seconary border border-3 border-danger m-1">
        <div class="col-5">
            <!-- mettre ici nom habilitation expirée -->
        </div>
        <div class=" col-3">
            date début  : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class=" col-3">
            date fin : {{ displayDateFormat(hab.df) }}
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>
        </div>
    </div>
</div>
<h3>A Venir</h3>
<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex bg-light border border-3 border-info m-1">
        <div class="col-6">
            <!-- mettre ici nom habilitation programmée -->
        </div>
        <div class=" col-5">
            date début  : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>
        </div>
    </div>
</div>
<h3>Veille</h3>
<div class="d-flex flex-column" v-for="hab in getHabilitations" :key="hab.id">
    <div class="row d-flex bg-light border border-3 border-secondary m-1">
        <div class="col-6">
            <!-- mettre ici nom habilitation programmée -->
        </div>
        <div class=" col-5">
            date début  : {{ displayDateFormat(hab.dd) }}
        </div>
        <div class="col-1">
            <router-link :to="'/registre/information/'+3" v-slot="{ href }">
                <a type="button" class="btn btn-link d-flex align-items-center p-1" :href="href">
                    <slot class="bi bi-info">Détails</slot>
                </a>
            </router-link>
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