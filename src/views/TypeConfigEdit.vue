<template>
    <AppModal
    v-if="Object.keys(habConfig) != 0"
    
    :title="'Modification de la configuration de l\'habilitation #' + $route.params.id"
    size="lg"
    @submit="modifyConfig()"
    @delete="deleteConfig()"
    @modal-hide="routeToParent()"
    :submit-btn="true"
    :cancel-btn="true"
    :delete-btn="true"
    :pending="pending.type"
    >
        <Spinner v-if="pending.type"></Spinner>
        <FormConfigType v-else :config-type="habConfig" @update-type="updateType"></FormConfigType>
    </AppModal>
    
</template>
<script>
import FormConfigType from '../components/FormConfigType.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';
import { mapState } from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';


export default {
    data() {
        return {
            habConfig: {},
            pending:{
                type:false,
            },
            
            type: {
                nom: null,
                dd: null,
                df: null,
                duree: null,
            },
            config:null,

        }
    },
    
    computed: {
        ...mapState(['habilitationType','types'])
      


    },
        
    methods: {
        
        updateType(payload) {
            this.type = payload;
        },

        /**
         * récupère le type de config dans le store à partir de l'id fourni
         * 
         * @param {number}  id de la configuration dyu type
         * 
         */
        getConfig(id) {
            if(id) {
                let config = this.types.find(e => e.id == id);
                this.habConfig = config
            }
        },


       
        /**
         * modifie le type d'habilitation et retourne sur la vue du type
         * d'habilitation concerné
         * 
         */
        modifyConfig(){
            if (confirm ('Souhaitez vous modifier cette configuration?')) {
                this.pending.type = true  
                this.$app.api.patch('/v2/habilitation/type/'+this.$route.params.id, {
                    label: this.type.nom,
                    dd: this.type.dd,
                    df: this.type.df,
                    expiration: this.type.duree,
                   
                })
                .then((data) => {

                    this.type = data;
                    alert('la configuration "' + data.label + '" a été modifiée');

					this.$assets.getCollection("types").load();
                    this.$router.push('/types/'+this.$route.params.id);
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.type = false;
                    this.$router.push('/types/'+this.$route.params.id);
                });
                this.pending.type = false  

            }
        },
        
        /**
         * supprime le type d'habilitation en fonction de l'id de la route
         * et retourne sur la vue de la liste des types d'habilitation à jour
         */
        deleteConfig(){
                this.pending = true  
                this.$app.api.delete('/v2/habilitation/type'+this.$route.params.id, {
                })
                .then((data) => {
                    alert('la configuration "' + data.label + '" a été supprimée');
					this.$assets.getCollection("types").reset();
                    this.$assets.getCollection("types").load();
                    this.$router.push('/types');

                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.$router.push('/types/');
                });
                this.pending = false;
        },
        /**
         * Retourne a la vue précédente
         */
        routeToParent() {
            this.$router.go(-1)
        },
        
    },
   
    mounted() {
        
        this.getConfig(this.$route.params.id)
    },
    
        
    components: {AppModal, FormConfigType, Spinner}, //

}
</script>