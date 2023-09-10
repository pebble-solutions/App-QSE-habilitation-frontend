<template>
    <div class="container" v-if="isReady">
        <div class="card mt-2">
            <div class="card-body">
                <ControlTodoHabilitationItem :habilitation-personnel="habilitationPersonnel" :titre="true"></ControlTodoHabilitationItem>
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
            </div>
        </div>
    </div>
</template>

<script>

import ControlTodoHabilitationItem from '../../components/menuList/ControlTodoHabilitationItem.vue';
import { getDisplayFormatedDate } from '../../js/date'

export default {

    data() {
        return {
            collection: null,
            habilitationPersonnel: null
        };
    },

    computed: {
        /**
         * Retourne true si les données du composant sont prètes à être affichées
         *
         * @return {boolean}
         */
        isReady() {
            return this.collection && this.habilitationPersonnel ? true : false;
        },

        isExpire(){
            let diffDate = new Date(this.habilitationPersonnel.df).getTime() - new Date().getTime();
            if (diffDate > 0 ) return false
            else return true
        }
    },

    methods: {

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
    },

    components: { ControlTodoHabilitationItem }
}
</script>
