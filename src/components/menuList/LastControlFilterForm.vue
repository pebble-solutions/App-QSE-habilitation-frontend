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
    </form>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            selectTimeOptions: [
                { value: -1, label: "Tous" },
                { value: 0, label: "Expirées" },
                { value: 7, label: "1 semaine" },
                { value: 30, label: "1 mois" },
                { value: 91, label: "3 mois" },
                { value: 183, label: "6 mois" }
            ],
            requestPayload: {
                timeSelected: -1
            },
            showFilterForm: false,
            additionalParams: [],
        }
    },

    props: {
        change: Boolean
    },

    emits: ['modif-change'],

    computed: {
        ...mapState(['pending', 'types']),
    },
    methods: {
        /**
         * Lance la recherche et tri la collection
         */
        async filter() {
            this.pending.habilitationsPersonnels = true;
            const collection = this.$assets.getCollection("habilitationsPersonnels");

            collection.reset();

            for (const [key, value] of Object.entries(this.additionalParams)) {
                collection.requestPayload[key] = value;
            }
            try {
                await collection.load();
            }
            catch (e) {
                this.$app.catchError(e);
            }

            const sortedCollection = collection.getCollection().sort((a, b) => {
                const AdaysUntilRenewal = Math.trunc((new Date(a.df) - new Date()) / (1000 * 3600 * 24));
                const BdaysUntilRenewal = Math.trunc((new Date(b.df) - new Date()) / (1000 * 3600 * 24));

                return AdaysUntilRenewal - BdaysUntilRenewal;
            });

            let filteredCollection = sortedCollection;

            if (this.requestPayload.timeSelected !== -1) {
                if (this.requestPayload.timeSelected !== 0) {
                    filteredCollection = sortedCollection.filter(item => {
                        const daysUntilRenewal = Math.trunc((new Date(item.df) - new Date()) / (1000 * 3600 * 24));
                        return daysUntilRenewal < this.requestPayload.timeSelected && daysUntilRenewal > 0;
                    });
                } else {
                    filteredCollection = sortedCollection.filter(item => {
                        const daysUntilRenewal = Math.trunc((new Date(item.df) - new Date()) / (1000 * 3600 * 24));
                        return daysUntilRenewal < this.requestPayload.timeSelected;
                    });
                }
            }

            collection.updateCollection(filteredCollection);
            this.$emit('modif-change', filteredCollection);
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
    },

    mounted(){
        if (this.change == false){
            this.filter();
        }
    }
}

</script>