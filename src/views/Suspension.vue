<template>
    <div class="container">
        <h1 class="text-center text-custom p-2 mb-4">Suspensions</h1>

        <!-- Liste "Suspensions en cours" -->
        <div class="card border-0 bg-custom text-white shadow-lg col-md-12 mt-4" v-if="suspensions && getActiveSuspensions.length > 0">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions en cours</h3>
                <div class="custom-div" v-for="suspension in getActiveSuspensions" :key="suspension.id">
                    <router-link :to="{ name: 'suspensionInfo', params: { idSuspension: suspension.id } }"
                        v-slot="{ href, navigate }" custom>
                        <a :href="href" @click="navigate" class="no-underline">
                            <SuspensionCard :habilitationTypeName="habilitationTypeName(suspension.habilitation_id)"
                                :personnelName="personnelName(suspension.habilitation_id)"
                                :formattedDates="formatSuspensionText(suspension.dd, suspension.df)"
                                :suspensionDuration="suspensionDuration(suspension.dd, suspension.df)"
                                :commentaire="suspension.commentaire" />
                        </a>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center text-success">Aucune suspension en cours <i class="bi bi-check"></i></p>
        </div>


        <!-- Liste "Suspensions levées ou terminées" -->
        <div class="card border-0 bg-secondary text-white shadow-lg col-md-12 mt-4"  v-if="suspensions && getInactiveSuspensions.length > 0">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions levées ou terminées</h3>
                <div class="custom-div" v-for="suspension in getInactiveSuspensions" :key="suspension.id">
                        <SuspensionCard :habilitationTypeName="habilitationTypeName(suspension.habilitation_id)"
                            :personnelName="personnelName(suspension.habilitation_id)"
                            :formattedDates="formatSuspensionText(suspension.dd, suspension.df)"
                            :suspensionDuration="suspensionDuration(suspension.dd, suspension.df)"
                            :commentaire="suspension.commentaire" />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center text-secondary my-4">Aucune suspension levée ou terminée.</p>
        </div>
    </div>

    <RouterView></RouterView>
</template>

<script>
import { mapState } from 'vuex';
import SuspensionCard from '@/components/SuspensionCard.vue';


export default {

    components: { SuspensionCard },

    data() {
        return {
            pending: {
                agent: false,
            },
            habilitationFromPerso: '',
            listControlDone: '',

        };
    },

    computed: {

        ...mapState(['suspensions', 'personnels', 'habilitations', 'types',]),

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

        /**
         * Retourne toutes les suspensions.
         * @return {Array} Toutes les suspensions.
         */
        getAllSuspensions() {
            return this.suspensions;
        },
    },

    async mounted() {
        const suspensionCollection = this.$assets.getCollection('suspensions');
        await suspensionCollection.load();

    },

    methods: {

        /**
        * Retourne le nom du type d'habilitation en fonction de l'ID de l'habilitation.
        * @param {number} habilitationId - L'ID de l'habilitation.
        * @return {string} Le nom du type d'habilitation.
        */
        habilitationTypeName(habilitationId) {
            const habilitation = this.habilitations.find(hab => hab.id === habilitationId);
            if (habilitation) {
                const type = this.types.find(type => type.id === habilitation.habilitation_type_id);
                return type ? type.nom : '';
            }
            return '';
        },

        /**
         * Retourne la date au format localisé.
         * @param {string} date - La date à formater.
         * 
         * @return {string} La date au format localisé.
         */
        formatDate(date) {
            if (date) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(date).toLocaleDateString('fr-FR', options);
            }
            return '';
        },

        /**
         * Formate le texte pour l'affichage de la suspension.
         * @param {string} dd - La date de début.
         * @param {string} df - La date de fin.
         * @return {string} Le texte formaté.
         */
        formatSuspensionText(dd, df) {
            if (!df) {
                return 'suspendu le ' + this.formatDate(dd);
            } else if (dd && df) {
                const formattedDD = this.formatDate(dd);
                const formattedDF = this.formatDate(df);
                return `suspendu du ${formattedDD} au ${formattedDF}`;
            }
            return ''; // Vous pouvez ajuster ce cas selon vos besoins.
        },

        /**
         * Retourne le nom du personnel dont l'ID correspond à habilitation.personnel.id.
         * @param {number} habilitationId - L'ID de l'habilitation.
         * @return {string} Le nom du personnel.
         */
        personnelName(habilitationId) {
            const habilitation = this.habilitations.find(hab => hab.id === habilitationId);
            if (habilitation && habilitation.personnel_id) {
                const personnel = this.personnels.find(personnel => personnel.id === habilitation.personnel_id);
                if (personnel && personnel.cache_nom) {
                    return personnel.cache_nom;
                }
            }
            return ''; // Retourne une chaîne vide si aucune correspondance n'est trouvée.
        },

        /**
        * Calcule la durée de la suspension en jours.
        * 
        * @param {string} dd - La date de début.
        * @param {string} df - La date de fin.
        * 
        * @return {number} La durée en jours.
        */
        suspensionDuration(dd, df) {
            if (dd && df) {
                const start = new Date(dd);
                const end = new Date(df);
                const timeDifference = end - start;
                const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                return daysDifference;
            }
            return 0; // Si les dates sont absentes ou incorrectes, la durée est de 0 jours.
        },
    },
}
</script>

<style scoped>
.bg-custom {
    background-color: #f78c6b9a;
}

.bg-overSuspensions {
    background-color: #f76b939a;
}

.text-custom {
    color: #f78c6b;
}

.no-underline {
    text-decoration: none;
}
</style>
