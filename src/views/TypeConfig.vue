<template>
    <div class="pt-4">
        <!-- Image avec hauteur max de 200px et marge de 4 -->
        <div class="d-flex justify-content-center align-items-center m-2 mb-4">
            <!-- Image avec largeur max de 500px, prenant la largeur totale avec marges -->
            <img src="../assets/Habilitations.png" alt="habilitations" class="img-fluid"
                style="max-width: 500px; width: 100%;">
        </div>
        <div v-if="hab" class="card m-2 p-2 text-white text-center custom-app-color">
            <h4 class="">{{ hab.nom }}</h4>
            <div class="row g-2">
                <div class="col-12 col-md-6">
                    <div class="card p-2 d-flex flex-column h-100">
                        <div class="d-flex justify-content-center align-items-center py-3">
                            <h5>Configuration du TYPE <span class="fw-lighter">#{{ hab.id }}</span></h5>
                        </div>
                        <span>{{ isActive(hab.df) }}</span>
                        <div>Date début : <span :class="{ 'text-secondary': !hab.dd }">{{ hab.dd ? formatDate(hab.dd) :
                            'Date Inconnue' }}</span></div>
                        <div>Date fin : <span :class="{ 'text-secondary': !hab.df }">{{ hab.df ? formatDate(hab.df) : 'Date Inconnue' }}</span></div>
                        <div class="mb-2">Durée de validité : <span :class="{ 'text-secondary': !hab.expiration }">{{hab.expiration ? hab.expiration : 'Durée inconnue' }}</span></div>
                        <div class="mt-auto"> <!-- Ajout de la marge de 2 -->
                            <button class="btn btn-custom-primary w-100" @click.prevent="$router.push($route.path + '/edit')">Modifier</button>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card p-2 d-flex flex-column h-100">
                        <spinner v-if="pending.load"></spinner>
                        <div v-else-if="veilleConfig">
                            <div class="d-flex justify-content-center align-items-center py-3">
                                <h5>Configuration de la VEILLE <span class="fw-lighter">#{{ veilleConfig.id }}</span> </h5>
                            </div>
                            <span>{{ veilleConfig.nom }}</span><br>
                        <span>{{ isActive(veilleConfig.df) }}</span>

                            <div>Date début : <span class="fw-lighter" :class="{ 'text-secondary': !veilleConfig.dd }">{{ veilleConfig.dd ?
                                formatDate(veilleConfig.dd) : 'Date Inconnue' }}</span></div>
                            <div>Date fin : <span class="fw-lighter" :class="{ 'text-secondary': !veilleConfig.df }">{{ veilleConfig.df ?
                                formatDate(veilleConfig.df) : 'Date Inconnue' }}</span></div>
                            <div>Formulaire associé : <span class="fw-lighter">{{ veilleConfig.formulaire_id }}</span> </div>
                            <div class="mb-2">Pas de veille : <span class="fw-lighter me-1">{{ veilleConfig.control_step }}</span>jours
                            </div>
                            <div class="mt-auto"> <!-- Ajout de la marge de 2 -->
                                <button class="btn btn-custom-primary w-100" @click.prevent="$router.push($route.path + '/veille/edit/'+veilleConfig.id)">Modifier</button>
                            </div>
                        </div>
                        <AlertMessage v-else class="m-3" variant="warning" icon="bi-exclamation-square">
                            Il n'y pas pas de veille configurée pour ce type d'habilitation
                            <button class="btn btn-outline-primary ms-2" @click.prevent="$router.push($route.path + '/veille/new')">Configurer une veille</button>
                        </AlertMessage>
                    </div>
                </div>
            </div>
        </div>
        <RouterView></RouterView>
        <div>
            {{ veilleConfig }}
            <VigilHab v-if="veilleConfig" :idVeille="veilleConfig.id" :idForm="veilleConfig.formulaire_id"></VigilHab>
        </div>
        <!-- <RouterView></RouterView> -->
    </div>
</template>


<script>
// import { RouterView } from 'vue-router';
import { mapState } from 'vuex';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import VigilHab from '../components/VigilHab.vue';
import { RouterView } from 'vue-router';



export default {
    data() {
        return {
            hab: null,
            veille: null,
            veilleConfig: null,
            pending: {
                load: false,
            },
            active: null,
        };
    },
    computed: {
        ...mapState(['types', 'veilles', 'personnels', 'habilitationsPersonnels']), //habilitationType
    },
    methods: {

        /**
         * compare la date de fin du type d'habilitation avec la date du jour et
         * retourne la valeur du booleen isActive
         *  @param  {Date} date de fin du type d'habilitation
         *  @returns    {Boolean}   isactive vrai si la config est actuve
         *  
         */
        isActive(df){
            const now = new Date();
            let end = new Date(df);
            if(!end){
                return ''
            }
            else if(end<now){
                return 'expiré';
            }
            else return 'actif';



        },
        /**
         * récupère depuis le store la config du type d'habilitation concernée en 
         * fonction de l'id fourni
         * @param   {Number}    id  id du type d'habilitation
         * @returns {Object}    config du type d'ahabilitation
         */
        findType(id) {
            let typeHab = this.types.find(e => e.id == id);
            this.hab = typeHab;
            console.log('Date début (hab.dd):', this.hab.dd);
        },

        /**
         * récupère depuis le store la config de la veille en relation avec l'habilitation-type concernée
         * @param   {number}    id  id du type d'habilitation
         * @returns {Object}    config de la veille
         */
        findVeille(id) {
            this.pending.load = true;
            let veille = this.veilles.find(e => e.objet_id == id);
            this.veilleConfig = veille;
            this.pending.load = false;
            return veille
        },

        /**
         * formate la date
         */
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
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

    components: { AlertMessage, Spinner, VigilHab, RouterView } 
 //RouterView
}
</script>

<style scoped>
.logo {
    width: 20%;
    height: auto;
}

.custom-app-color {
    background-color: #F78C6B;
}

.btn-custom-primary {
    color: #F78C6B;
    background-color: #fff;
    border: 1px solid #F78C6B;
    width: 300px;
    /* Ajuster la largeur selon vos besoins */
}

.btn-custom-primary:hover {
    color: #fff;
    background-color: #F78C6B;
    border: 1px solid #F78C6B;
}</style>