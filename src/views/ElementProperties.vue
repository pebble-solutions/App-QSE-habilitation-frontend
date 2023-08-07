<template>
    <AppModal 
        id="elementProperties" 
        title="Propriétés" 
        :cancel-btn="true" 
        :submit-btn="true" 
        :display="display" 
        :pending="pending" 
        @submit="record" 
        @modal-hide="routeToParent()"
        >
        <div v-if="tmpElement">
            <div class="mb-3">
                <label for="element_name" class="form-label">Nom</label>
                <input type="text" class="form-control" id="element_name" name="name" v-model="tmpElement.name">
            </div>
    
            <div class="row g-3">
                <div class="col mb-3">
                    <label for="element_qt" class="form-label">Quantité</label>
                    <input type="text" class="form-control" id="element_qt" name="qt" v-model="tmpElement.qt">
                </div>
                <div class="col mb-3">
                    <label for="element_amt" class="form-label">Montant</label>
                    <input type="text" class="form-control" id="element_amt" name="amt" v-model="tmpElement.amt">
                </div>
            </div>
    
            <div class="mb-3">
                <label for="element_description" class="form-label">Description</label>
                <textarea rows="6" class="form-control" id="element_description" name="description" v-model="tmpElement.description"></textarea>
            </div>
        </div>
    </AppModal>
</template>

<script>

import AppModal from '@/components/pebble-ui/AppModal.vue'

export default {
    data() {
        return {
            pending: false,
            tmpElement: null,
            display: true
        }
    },

    components: {
        AppModal
    },

    methods: {
        /**
         * Initialise les valeurs
         * 
         * Récupère les informations de la ressource depuis la collection d'éléments et crée
         * une copie temporaire pour le formulaire.
         * 
         * @return {Promise}
         */
        async init() {
            try {
                const element = await this.$assets.getCollection("elements").getById(this.$route.params.id);
                this.tmpElement = JSON.parse(JSON.stringify(element));
            } catch (e) {
                this.tmpElement = null;
                this.$app.catchError(e);
            }

        },

        /**
         * Appel le système d'enregistrement
         */
        record() {
            this.pending = true;
            this.$assets.getCollection("elements").updateCollection([this.tmpElement]);
            this.pending = false;
            this.display = false;
        },

        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.go(-1);
        }
    },

    async beforeMount() {
        await this.init();
    }
}
</script>