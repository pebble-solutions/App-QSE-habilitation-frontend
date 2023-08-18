<template>
    <div>
        <div v-if="hab">
            <h4 class="my-3">   {{ hab.nom }}</h4>
            <div class="row">
                <div class="card col-6 ">
                    <div class="d-flex justify-content-between  align-items-center py-3">
                        <h5>Configuration du TYPE <span class="fw-lighter">#{{ hab.id }}</span></h5>
                        <div>
                            <button class="btn btn-outline-primary" @click.prevent="$router.push($route.path + '/edit')" >Modifier</button>
                        </div>
                    </div>
                    <div>Date début : <span>{{ hab.dd }}</span> </div>
                    <div>Date fin :  <span>{{ hab.df }}</span> </div>
                    <div>Durée de validité :  <span>{{ hab.expiration }}</span> </div>
                </div>
                <br>
                <div class="card col-6">
                    <spinner v-if="pending.load"></spinner>
                    <div v-else-if="veilleConfig">
                        <div class="d-flex justify-content-between  align-items-center py-3">
                            <h5>Configuration de la VEILLE <span class="fw-lighter">#{{ veilleConfig.id }}</span> </h5>
                            <div>
                                <button class="btn btn-outline-primary" >Modifier ?</button>
                            </div>
                        </div>
                        
                        <div>Date début : <span>{{ veilleConfig.dd }}</span> </div>
                        <div>Date fin :  <span>{{ veilleConfig.df }}</span> </div>
                        <div>Formulaire associé :  <span>{{ veilleConfig.formulaire_id }}</span> </div>
                        <div>Pas de veille :  <span class="me-1">{{ veilleConfig.control_step }}</span>jours </div>
                        <div>Commentaire :  <span>{{ veilleConfig.commentaire }}</span> </div>
                        
                    </div>
                    <AlertMessage v-else class="m-3" variant="warning" icon="bi-exclamation-square">Il n'y pas pas de veille configurée pour ce type d'habilitation<button class="btn btn-outline-primary ms-2">Créer?</button></AlertMessage>
                </div>
            </div>
        </div>
        <div>
            <VigilHab v-if="veilleConfig" :idVeille="veilleConfig.id" :idForm="veilleConfig.formulaire_id"></VigilHab>
        </div>
        <br>
        
       
       

        <RouterView></RouterView>
    </div>
</template>
<script>
import { RouterView } from 'vue-router';
import { mapState } from 'vuex';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import VigilHab from '../components/VigilHab.vue';



export default {
    data() {
        return {
            hab: null,
            veille: null,
            veilleConfig: null,
            pending: {
                load: false,
            }
        };
    },
    computed: {
        ...mapState(['habilitationType','types', 'veilles', 'personnels', 'habilitationsPersonnels']),
    },
    methods: {
        /**
         * récupère la config du type d'habilitation
         */
        findType(id) {
            let typeHab = this.types.find(e => e.id == id);
            this.hab = typeHab;
        },

        /**
         * récupère la config de la veille en relation avec l'habilitation-type concerné
         */
        findVeille(id) {
            this.pending.load = true;
            let veille = this.veilles.find(e => e.objet_id == id);
            this.veilleConfig = veille;
            this.pending.load = false;
            return veille
        },

       
    },

    /**
     * Lorsque la route interne est mise à jour, les nouvelles config
     * du type d'habilitation et de la veille sont chargées
     * 
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.hab.id) {
            this.findType(to.params.id);
            this.findVeille(to.params.id)
        }
    },

    /**
     * charge les config du type d'habilitation et de la veille
     */
    beforeMount() {
        this.findType(this.$route.params.id);
        this.findVeille(this.$route.params.id);
    },

    components: { RouterView, AlertMessage, Spinner, VigilHab}
}
</script>