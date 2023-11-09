<template>
    <template v-if="isReady">
        <last-control-filter-form 
        :change="change" @modif-change="setChange($event)"/>

        <div v-if="!pending.habilitationPersonnel && change">
            <template v-for="habilitationPersonnel in habilittionWithPersonnel" :key="habilitationPersonnel.id">
                <app-menu-item :href="'/habilitationPersonnel/' + habilitationPersonnel.id">
                    <control-todo-habilitation-item :habilitationPersonnel="habilitationPersonnel" :suspensions="suspensions" :titre="false"/>
                </app-menu-item>
            </template>
        </div>

        <div class="alert alert-light mx-1 my-2" v-if="noResults">
            <i class="bi bi-file-x"></i> Aucun résultat, tentez d'étendre votre recherche
        </div>

        <div class="d-grid my-2" v-if="pending.habilitationsPersonnels || isMoreAvailable">
            <button class="btn btn-outline-secondary" :disabled="pending.habilitationsPersonnels"
                @click.prevent="loadMore()">
                <span v-if="pending.habilitationsPersonnels && !change"><span class="spinner-border spinner-border-sm"></span>
                    Chargement...</span>
                <span v-else>Charger +</span>
            </button>
        </div>
    </template>
</template> 

<script>
import { mapState } from 'vuex';
import AppMenuItem from '../pebble-ui/AppMenuItem.vue';
import ControlTodoHabilitationItem from './ControlTodoHabilitationItem.vue';
import LastControlFilterForm from "./LastControlFilterForm.vue";

export default {
    data() {
        return {
            collection: null,
            noMoreAvailable: false,
            change: null,
            personnels : null,
            suspensions : null
        }
    },

    computed: {
        ...mapState(['pending']),

        /**
         * Contrôle si il peut exister plus de résultats sur le serveurs que
         * de données stockées dans résults.
         *
         * On considère qu'il peut exister des résultats supplémentaires sur le serveur
         * à partir du moment ou il y a plus de 50 items dans result et que result / 50 est
         * égal à 1.
         *
         * @return {bool}
         */
        isMoreAvailable() {
            let ln = this.collection.getCollection().length;
            return (ln && ln % this.collection.requestPayload?.limit === 0 && !this.noMoreAvailable);
        },

        /**
         * Retourne true lorsque la vue est prête à être affichée
         * 
         * @return {bool}
         */
        isReady() {
            return this.collection ? true : false;
        },

        /**
         * Retourne true lorsqu'il n'y a pas de résultats
         * 
         * @return {boolean}
         */
        noResults() {
            return !this.pending.habilitationsPersonnels && !this.collection?.getCollection().length ? true : false;
        },

        /**
         * Retourne un tableau d'habilitationPersonnel en fonction de la liste de personnel selectionée
         *
         * @returns {Array}
         */
        habilittionWithPersonnel() {
            if (this.collection && this.personnels) {
                const personnelIds = new Set(this.personnels.getCollection().map(personnel => personnel.id));
                return this.collection.getCollection().filter(habilitation => personnelIds.has(habilitation.personnel_id));
            }
            return [];
        },
    },

    methods: {
        /**
         * Charger plus de resultats
         */
        async loadMore() {
            const start = this.collection.requestPayload.start ? this.collection.requestPayload.start + this.collection.requestPayload.limit : this.collection.requestPayload.limit ;
            this.collection.requestPayload.start = start;
            try {
                const data = await this.collection.load();
                if (!data.length) this.noMoreAvailable = true;
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },

        /**
         * Modifie la collection d'habilitationPersonnel
         * 
         * @param {Array} payload Tableau d'habilitationPersonnel
         */
        setChange(payload){
            this.collection.reset();
            this.collection.updateCollection(payload);

            this.personnels = this.$assets.getCollection("personnelsFiltered");

            this.change = true;
            this.pending.habilitationsPersonnels = false;
        },

        loadSuspensions(){
            const suspensionCollection = this.$assets.getCollection('suspensions');
            suspensionCollection.load(); 
            this.suspensions = suspensionCollection.getCollection()
        },
    },

    async mounted() {
        this.personnels = await this.$assets.getCollection("personnelsFiltered");
        this.collection = await this.$assets.getCollection("habilitationsPersonnels");
        this.loadSuspensions();
        this.change = false;
    },

    components: { LastControlFilterForm, AppMenuItem, ControlTodoHabilitationItem }
}

</script>  