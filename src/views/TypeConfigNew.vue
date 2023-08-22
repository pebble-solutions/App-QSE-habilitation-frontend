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
        ...mapState(['types']),
    },

    components: {AppModal, FormConfigType},

    data(){
        return {
            pending: {
                config: false
            },
            type: {
                id:'',
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
            .then((data) => {
                this.type = data,
                alert('type habilitation '+data.label+'/'+data.id+' crée'),
				this.$assets.getCollection("types").load();
                
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.config = false
                // this.$router.push('/types/'+this.type.id);
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