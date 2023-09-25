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
                        <span>le {{ getSuspensionDate(hab.id) }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="text-center text-secondary" v-else>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import datejs from 'date.js';

export default {

    data() {
        return {
            pending: {
                agent: false,
            },
            listControlDone: ''
        };
    },
    computed: {
        ...mapState(['habilitationType', 'personnelsFiltered', 'suspensions', 'personnels', 'habilitations', 'types',]),

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
        },

        /**
         * Retourne les suspensions associées aux habilitations du personnel.
         * @return {Array} Les suspensions du personnel.
         */
        suspensionsPersonnel() {
            return this.habilitationPersonnel.reduce((suspensions, hab) => {
                const suspension = this.suspensions.find(el => el.habilitation_id === hab.id);
                if (suspension) {
                    suspensions.push(suspension);
                }
                return suspensions;
            }, []);
        },


        /**
        * Modifie le format de la date entrée en paramètre et la retourne sous le format "01 févr. 2021".
        *
        * @param {string} date - La date au format initial.
        * @returns {string} La date au format "01 févr. 2021" ou une chaîne vide si la date est invalide.
        */
        changeFormatDateLit(date) {
            if (date) {
                // Utilisez les fonctions de date.js pour formater la date.
                const formattedDate = datejs(date).format('DD MMM. YYYY');
                return formattedDate;
            }
            return '';
        },

    },

    methods: {


        /**
         * Retourne les habilitations non suspendues du personnel.
         * @return {Array} Les habilitations non suspendues du personnel.
         * 
         */
        getNonSuspendedHabilitations() {
            const currentDate = new Date(); // Obtenir la date actuelle
            return this.habilitationPersonnel.filter(hab => {
                const suspensionsForThisHab = this.suspensionsPersonnel.filter(sus => sus.habilitation_id === hab.id);
                return suspensionsForThisHab.every(sus => sus.df === null || new Date(sus.df) <= currentDate);
            });
        },

        /**
         * Retourne les habilitations suspendues du personnel.
         * 
         * @return {Array} Les habilitations suspendues du personnel.
         */
        getSuspendedHabilitations() {
            const currentDate = new Date(); // Obtenir la date actuelle
            return this.habilitationPersonnel.filter(hab => {
            const suspensionsForThisHab = this.suspensionsPersonnel.filter(sus => sus.habilitation_id === hab.id);
            return suspensionsForThisHab.some(sus => sus.df === null || new Date(sus.df) > currentDate);
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