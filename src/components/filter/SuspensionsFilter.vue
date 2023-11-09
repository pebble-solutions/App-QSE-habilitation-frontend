<template>
    <div class="p-2 my-2">
        <h5 class="mb-3">Période</h5>
        <div class="mb-3 px-2">
            <label class="form-label" for="DateDebut">Date de début</label>
            <input type="date" class="form-control" id="dd" name="date" v-model="periode.dd" required>
        </div>

        <div class="mb-3 px-2">
            <label class="form-label" for="DateFin">Date de fin</label>
            <input type="date" class="form-control" id="df" name="date" v-model="periode.df" required>
        </div>
            
        <h5 class="mb-3">Personnel</h5>

        <PersonnelsFilter 
            v-model:contratDd="personnel.contratDdFilter" 
            v-model:contratDf="personnel.contratDfFilter" 
            v-model:withContrat="personnel.withContratFilter" 
            v-model:withoutContrat="personnel.withoutContratFilter" 
            v-model:croissant="croissant"/>
        
        <h5 class="mb-3 mt-3">Ordre chronologique des suspensions</h5>
        <div class="btn-group w-100 mb-3 px-2">
            <button type="button" class="btn btn-outline-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi" :class="classIcon"></i>
                {{ labelOrderBy }}
            </button>

            <ul class="dropdown-menu w-100">
                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'asc'">
                        <i class="bi bi-arrow-up"></i>
                        Croissant
                    </div>
                </li>

                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'desc'">
                        <i class="bi bi-arrow-down"></i>
                        Décroissant
                    </div>
                </li>
            </ul>
        </div>

        <div class="text-center my-4">
            <button class="btn btn-primary" type="submit" :disabled="pending.suspensions" @click="search()">
                <span class="spinner-border spinner-border-sm" role="status" v-if="pending.suspensions"></span>
                <i class="bi bi-check-lg" v-else></i>
                Appliquer
            </button>
        </div>
    </div>

</template>

<script>

import PersonnelsFilter from './PersonnelsFilter.vue';
import AppSearchBar from "@/components/pebble-ui/AppSearchBar.vue";
import {diffDate} from "../../js/date";

export default {

    data() {
        return {
            periode: {
                dd: null,
                df: null,
            },
            personnel: {
                contratDdFilter: null,
                contratDfFilter: null,
                withContratFilter: true,
                withoutContratFilter: false,
            },
            croissant : false,
            searchOrdre: "asc",
            pending: {
                suspensions: false,
            }
        }
    },

    components:{
        PersonnelsFilter,
        AppSearchBar
    },

    computed: {
        classIcon() {
            if ('asc' == this.searchOrdre) {
                return 'bi-arrow-up';
            }
            return 'bi-arrow-down';
        },

        labelOrderBy() {
            return this.searchOrdre == "asc" ? "Croissant" : "Décroissant"
        }
    },
    
    methods: {
        /**
         * Enregistre le résultat de la recherche/des filtres dans le store.
         */
         async search() {
            this.pending.suspensions = true;
            
            console.log("FILTRE PERSONNEL", this.personnel);
            this.$assets.getCollection("personnelsFiltered").reset();
			await this.$assets.getCollection("personnelsFiltered").load(
				{
					date_start: this.personnel.contratDdFilter,
					date_end: this.personnel.contratDfFilter,
					active_only: this.personnel.withContratFilter ? 1 : 0
				}
			);
            
            const idsPersonnelsFiltered = [];
            for (let personnel of this.$assets.getCollection("personnelsFiltered").getCollection()){
                idsPersonnelsFiltered.push(personnel.id)
            }

            console.log("TRI CHRONOLOGIQUE", this.searchOrdre);
            const triChronologique = "DESC" ? "desc" : "ASC";

            console.log("FILTRE PERIODE", this.periode)
            this.$assets.getCollection("suspensions").reset();
			await this.$assets.getCollection("suspensions").load(
				{
					dd: this.periode.dd,
					df: this.periode.df,
                    ids_personnels : idsPersonnelsFiltered,
                    tri_chronologique : triChronologique
				}
			);

            console.log(this.$assets.getCollection("suspensions").getCollection())
            
            this.pending.suspensions = false;
        }

    }
}

</script>