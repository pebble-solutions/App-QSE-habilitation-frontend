<template>
    <div class="container" v-if="isReady">
        <div class="card mt-2">
            <div class="card-body">
                <ControlTodoHabilitationItem :habilitation-personnel="habilitationPersonnel" :suspensions="suspensions" :titre="true"></ControlTodoHabilitationItem>
            </div>
        </div>
        <div class="card mt-2">
            <div class="card-body d-flex align-items-center justify-content-between" v-if="isExpire">
                <span>
                    <strong>A expiré le : </strong>
                    {{ dateFormat(habilitationPersonnel.df) }}
                </span>

                <div class="text-end">
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-arrow-clockwise" ></i>
                        <span class="d-none d-md-inline ms-1">
                            Renouveler
                        </span>
                    </button>
                </div>
            </div>
            <div class="card-body" v-else>
                <span>
                    <strong>Date de debut : </strong>
                    {{ dateFormat(habilitationPersonnel.dd) }}
                </span>
                <br/>
                <span>
                    <strong>Expire le : </strong>
                    {{ dateFormat(habilitationPersonnel.df) }}
                </span>

                <router-link :to="{ name: 'editSuspensionHabilitationPersonnel', params: { idSuspension: idSuspension } }" 
                v-slot="{ href, navigate }" v-if="isSuspension()">
                    <a :href="href" @click="navigate" class="btn btn-sm butn-custom-stats text-white position-absolute end-0 mb-1 me-2">
                        <span>Lever la suspension</span>
                        <i class="bi bi-arrow-up-right-square ms-2"></i>
                    </a>
                </router-link>

                <router-link :to="{ name: 'createSuspensionHabilitationPersonnel', params: { idPersonnel: habilitationPersonnel.personnel_id }}"
                v-slot="{ href, navigate }" custom v-else>
                    <a :href="href" @click="navigate" class="btn btn-sm butn-custom-stats text-white position-absolute end-0 mb-1 me-2">
                        <span>Suspendre</span>
                        <i class="bi bi-arrow-up-right-square ms-2"></i>
                    </a>
                </router-link>
                <RouterView></RouterView>

            </div>
        </div>
    </div>
</template>

<style scoped>

.butn-custom-stats {
	background-color: #f78c6b;

}

.butn-custom-stats:hover {
	background-color: #dc6e4c;
	/* Couleur foncée pour l'overlay */
	transform: scale(1.1);
}

.btn:hover {
	opacity: 1;
	visibility: visible;
}

</style>

<script>

import ControlTodoHabilitationItem from '../../components/menuList/ControlTodoHabilitationItem.vue';
import { getDisplayFormatedDate } from '../../js/date'

export default {

    data() {
        return {
            collection: null,
            habilitationPersonnel: null,
            idSuspension: null,
            suspensions : null
        };
    },

    computed: {
        /**
         * Retourne true si les données du composant sont prètes à être affichées
         *
         * @return {boolean}
         */
        isReady() {
            return this.collection && this.habilitationPersonnel && this.suspensions ? true : false;
        },

        isExpire(){
            let diffDate = new Date(this.habilitationPersonnel.df).getTime() - new Date().getTime();
            if (diffDate > 0 ) return false
            else return true
        }
    },

    methods: {

        /**
         * Vérifie si une suspension est trouvée et que la date df est nulle ou dans le futur pour l'habilitation actuelle du personnel.
         *
         * @returns {boolean} Renvoie vrai si une suspension correspondante est trouvée et que la date df est nulle ou dans le futur, sinon renvoie faux.
         */
        isSuspension() {
            if (this.suspensions) {
                const suspensionFound = this.suspensions.some((suspension) => {
                if (
                    suspension.habilitation_id === this.habilitationPersonnel.id &&
                    (suspension.df === null || new Date(suspension.df) > new Date())
                ) {
                    this.idSuspension = suspension.id; // Stocke l'ID de la suspension correspondante
                    return true; // Afficher la bordure rouge
                }
                return false;
                });

                return suspensionFound; // Renvoie vrai si une suspension correspondante a été trouvée, sinon renvoie faux
            }

            return false; // Si la collection de suspensions n'existe pas, renvoie faux
        },

        loadSuspensions(){
            const suspensionCollection = this.$assets.getCollection('suspensions');
            suspensionCollection.load(); 
            this.suspensions = suspensionCollection.getCollection();
        },

        /**
         * Récupère l'habilitation personnel dans data
         *
         * @param {number} id ID de l'habilitation personnel à cibler
         */
        async getHabilitationPersonnel(id) {
            id = typeof id !== "undefined" ? id : this.$route.params.id;
            try {
                this.habilitationPersonnel = await this.collection.getById(id);
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },

        /**
         * Retourne la date au format 01 fev. 2023
         * 
         * @param {string} date 
         * 
         * @return {string} date formatée
         */
         dateFormat(date) {
            return getDisplayFormatedDate(date)
        }

    },

    beforeRouteUpdate(to) {
        this.getHabilitationPersonnel(to.params.id);
    },

    mounted() {
        this.collection = this.$assets.getCollection("habilitationsPersonnels");
        this.getHabilitationPersonnel();
        this.loadSuspensions();
    },

    components: { ControlTodoHabilitationItem }
}
</script>
