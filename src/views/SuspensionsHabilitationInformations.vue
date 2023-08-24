<template>
    <div class="container py-2">
        <div class="card bg-custom mt-4">
            <div class="card-body">
                <h3 class="card-title text-center text-white mb-3">Personnel suspendu :</h3>
                <div>
                    <p class="text-center text-secondary" v-if="isNoSuspendedPersonnel">Aucun personnel suspendu pour cette habilitation.</p>
                    <ul v-else class="custom-ul">
                        <li v-for="(suspension, index) in getSuspensions" :key="index">
                            <div class="d-flex justify-content-between align-items-center bg-secondary rounded text-white px-3 py-2 mb-2 text-center text-white">
                                {{ getPersonnelName(suspension) }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * @typedef {Object} Suspension
 * @property {number} habilitation_id - L'ID de l'habilitation.
 */

/**
 * @typedef {Object} Personnel
 * @property {number} id - L'ID du personnel.
 * @property {string} cache_nom - Le nom du personnel.
 */

/**
 * @typedef {Object} Habilitation
 * @property {number} id - L'ID de l'habilitation.
 * @property {number} personnel_id - L'ID du personnel associé.
 */

export default {
    computed: {
        ...mapState(['suspensions', 'personnels', 'habilitations']),

        /**
         * Récupère le nom du personnel associé à la suspension.
         * @param {Suspension} suspension - La suspension en cours.
         * @returns {string} Le nom du personnel ou une chaîne vide.
         */
        getPersonnelName() {
            return suspension => {
                const habilitation = this.habilitations.find(hab => hab.id === suspension.habilitation_id);
                if (habilitation && habilitation.id === parseInt(this.$route.params.id)) {
                    const personnel = this.personnels.find(personnel => personnel.id === habilitation.personnel_id);
                    return personnel ? personnel.cache_nom : '';
                }
                return '';
            };
        },

        /**
         * Récupère la liste des suspensions pour l'habilitation en cours.
         * @returns {Suspension[]} La liste des suspensions.
         */
        getSuspensions() {
            return this.habilitations.reduce((suspensions, hab) => {
                const suspension = this.suspensions.find(el => el.habilitation_id === hab.id);
                if (suspension) {
                    suspensions.push(suspension);
                }
                return suspensions;
            }, []);
        },

        /**
         * Vérifie s'il n'y a aucun personnel suspendu pour l'habilitation en cours.
         * @returns {boolean} True si aucun personnel suspendu, sinon False.
         */
        isNoSuspendedPersonnel() {
            const currentHabilitationId = parseInt(this.$route.params.id);
            const suspendedHabilitations = this.getSuspensions.map(suspension => suspension.habilitation_id);

            return suspendedHabilitations.length === 0 || suspendedHabilitations.every(id => id !== currentHabilitationId);
        },
    },
   
};
</script>

<style scoped>
.custom-ul {
    padding-left: 0;
    list-style: none;
    display: contents;
}

.bg-custom {
    background-color: #f78c6b9a;
}
</style>