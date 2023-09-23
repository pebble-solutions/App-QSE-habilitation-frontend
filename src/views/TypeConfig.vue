<template>
    <div class="container pt-4">
        <!-- Image avec hauteur max de 200px et marge de 4 -->
        <div class="d-flex justify-content-center align-items-center m-2 mb-4">
            <!-- Image avec largeur max de 500px, prenant la largeur totale avec marges -->
            <img src="../assets/Habilitations.png" alt="habilitations" class="img-fluid"
            style="max-width: 500px; width: 100%;">
        </div>
        
        <div v-if="typeHab" class="card m-2 p-3 text-white text-center custom-app-color">
            <h4 class="my-4">{{ typeHab.nom }}</h4>
            <div class="row g-2 mb-3">
                <div class="col-12 col-md-6">
                    <div class="card p-2 d-flex flex-column h-100">
                        <div class="d-flex justify-content-center align-items-center py-3">
                            <h5>Configuration du TYPE <span class="fw-lighter">#{{ typeHab.id }}</span></h5>
                        </div>
                        <span>Statut : {{ isActive(typeHab.df) }}</span>
                        <div>Date début : <span class="fw-lighter" :class="{ 'text-secondary': !typeHab.dd }">{{ typeHab.dd ? formatDate(typeHab.dd) :
                            'Date Inconnue' }}</span></div>
                        <div>Date fin : <span class="fw-lighter" :class="{ 'text-secondary': !typeHab.df }">{{ typeHab.df ? formatDate(typeHab.df) : 'Date Inconnue' }}</span></div>
                        <div class="mb-2">Durée de validité : <span class="fw-lighter" :class="{ 'text-secondary': !typeHab.expiration }">{{typeHab.expiration ? typeHab.expiration : 'Durée inconnue' }}</span></div>
                        <div class="mt-auto"> <!-- Ajout de la marge de 2 -->
                            <button class="btn btn-custom-primary w-100" @click.prevent="$router.push($route.path + '/edit')">Modifier</button>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card p-2 d-flex flex-column h-100">
                        <div v-if="veilleConfig">
                            <div class="d-flex justify-content-center align-items-center py-3">
                                <h5>Configuration de la VEILLE <span class="fw-lighter">#{{ veilleConfig.id }}</span> </h5>
                            </div>
                            <span>{{ veilleConfig.nom }} sur le type {{ veilleConfig.objet_id }}</span><br>
                            <span>Statut : {{ isActive(veilleConfig.df) }}</span>

                            <div>Date début : <span class="fw-lighter" :class="{ 'text-secondary': !veilleConfig.dd }">{{ veilleConfig.dd ?
                                formatDate(veilleConfig.dd) : 'Date Inconnue' }}</span></div>
                            <div>Date fin : <span class="fw-lighter" :class="{ 'text-secondary': !veilleConfig.df }">{{ veilleConfig.df ?
                                formatDate(veilleConfig.df) : 'Date Inconnue' }}</span></div>
                            <div>Formulaire associé : <span class="fw-lighter">{{ findNameFormulaire(veilleConfig.formulaire_id) }} {{ veilleConfig.formulaire_id }}</span> </div>
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
            <h4 class="mt-3">Liste du personnel habilité :</h4>
            <div  v-if="!pending.load && !pending.control && !pending.veille && listHabPersoType">
                <div class="my-3" v-for="personnelHabilitation in listHabPersoType" :key="personnelHabilitation.id">
                    <HabMonitorPersonnel 
                    :personnelHabilitation="personnelHabilitation"
                    :veilleConfig="veilleConfig" 
                    :veille="getVeilleByHabilitationId(personnelHabilitation.id)"
                    :controles="getControlesByHabilitationId(personnelHabilitation.id)"
                    :displayHab="true" 
                    :displayAgent="true">
                    </HabMonitorPersonnel>
                </div>
            </div>
            <Spinner v-else-if="pending.load || pending.control || pending.veille && !listHabPersoType"></Spinner>
            <div v-else>Pas d'habilitation</div>
        </div>
        
    </div>
    <RouterView></RouterView>
</template>


<script>
// import { RouterView } from 'vue-router';
import { mapState } from 'vuex';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import { RouterView } from 'vue-router';
import HabMonitorPersonnel from '../components/HabMonitorPersonnel.vue'
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';



export default {
    data() {
        return {
            typeHab: null,
            veille: null,
            veilleConfig: null,
            pending: {
                load: false,
                veille:false,
                control:false
            },
            active: null,
            listHabPersoType:[],
            listVeille: [],
            listControles: [],

        };
    },
    computed: {
        ...mapState(['types', 'veilles', 'personnels', 'habilitationsPersonnels', 'formulaires']), 
    },
    methods: {

        /**
         * retourne le nom du formulaire à partir de l'id fourni
         * 
         *@param    {Number}    id  id du formualire
         */
        findNameFormulaire(id){
            let nameFormulaire = this.formulaires.find(e => e.id === id);
            return nameFormulaire.groupe

        },

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
            if(df == null){
                return 'pas de date d\'expiration'
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
            let type = this.types.find(e => e.id == id);
            this.typeHab = type;
        },

        /**
         * récupère depuis le store la config de la veille en relation avec l'habilitation-type concernée
         * et récupère les informations de veille
         * @param   {number}    id  id du type d'habilitation
         * @returns {Object}    config de la veille
         */
        async findVeille(id) {
            let veille = this.veilles.find(e => e.objet_id == id);
            if (veille) {
                this.veilleConfig = veille;
                await this.loadControlVeille(veille.id)
            }
            else 
            this.veilleConfig = null;
            
        },

        /**
         * récupère les informations de la veille via requête api
         * notamment les controles à réaliser
         * @param {number} id de la veille
         */
        async loadControlVeille(id) {
            this.pending.veille = true
            try {
                this.listVeille = await this.$app.apiGet('v2/controle/veille/' + id + '/todo', { CSP_min: 0, CSP_max: 600 });
            }
            catch (e) {
                this.$app.catchError(e)
            }
            finally {
                this.pending.veille = false
            }
            
        },

        /**
         * formate la date
         */
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },

       
        /**
         * retourne la liste des habilitations personnelles en fonction de l'id type habilitation fourni
         * infos personnels et types d'habilitation joints
         * 
         * retourne la config de la veille associée et la liste des contrôles de veille
         * retourne la liste des controles réalisés pour les habilitations des personnels concernés
         * 
         * @param {*} id 
         * @returns {Array} liste des personnels habilités
         */

        async findHabilitationPersonnel(id) {
            this.pending.load = true;
            this.listControles= [];
            let listHabilitationPersonnels = this.habilitationsPersonnels.filter(e => e.characteristic_id == id);
            let assemblerPersonnel = new AssetsAssembler(listHabilitationPersonnels);
            await assemblerPersonnel.joinAsset(this.$assets.getCollection("personnels"), 'personnel_id', 'personnel');
            let joinedListHab = assemblerPersonnel.getResult();
            this.listHabJoin = joinedListHab;
            let assemblerType = new AssetsAssembler(joinedListHab);
            await assemblerType.joinAsset(this.$assets.getCollection ("types"), 'characteristic_id', 'habilitationtype');
            let joinedType = assemblerType.getResult();
            await this.findVeille(id);
            this.listHabPersoType = joinedType;
            this.listHabPersoType.forEach((habilitationPersonnel) => {
                 this.loadinfosCollecte(habilitationPersonnel.id);
            });
            this.pending.load = false;
            return joinedType
        
        },

        /**
         * recherche via une requete la liste des collectes réalisées en fonction de l'id de l'habilitation du personnel fourni
         * enregiste le résultat et l'id dans le tableau listControles
         * @param {number} id id de l'habilitation du personnel
         */

        async loadinfosCollecte(id) {
			this.pending.control = true;
			this.$app.apiGet('v2/collecte', {
                habilitation_id: id,
				kn2kn_info: 'OUI',
				retard_info: 'OUI',
				type: 'KN'
			})
			.then((data) => {
                let control = data
                let controles = {};
                controles.id = id;
                controles.control = control;
                this.listControles.push(controles);
			})
			.catch(this.$app.catchError).finally(() => this.pending.control = false);
		},

        /**
         * Retourne l'objet contenant les informations de la veille pour l'habilitation du personnel concerné
         * @param {number} habilitationId l'id de l'habilitation du personnel
         * @returns {object} veille l'objet content les information et notamment la date du dernier contrôle
         */
        getVeilleByHabilitationId(habilitationId) {
            return this.listVeille.find(e => e.habilitation_id == habilitationId)

        },
        /**
         * retourne un tableau contenant les collectes réalisées dans le cadre de l'habilition du personnel
         * @param {number} habilitationId l'id de l'habilitation du personnel
         * @returns {array} listes des controles coancenrant l'habilitation
         */
        getControlesByHabilitationId(habilitationId) {
            return this.listControles.find(e => e.id == habilitationId)

        },

    

    },

    /**
     * Lorsque la route interne est mise à jour, les nouvelles config
     * du type d'habilitation et de la veille sont chargées
     * 
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.typeHab.id) {
            this.findType(to.params.id);
            this.findHabilitationPersonnel(to.params.id)

        }
    },

    /**
     * charge les config du type d'habilitation et de la veille
     */
    mounted() {
        this.findType(this.$route.params.id);
        this.findHabilitationPersonnel(this.$route.params.id);

    },

    components: { AlertMessage, Spinner,  HabMonitorPersonnel, RouterView} //HabMonitor
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