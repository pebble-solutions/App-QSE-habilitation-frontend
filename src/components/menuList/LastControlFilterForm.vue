<template>
    <form method="get" @submit.prevent="filter()" class="m-1">
        <div class="input-group">
            <select name="timeSelected" id="timeSelected" class="form-select"
                v-model="requestPayload.timeSelected">
                <option v-for="option in selectTimeOptions" :key="option.value" :value="option.value">{{ option.label }}
                </option>
            </select>
            <button class="btn btn-primary" type="button" :disabled="pending.habilitationsPersonnels"
                @click="changeFilterForm">
                <span class="spinner-border spinner-border-sm" v-if="pending.habilitationsPersonnels"></span>
                <i class="bi bi-funnel" v-else></i>
            </button>
            <button class="btn btn-primary" type="submit" :disabled="pending.habilitationsPersonnels">
                <span class="spinner-border spinner-border-sm" v-if="pending.habilitationsPersonnels"></span>
                <i class="bi bi-search" v-else></i>
            </button>
        </div>
        <!-- <div>
            <ControlForm v-if="showFilterForm" @formSubmitted="recieveForm" :habilitationsTypes="habilitationsTypes"></ControlForm>
        </div> -->
    </form>
</template>

<script>
import { mapState } from 'vuex';
import ControlForm from './ControlForm.vue';

export default {

    data() {
        return {
            selectTimeOptions: [
                { value: 0, label: "Tous" },
                { value: 7, label: "1 semaine" },
                { value: 30, label: "1 mois" },
                { value: 91, label: "3 mois" },
                { value: 183, label: "6 mois" }
            ],
            requestPayload: {
                timeSelected: 91
            },
            showFilterForm: false,
            additionalParams: [],
        }
    },

    computed: {
        ...mapState(['pending', 'habilitationsTypes']),
    },
    components: { ControlForm },
    methods: {
        /**
         * Lance la recherche
         */
        async filter() {
            const collection = this.$assets.getCollection("habilitationsPersonnels");

            // const habilitationsPersonnelsFilteredCollection = new AssetsCollection(this, {
			// 	assetName: 'habilitationsPersonnels',
			// 	apiRoute: 'v2/characteristic/personnel',
			// 	requestPayload : {
			// 		last_control: 1,
			// 		limit: "aucune",
			// 	}
			// });

            const sortedCollection = collection.getCollection().sort((a, b) => {
            const AdaysUntilRenewal = Math.trunc((new Date(a.df) - new Date()) / (1000 * 3600 * 24));
            const BdaysUntilRenewal = Math.trunc((new Date(b.df) - new Date()) / (1000 * 3600 * 24));

            // if (AdaysUntilRenewal < this.requestPayload.timeSelected && BdaysUntilRenewal >= this.requestPayload.timeSelected) {
            //     return -1;
            // }
            // if (AdaysUntilRenewal >= this.requestPayload.timeSelected && BdaysUntilRenewal < this.requestPayload.timeSelected) {
            //     return 1;
            // }
            // // Si AdaysUntilRenewal et BdaysUntilRenewal sont égaux, ils restent dans le même ordre.
            // return 0;


            if (AdaysUntilRenewal < BdaysUntilRenewal) {
                return -1;
            }
            if (AdaysUntilRenewal > BdaysUntilRenewal) {
                return 1;
            }
            // Si AdaysUntilRenewal et BdaysUntilRenewal sont égaux, ils restent dans le même ordre.
            return 0;
        });

            collection.updateCollection(sortedCollection)
            // collection.reset();
            // collection.requestPayload = collection.requestPayload ?? {};

            // if (this.requestPayload.hasOwnProperty("timeSelected")) {
            //     collection.requestPayload.df = this.requestPayload.timeSelected;
            // }

            // for (const [key, value] of Object.entries(this.additionalParams)) {
            //     collection.requestPayload[key] = value;
            // }
            // try {
            //     await collection.load();
            // }
            // catch (e) {
            //     this.$app.catchError(e);
            // }
        },
        /**
         * Change la valeur de showFilterForm et la retourne
         */
        changeFilterForm() {
            this.showFilterForm = !this.showFilterForm;
            return this.showFilterForm;
        },
        /**
         * Déclenché à la réception de l'évènement envoyé par le formulaire dans le composant enfant
         */
        recieveForm(childParams){
            this.additionalParams = childParams;
            this.showFilterForm = false;
            this.filter();
        },
    }
}

</script>