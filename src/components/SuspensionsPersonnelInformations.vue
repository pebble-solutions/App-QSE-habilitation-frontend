<template>
    <div class="row row px-3 mt-4" v-if="habilitationPersonnel.length > 0">
        <div class="card col-md-6 mb-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Habilitations en cours</h3>
                <ul class="custom-ul">
                    <li class="d-flex justify-content-between align-items-center bg-primary rounded text-white px-3 py-2 mb-2"
                        v-for="hab in getNonSuspendedHabilitations()" :key="hab.id">
                        {{ getHabilitationTypeName(hab.habilitation_type_id) }}
                    </li>
                </ul>
                <p v-if="getNonSuspendedHabilitations().length === 0" class="text-center text-secondary">Aucune autre habilitation</p>
            </div>
        </div>
        <div class="card col-md-6 mb-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Habilitations suspendues</h3>
                <ul class="custom-ul">
                    <li class="d-flex justify-content-between align-items-center bg-danger rounded text-white px-3 py-2 mb-2"
                        v-for="hab in getSuspendedHabilitations()" :key="hab.id">
                        <span>{{ getHabilitationTypeName(hab.habilitation_type_id) }}</span>
                        <span>le {{ changeFormatDateLit(getSuspensionDate(hab.id)) }}</span>
                    </li>
                </ul>
                <p v-if="getSuspendedHabilitations().length === 0" class="text-center text-secondary">Aucune suspensions</p>
            </div>
        </div>
    </div>
    <div class="text-center text-secondary" v-else>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import {getDisplayFormatedDate} from '../js/date';

export default {

    data() {
        return {
            pending: {
                agent: false,
            },
            listControlDone: '',
            suspensions : null
        };
    },
    watch:{
        $route(){
            const suspensionCollection = this.$assets.getCollection('suspensions');
            suspensionCollection.load(); 
            this.suspensions = suspensionCollection.getCollection()
        }
    },

    computed: {
        ...mapState(['habilitationType', 'personnelsFiltered', 'personnels', 'habilitations', 'types',]),

        /**
         * Retourne l'objet personnel correspondant à l'ID de l'URL.
         * @return {Object} L'objet personnel correspondant à l'ID.
         */
        personnel() {
            return this.personnels.find(el => el.id == this.$route.params.id);
        },

        /**
         * Retourne les habilitations associées à ce personnel.
         * @return {Array} Les habilitations du personnel.
         */
        habilitationPersonnel() {
            return this.habilitations.filter(el => el.personnel_id == this.$route.params.id);
        }

    },

    methods: {

        /**
        * Modifie le format de la date entrée en paramètre et la retourne sous le format "01 févr. 2021".
        *
        * @param {string} date - La date au format initial.
        * @returns {string} La date au format "01 févr. 2021" ou une chaîne vide si la date est invalide.
        */
        changeFormatDateLit(date) {
            return getDisplayFormatedDate(date)
        },

        /**
         * Retourne les habilitations non suspendues du personnel.
         *
         * @return {Array} Les habilitations non suspendues du personnel.
         */
        getNonSuspendedHabilitations() {
            const suspendedHabilitation = this.suspensions?.filter((suspension) => {
                if (new Date(suspension.df) > new Date()) {
                    return true;
                } else {
                    return false;
                }
            })

            return this.habilitationPersonnel.filter((hab) => {
                return !suspendedHabilitation?.find((e) => e.habilitation_id == hab.id);
            });
        },

        /**
         * Retourne les habilitations suspendues du personnel.
         * 
         * @return {Array} Les habilitations suspendues du personnel.
         */
        getSuspendedHabilitations() {
            return this.habilitationPersonnel.filter(hab => {
                // Vérifier si une suspension est trouvée et que la date df est nulle ou dans le futur
                if (this.suspensions && this.suspensions.length > 0) {
                    for (const suspension of this.suspensions) {
                        if (suspension.habilitation_id === hab.id) {
                            if (suspension.df === null || new Date(suspension.df) > new Date()) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });
        },  


          /**
         * Retourne le nom du type d'habilitation.
         * @param {number} habilitationTypeId - L'ID du tysuspensionspe d'habilitation.
         * @return {string} Le nom du type d'habilitation.
         */
        getHabilitationTypeName(habilitationTypeId) {
            const habilitationType = this.types.find(type => type.id === habilitationTypeId);
            return habilitationType ? habilitationType.nom : '';
        },

        /**
         * Retourne la date de suspension au format localisé.
         * @param {number} habilitationId - L'ID de l'habilitation.
         * @return {string} La date de suspension au format localisé.
         */
        getSuspensionDate(habilitationId) {
            const suspension = this.suspensions.find(sus => sus.habilitation_id === habilitationId);
            return suspension ? suspension.dd : '';
        },

        /**
        * Retourne le nom de l'habilitation en fonction de son ID.
        *
        * @param {number} id - L'ID de l'habilitation.
        *
        * @returns {string} Le nom de l'habilitation correspondant à l'ID.
        */
        returnNameHab(id) {
            // Recherche l'habilitation correspondant à l'ID dans le tableau habilitationType
            let hab = this.habilitationType.find((e) => e.id == id);

            // Retourne le nom de l'habilitation si trouvé, sinon une chaîne vide.
            return hab ? hab.nom : '';
        },

        loadSuspensions(){
            const suspensionCollection = this.$assets.getCollection('suspensions');
            suspensionCollection.load(); 
            this.suspensions = suspensionCollection.getCollection()
        },
    },

    mounted(){
        this.loadSuspensions();
    }
};

</script>

<style scoped>
.custom-ul {
    padding-left: 0;
    list-style: none;
}

.bg-custom {
    background-color: #f78c6b9a;
}
</style>
