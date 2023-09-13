<template>

    <div v-if="echeancier" class="absolute-workspace bg-light">

        <div v-if="isPending" class="text-center my-4 fs-4 text-secondary">
            <span class="spinner-border"></span>
            Chargement...
        </div>
        <template v-else>
            <div v-if="echeancier.priorite == false">
    
                <div  v-for="habilitationType in filteredHabilitationsTypes" :key="habilitationType.id" class="my-3">
                    <HabilitationGroup
                        :operateurs="filteredOperateurs"
                        :habilitationType="habilitationType"
                        :habilitationsPersonnels="getHabilitationsPersonnelsByTypeId(habilitationType.id)"
                    />

                </div>
            </div>
    
            <template v-else>
                <PersonnelGroup 
                    :personnels="filteredOperateurs" 
                    :habilitationsTypes="filteredHabilitationsTypes"
                    :habilitationsPersonnel="habilitationsPersonnel"
                />
            </template>
        </template>
    </div>

    <div class="bg-white" v-else>
        <div>
			<img src="@/assets/Habilitations.png" alt="Pebble Dev" class="logo w-100">
		</div>
        <div class="card custom-app-color text-white">
            <h1>Regitre des habilitations</h1>
            <h3>Retrouver ici le registre de toutes les habilitations selon une liste du personnel et des habilitations. Vous pouvez classer, filtrer et affiner vos recherches grâce aux outils présents dans la liste de gauche!</h3>
        </div>
    </div>


  </template>

<style scoped>
.logo {
	max-width: 800px;
	display:block;
	margin: 100px auto;
	margin-left: 20px auto;
	margin-right: 20px auto;
}
.card {
    background-color: #f7f7f7;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px;
    
}

.card h1 {
    margin-bottom: 10px;
}

.card h3 {
    margin-top: 10px;
}
.custom-app-color {
    background-color: #F78C6B;
}
</style>

<script>

import HabilitationGroup from '../components/registre/HabilitationGroup.vue'
import PersonnelGroup from '../components/registre/PersonnelGroup.vue';
import { mapActions, mapState } from 'vuex';

export default {

    data() {
		return {
            allHabilitationsTypes: [],
            allOperateurs: [],
            habilitationsPersonnel: [],
            pending: {
                habilitationsTypes: false,
                habilitationsPersonnel: false,
                personnels: false,
            }
		}
	},

    components: {HabilitationGroup, PersonnelGroup},

    watch:{
        /**
         * Ecoute la varible echeancier dans le store 
         * et fais les appels necessaire au methodes de recuperation de données 
         * lors du changement de celle-ci
         */
        echeancier:{
            handler(newValue){
                if(newValue.dd && newValue.df){
                    this.getHabilitationsPersonnel();
                }
            },
            deep:true,
        }
    },

    computed:{
        ...mapState(['echeancier']),

        /**
         * Retourne la liste des Hailitations filtrées avec la recherche 
         * 
         * @returns {array}
         */
        filteredHabilitationsTypes() {
            if(this.echeancier.habilitation.length == 0 || (this.echeancier.habilitation.length == 1 && this.echeancier.habilitation.includes(''))) {
                return this.allHabilitationsTypes;
            } else {
                return this.allHabilitationsTypes.filter(item => this.echeancier.habilitation.includes(item.id));
            }
        },

        /**
         * Retourne la liste des opérateurs triés en fonction des filtre selectionnés
         * 
         * @returns {array}
         */
        filteredOperateurs() {
            if(this.echeancier.operateurs?.length == 0 || (this.echeancier.operateurs?.length == 1 && this.echeancier.operateurs?.includes(''))) {
                return this.allOperateurs
            } else {
                return this.allOperateurs.filter(item => this.echeancier.operateurs?.includes(item.id))
            }
        },

        /**
         * Retourne true si un chargement est en cours
         * 
         * @return {bool}
         */
        isPending() {
            return ( this.pending.personnelsFiltered || this.pending.habilitationsPersonnel) ? true : false;
        }
    },

    methods: {
        ...mapActions(['setEcheance']),

        /**
         * Charge les données des habilitations
         */
        async getAllHabilitations() {
            return this.loadCollection({
                pending: "habilitationsTypes",
                name: "habilitationsTypes",
                payload: {
                    limit: "aucune"
                },
                outputData: "allHabilitationsTypes"
            });
        },

        /**
         * Chargue une collection de données
         * 
         * @param {object} collectionConfig 
         * - pending         Clé pending à utiliser pendant le chargement
         * - name            Nom de la collection
         * - payload         Payload à envoyer sur la requête
         * - outputData      Clé dans data sur laquelle stocker une référence vers les données
         * 
         * @return {Promise}
         */
        async loadCollection(collectionConfig) {
            const pending = collectionConfig.pending;
            const name = collectionConfig.name;
            const payload = collectionConfig.payload;
            const outputData = collectionConfig.outputData;

            this.pending[pending] = true;

            const collection = this.$assets.getCollection(name);

            try {
                await collection.load(payload);

                if (outputData) {
                    this[outputData] = collection.getCollection();
                }
            } catch (e) {
                this.$app.catchError(e);
            } finally {
                this.pending[pending] = false;
            }
        },

        /**
         * Récupère la liste des habilitations du personnel sur le serveur
         */
        getHabilitationsPersonnel() {
            if (this.echeancier) {
                this.pending.habilitationsPersonnel = true;
                this.habilitationsPersonnel = this.$assets.getCollection("habilitationsPersonnels").getCollection();
                this.pending.habilitationsPersonnel = false;
            }
        },

        /**
         * Retourne la liste des habilitations du personnel pour un type donné
         * 
         * @param {number} habilitationTypeId ID du type en référence
         * 
         * @return {array}
         */
        getHabilitationsPersonnelsByTypeId(habilitationTypeId) {
            return this.habilitationsPersonnel.filter(e => e.characteristic_id == habilitationTypeId);
        },

        /**
         * Charge tous les operateurs
         */
        getAllOperateurs() {
            return this.loadCollection({
                pending: "personnelsFiltered",
                name: "personnelsFiltered",
                payload: {
                    limit: "aucune"
                },
                outputData: "allOperateurs"
            });
        },

    },

    unmounted() {
        this.setEcheance(null)
    },

    mounted() {
        this.setEcheance(null)
        this.getAllHabilitations();
        this.getAllOperateurs();
    }
}

</script>


