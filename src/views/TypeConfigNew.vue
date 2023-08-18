<template>
    <AppModal
    :title="'Création d\'une nouvelle configuration d\'habilitation'"
    size="lg"
    @update-type="updateType"
    @submit="createConfig()"
    @modal-hide="routeToParent()"
    :submit-btn="true"
    :cancel-btn="true"
    
    >
    {{ type }} 
    <FormConfigType
    :config-type="type"
    @update-type="updateType"
   >
</FormConfigType>
    </AppModal>
</template>
<script>
import FormConfigType from '../components/FormConfigType.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';
import { mapState } from 'vuex'


export default {

    computed: {
        ...mapState(['habilitationType']),
    },

    components: {AppModal, FormConfigType},

    data(){
        return {
            pending: {
                config: false
            },
            type: {
                nom:'',
                dd:'',
                df:'',
                duree:'',
            }
        }
    },

    methods: {

        updateType(val) {
            this.type = val;
        },
        /**
         * crée une nouvelle  config d'habilitation via API
         * 
         */
         createConfig(){
            this.pending.config = true
            alert('Voulez-vous configurer un nouveau type d\'habilitation ?')
            this.$app.apiPost('/v2/habilitation/type', {
                label: this.type.nom,
                dd: this.type.dd,
                df: this.type.df,
                expiration: this.type.duree,
            })
            .then((data) => 
            console.log(data))
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.config = false
                this.routeToParent()
            });

        },
        
        /**
         * Retourne a la vue précédente
         */
         routeToParent() {
            this.$router.back()
        }
    }

}
</script>