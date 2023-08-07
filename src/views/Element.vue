<template>
    <div v-if="element">

        <div class="alert alert-danger" v-if="error">{{error}}</div>

        <h1>{{element.name}}</h1>
        <p>{{element.description}}</p>
        <h2>ID de la ressource : {{element.id}}</h2>
        <pre>{{element}}</pre>

        <div v-if="type">
            <h2>ID du type {{ element.type_id }}</h2>
            <pre v-if="!pending.type">{{ type }}</pre>
            <div v-else class="text-secondary">
                <span class="spinner-border"></span>
                Chargement...
            </div>
        </div>
        
        <router-view></router-view>
    </div>

    <div v-if="pending.element" class="fs-4 text-center py-4 text-secondary">
        <span class="spinner-border"></span>
        Chargement...
    </div>

    <div class="alert alert-danger" v-if="!element && !pending.element">
        <i class="bi bi-file-x"></i> Aucune ressource trouvée
    </div>
</template>

<script>

export default {

    data() {
        return {
            pending: {
                type: true,
                element: true
            },
            element: null,
            type: null,
            error: null
        }
    },

    methods: {
        /**
         * Cette méthode charge une ressource depuis le store.
         * 
         * Une ressource doit être définie par un nom dans data et dans pending de data.
         * Une AssetsCollection doit être préalablement déclarée dans l'AssetsController. Le nom de cette 
         * collection doit être {assetName}+s.
         * 
         * @param {string} assetName Le nom de la ressource à chargé tel que déclaré dans data
         * @param {mixed} id L'ID à charger
         * 
         * @return {Promise}
         */
        async loadAssetById(assetName, id) {
            this.pending[assetName] = true;
            try {
                this[assetName] = await this.$assets.getCollection(`${assetName}s`).getById(id);
            } catch (e) {
                this[assetName] = null;
                this.$app.catchError(e);
            } finally {
                this.pending[assetName] = false;
            }
        },

        /**
         * Cette méthode charge un nouvelle élément dans la vue.
         * 
         * @param {string} id L'ID de l'élément à charger
         */
        async load(id) {
            await this.loadAssetById("element", id);
            if (this.element) {

                this.$store.commit("openedElement", this.element);

                if (this.element.type_id) {
                    await this.loadAssetById("type", this.element.type_id);
                }
                else {
                    this.type = null;
                }
            }
            else {
                this.$store.commit("openedElement", null);
            }
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        this.load(to.params.id);
    },


    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    mounted() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.load(this.$route.params.id);
    },

    beforeUnmount() {
        this.$store.commit("openedElement", null);
    }
}

</script>
