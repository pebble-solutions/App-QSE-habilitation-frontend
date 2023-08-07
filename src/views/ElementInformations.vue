<template>
    <AppModal 
        id="elementProperties" 
        title="Informations"
        @modal-hide="routeToParent()"
        >
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(value, key) in element" :key="key">
                <strong class="d-block">{{key}}</strong>
                <div>{{value}}</div>
            </li>
        </ul>
    </AppModal>
</template>

<script>

import AppModal from '@/components/pebble-ui/AppModal.vue'

export default {

    data() {
        return {
            element: null,
            pending: true
        }
    },

    components: {
        AppModal
    },

    methods: {
        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.go(-1);
        }
    },

    async mounted() {
        this.pending = true;
        try { 
            this.element = await this.$assets.getCollection("elements").getById(this.$route.params.id);
        } catch (e) {
            this.$app.catchError(e);
        } finally {
            this.pending = false;
        }
    }
}
</script>