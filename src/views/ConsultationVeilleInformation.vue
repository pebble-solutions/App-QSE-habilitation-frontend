<template>
    {{ veille }}
</template>

<script>

export default {

    data() {
        return {
            veille: null,
            pending: true
        }
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
            this.veille = await this.$assets.getCollection("veilles").getById(this.$route.params.id);
        } catch (e) {
            this.$app.catchError(e);
        } finally {
            this.pending = false;
        }
    }
}
</script>