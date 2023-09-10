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
                            <progress-bar :dd="new Date(control.dd)" :df="delay(control.df)" label="contrôle"></progress-bar>
            
                        </div>
                        <div class="col-1"></div>
                        <div class="col-auto text-end">
                            <router-link :to="'/habilitationHab/'+this.$route.params.id+'/new/'+control.habilitation_id+'/'+idForm+'/'+control.personnel_id" v-slot="{navigate, href}">
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

import { dateFormat } from '../js/collecte';
import ProgressBar from './ProgressBar.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';


export default{
    props: {
        idVeille:{
            type: Number,
            required: true
        },
        idForm: {
            type:Number,
            required: true
        },
    },

    components: {ProgressBar, AlertMessage, Spinner},

    data() {
        return {
            pending: {
                control: false,
            },
            listHabilitationPersonnel:[],
            listPersonnel: []
        }

    },
    watch: {
        idVeille() {
            this.loadHabilitation();
        }
    },

    methods: {
        /**
         * Charge les données du store et initialise la liste des habilitationsPersonnel en fonction de l'id du type
         */
        loadHabilitation(){
            const hab = this.$assets.getCollection("habilitationsPersonnels").getCollection();
            this.listHabilitationPersonnel = hab.filter(item => item.characteristic_id == this.$route.params.id);
        },
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
        },

        
        /**
         * return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
         * @param {date} date la date du dernier contôle réalise
         */
        delay(date){
            let dd = new Date(date);

            dd.setDate(dd.getDate()+180);
            
            return dd
        }

    },

    mounted(){
        this.loadHabilitation();
        this.listPersonnel = this.$assets.getCollection("personnels").getCollection();
    }
}

</script>