<template>
    
    <div class="container py-2 px-2">
        <template v-if="listHabilitationPersonnel">
            <h2 class="mb-3">
                <span class="me-3 fw-lighter"># {{ IdType }} </span>
                {{ filterhabilitationType}}
            </h2>
            <vigil-control :idVeille="IdType" :listHabilitationPersonnel="listHabilitationPersonnel" ></vigil-control>
        </template>
        <alert-message v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas d'habilitation sur ce type d'habilitation</alert-message>
        <router-view></router-view>
    </div>
</template>
<script>

import { mapState } from 'vuex';
import {dateFormat} from '../../js/collecte';
import VigilControl from '../../components/VigilControl.vue';
import AlertMessage from '../../components/pebble-ui/AlertMessage.vue';

export default {
    components: { AlertMessage, VigilControl}, //ProgressBar, Spinner
    


    data() {
        return {
            pending: {
                habilitation: false,
                agent:false,
            },
            listHabilitationPersonnel: []
        }
    },

    watch: {
        IdType() {
            this.loadHabilitation();
        }
    },

    computed: {
        ...mapState(['types', 'listActifs']),

        /**
         * Parcour la liste des types d'habilitation en fonction de l'id de la route
         * et retourne le nom du type de l'habilitation
         *
         * @returns {string} nom du type de l'habilitation
         * 
         */
        filterhabilitationType() {
            let type = this.types.find((e) => e.id  == this.$route.params.id);
            return type.nom
        },

        /**
         * Retourne  l'id de la route
         * 
         * @returns {number} id
         */
        IdType() {
            return this.$route.params.id
        }
    },

    methods: {
          /**
         * Charge les données du store et initialise la liste des habilitationsPersonnel en fonction de l'id du type
         */
         loadHabilitation(){
            const hab = this.$assets.getCollection("habilitationsPersonnels").getCollection();
            this.listHabilitationPersonnel = hab.filter(item => item.characteristic_id == this.$route.params.id);
        }
    },

    mounted(){
        this.loadHabilitation();
    }
}
</script>