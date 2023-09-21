<template>
    <div class="container">
        <!-- Titre "Suspensions" avec la couleur custom -->
        <h1 class="text-center text-custom p-2 mb-4">Suspensions</h1>
        <!-- Liste "Suspensions en cours" -->
        <div class="card bg-custom text-white shadow-lg col-md-12 mt-4" v-if="suspensions">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions en cours</h3>
                <div class="custom-div" v-for="suspension in getActiveSuspensions" :key="suspension.id">
                    <router-link :to="{ name: 'suspensionInfo', params: { idSuspension: suspension.id } }"
                        v-slot="{ href, navigate }" custom>
                        <a :href="href" @click="navigate" class="no-underline">
                            <div class="card card-hover d-flex rounded px-3 py-2 mb-3">
                                <div class="row text-center">
                                    <!-- Colonne pour le nom de l'habilitation -->
                                    <div class="col-md-6 text-md-end px-2">
                                        <span class="fw-bold">{{ getHabilitationTypeNom(suspension.habilitation_id)
                                        }}</span>
                                    </div>
                                    <!-- Colonne pour le nom du personnel -->
                                    <div class="col-md-4 text-md-start px-2">
                                        <p>{{ getPersonnelNom(suspension.habilitation_id) }}</p>
                                    </div>
                                    <!-- Colonne pour les dates, la durée et les commentaires -->
                                    <div class="col-md-12 p-2">
                                        <div class="card bg-light">
                                            <div class="card-body p-1">
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <span class="fw-bold">Dates:</span>
                                                        <p>{{ formatSuspensionText(suspension.dd, suspension.df) }}</p>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <span class="fw-bold">Durée:</span>
                                                        <p>{{ getSuspensionDuration(suspension.dd, suspension.df) }} jours
                                                        </p>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <span class="fw-bold">Commentaire:</span>
                                                        <p>{{ suspension.commentaire }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </router-link>
                </div>
            </div>
        </div>
        <Spinner v-else></Spinner>


        <!-- Liste "Suspensions levées ou terminées" -->
        <div class="card bg-secondary text-white shadow-lg col-md-12 mt-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions levées ou terminées</h3>
                <div class="custom-div" v-for="suspension in getInactiveSuspensions" :key="suspension.id">
                    <div class="card card-hover d-flex rounded px-3 py-2 mb-3">
                        <div class="row text-center">
                            <!-- Colonne pour le nom de l'habilitation -->
                            <div class="col-md-6 text-md-end px-2">
                                <span class="fw-bold">{{ getHabilitationTypeNom(suspension.habilitation_id) }}</span>
                            </div>
                            <!-- Colonne pour le nom du personnel -->
                            <div class="col-md-4 text-md-start px-2">
                                <p>{{ getPersonnelNom(suspension.habilitation_id) }}</p>
                            </div>
                            <!-- Colonne pour les dates, la durée et les commentaires -->
                            <div class="col-md-12 p-2">
                                <div class="card">
                                    <div class="card-body p-1">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <span class="fw-bold">Dates:</span>
                                                <p>{{ formatSuspensionText(suspension.dd, suspension.df) }}</p>
                                            </div>
                                            <div class="col-md-4">
                                                <span class="fw-bold">Durée:</span>
                                                <p>{{ getSuspensionDuration(suspension.dd, suspension.df) }} jours</p>
                                            </div>
                                            <div class="col-md-4">
                                                <span class="fw-bold">Commentaire:</span>
                                                <p>{{ suspension.commentaire }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card bg-overSuspensions text-white shadow-lg col-md-12 mt-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Suspensions supprimées (todo ajout booléen Supprimé en bdd)</h3>
                <div class="custom-div" v-for="suspension in getInactiveSuspensions" :key="suspension.id">
                    <div class="card card-hover d-flex rounded px-3 py-2 mb-3">
                        <div class="row text-center">
                            <!-- Colonne pour le nom de l'habilitation -->
                            <div class="col-md-6 text-md-end px-2">
                                <span class="fw-bold">{{ getHabilitationTypeNom(suspension.habilitation_id) }}</span>
                            </div>
                            <!-- Colonne pour le nom du personnel -->
                            <div class="col-md-4 text-md-start px-2">
                                <p>{{ getPersonnelNom(suspension.habilitation_id) }}</p>
                            </div>
                            <!-- Colonne pour les dates, la durée et les commentaires -->
                            <div class="col-md-12 p-2">
                                <div class="card">
                                    <div class="card-body p-1">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <span class="fw-bold">Dates:</span>
                                                <p>{{ formatSuspensionText(suspension.dd, suspension.df) }}</p>
                                            </div>
                                            <div class="col-md-4">
                                                <span class="fw-bold">Durée:</span>
                                                <p>{{ getSuspensionDuration(suspension.dd, suspension.df) }} jours</p>
                                            </div>
                                            <div class="col-md-4">
                                                <span class="fw-bold">Commentaire:</span>
                                                <p>{{ suspension.commentaire }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <RouterView></RouterView>
</template>

<script>
import { mapState } from 'vuex';
import Spinner from '@/components/pebble-ui/Spinner.vue';


export default {

    components: { Spinner, },

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
        * Retourne le nom du type d'habilitation en fonction de l'ID de l'habilitation.
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

    methods: {

        /**
        * Formate la date en utilisant les options de format.
        * @return {string} La date formatée en français.
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
        getPersonnelNom(habilitationId) {
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
        getSuspensionDuration(dd, df) {
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

/* Effet d'agrandissement et d'ombre au survol */
.card-hover:hover {
    transform: translate3D(0, -1px, 0) scale(1.02);
    /* Zoom in */
    box-shadow: 8px 10px 70px rgba(45, 39, 37, 0.173), 1px 6px 12px rgba(46, 37, 36, 0.184);
    transition: all .15s ease;
    cursor: pointer;
    background-color: #fceae4;
    border: #f78c6b51 solid 4px;
}

.card {
    border: 0;

}

.no-underline {
    text-decoration: none;
}
</style>
