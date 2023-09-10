<template>
        <spinner v-if="pending.control"></spinner>
        <template v-else>
            <div class="list-group" v-if="listHabilitationPersonnel.length">
                <div class="list-group-item" v-for="control in listHabilitationPersonnel" :key="control.id">
                    <div class="row align-items-center">
        
                        <div class="col-3">
                            {{returnName(control)}}
                        </div>
                        <div class="col">
                            <progress-bar :dd="new Date(control.dd)" :df="new Date(control.df)" label="contrôle"></progress-bar>
            
                        </div>
                        <div class="col-1"></div>
                        <div class="col-auto text-end">
                            <router-link :to="'/habilitationHab/'+this.$route.params.id+'/renouveler'" v-slot="{navigate, href}">
                                <a :href="href"  @click="navigate" class="btn btn btn-sm btn-outline-primary">
                                    <i class="bi bi-arrow-clockwise" ></i>
                                    <span class="d-none d-md-inline ms-1">
                                        Renouveler
                                    </span>
                                </a>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas de personnel à habilité pour cette habilitation</alert-message>

        </template>


</template>
<script>

import ProgressBar from './ProgressBar.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';


export default{
    props: {
        idType:{
            type: Number,
            required: true
        },
        listHabilitationPersonnel: {
            type:Array,
            required: true
        },
    },

    components: {ProgressBar, AlertMessage, Spinner},

    data() {
        return {
            pending: {
                control: false,
            },
            listPersonnel: []
        }

    },

    methods: {
         /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},
        /**
         * retourne le nom du personnel ou bine personnel non trouvé
         * 
         * @param {object}  control objet contenant cle personnel et personnel_id
         * 
         * @return {string}
         */
        returnName(control){
            let personnel = this.listPersonnel.find(item => item.id == control.personnel_id)
            if (!personnel) {
                return control.personnel_id ? `Personnel non trouvé ${control.personnel_id}` : `Personnel non défini`; 
            }
            return personnel.cache_nom;
        }

    },

    mounted(){
        this.listPersonnel = this.$assets.getCollection("personnels").getCollection();
    }
}

</script>