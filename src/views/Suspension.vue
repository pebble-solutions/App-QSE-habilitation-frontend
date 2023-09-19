<template>
    <div>
        <!-- Titre "Suspensions" avec la couleur de bg-custom -->
        <h1 class="text-center text-custom p-2 mb-4">Suspensions</h1>
        <!-- Liste "Suspensions en cours" -->
        <div class="card bg-custom text-white shadow-lg col-md-12 mt-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions en cours</h3>
                <div class="custom-div" v-for="suspension in getActiveSuspensions" :key="suspension.id">
                    <div class="card card-hover d-flex justify-content-between align-items-center rounded px-3 py-2 mb-3">
                        <span class="fw-bold">{{ getHabilitationTypeNom(suspension.habilitation_id) }} <span class="text-secondary">#{{ suspension.habilitation_id }}</span></span>
                        <span>{{ formatDate(suspension.dd) }}</span>
    <span>{{ formatDate(suspension.df) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Liste "Suspensions levées ou terminées" -->
        <div class="card bg-custom text-white shadow-lg col-md-12 mt-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions levées ou terminées</h3>
                <div class="custom-div" v-for="suspension in getInactiveSuspensions" :key="suspension.id">
                    <div class="card card-hover d-flex justify-content-between align-items-center rounded px-3 py-2 mb-2">
                        <span class="fw-bold">{{ getHabilitationTypeNom(suspension.habilitation_id) }} <span class="text-secondary">#{{ suspension.habilitation_id }}</span></span>
                        <span>{{ formatDate(suspension.dd) }}</span>
    <span>{{ formatDate(suspension.df) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            pending: {
                agent: false,
            },
            habilitationFromPerso: '',
            listControlDone: '',
                   
        };
    },

    methods: {

    },

    computed: {

        ...mapState(['suspensions', 'personnels', 'habilitations', 'types',]),

         /**
     * Formate la date en utilisant les options de format.
     * @param {string} date - La date à formater.
     * @return {string} La date formatée en français.
     */
    formatDate() {
        return date => {
            if (date) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(date).toLocaleDateString('fr-FR', options);
            }
            return '';
        };
    },

         /**
     * Retourne le nom du type d'habilitation en fonction de l'ID de l'habilitation.
     * @param {number} habilitationId - L'ID de l'habilitation.
     * @return {string} Le nom du type d'habilitation.
     */
    getHabilitationTypeNom() {
        return habilitationId => {
            const habilitation = this.habilitations.find(hab => hab.id === habilitationId);
            if (habilitation) {
                const type = this.types.find(type => type.id === habilitation.habilitation_type_id);
                return type ? type.nom : '';
            }
            return '';
        };
    },

       /**
         * Retourne les suspensions en cours (date df est null ou supérieure à la date du jour).
         * @return {Array} Les suspensions en cours.
         */
         getActiveSuspensions() {
            const today = new Date();
            return this.suspensions.filter(suspension => !suspension.df || new Date(suspension.df) >= today);
        },

        /**
         * Retourne les suspensions levées ou terminées (date df est antérieure à la date du jour).
         * @return {Array} Les suspensions levées ou terminées.
         */
        getInactiveSuspensions() {
            const today = new Date();
            return this.suspensions.filter(suspension => suspension.df && new Date(suspension.df) < today);
        },

        getAllSuspensions() {
            return this.suspensions;
        },
    },

    async mounted() {
        const suspensionCollection = this.$assets.getCollection('suspensions');
        await suspensionCollection.load();

    },

    
}
</script>
<style scoped>

.bg-custom {
    background-color: #f78c6b9a;
}

.text-custom {
    color: #f78c6b;
}

/* Effet d'agrandissement et d'ombre au survol */
.card-hover:hover {
    transform: translate3D(0,-1px,0) scale(1.025); /* Zoom in */
    box-shadow: 8px 28px 50px rgba(39,44,49,.07), 1px 6px 12px rgba(39,44,49,.04);
    transition: all .4s ease;
    cursor: pointer;
    background-color: #fadcd1;
}.card {
    border: 0;

}
</style>
