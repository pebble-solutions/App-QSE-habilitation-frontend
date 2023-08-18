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
        <FormConfigType :config-type="habConfig" @update-type="updateType"></FormConfigType>
    </AppModal>
    
</template>
<script>
import FormConfigType from '../components/FormConfigType.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';
import { mapState } from 'vuex';


export default {
    data() {
        return {
            habConfig: {},
            pending:{
                type: false
            },
            type: {
                nom:'',
                dd:'',
                df:'',
                duree:'',
            }
        }
    },
    
    computed: {
        ...mapState(['habilitationType'])
      


    },
        
    methods: {
        updateType(payload) {
            console.log(payload)
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
                let config = this.habilitationType.find(e => e.id == id);
                this.habConfig = config
            }

        },


       
        /**
         * crée une nouvelle config d'habilitation
         * 
         */
        modifyConfig(){
            if (confirm ('Souhaitez vous modifier cette configuration?')) {
                this.pending.type = true  
                this.$app.api.patch('/v2/habilitation/type'+this.$route.params.id, {
                    label: this.type.nom,
                    dd: this.type.dd,
                    df: this.type.df,
                    expiration: this.type.duree,
                   
                })
                .then((data) => 
                    console.log(data),
                )
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.type = false
                });
                this.pending.type = false  

            }
        },

        deleteConfig(){
                this.pending.type = true  
                this.$app.api.delete('/v2/habilitation/type'+this.$route.params.id, {
                    // label: this.type.nom,
                    // dd: this.type.dd,
                    // df: this.type.df,
                    // expiration: this.type.duree,
                   
                })
                .then((data) => 
                    alert('la configuration ' +data.label+' a été supprimmée'),
                    this.routeToParent())
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.type = false
                });
                this.pending.type = false  
        },
        /**
         * Retourne a la vue précédente
         */
        routeToParent() {
            this.$router.back()
        },
        
    },
   
    mounted() {
        
        console.log (this.$route.params.id);
        this.getConfig(this.$route.params.id)
    },
    
        
    components: {AppModal, FormConfigType}, //

}
</script>