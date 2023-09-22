<template>
    <div>
        <AppModal
        v-if="Object.keys(veilleConfig) != 0"
        :title="'Modification de la configuration de la Veille #'+$route.params.idVeille"
        size="lg"
        @submit="modifyConfigVeille()"
        @delete="deleteVeille()"
        @modal-hide="routeToParent()"
        :submit-btn="true"
        :cancel-btn="true"
        :delete-btn="true"
        :pending="pending.config"
        >
        
        <FormConfigVeille :config-veille="veilleConfig" @update-veille="updateVeille"></FormConfigVeille>
        </AppModal>
    </div>
</template>
<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
import FormConfigVeille from '../components/FormConfigVeille.vue';
import { mapState } from 'vuex';

export default{

    components: {AppModal, FormConfigVeille},


    data() {
        return {
            veilleConfig: {},
            pending: {
                config: false
            },
            veille: {
                nom: null,
                dd: null,
                df: null,
                formulaire_id: null,
                control_step: null,
            },
            config: null,
        }
    },
    computed: {
        ...mapState(['veilles'])
    },

    methods: {
        updateVeille(payload) {
            this.veille = payload;
        },
        /**
         * Retourne a la vue précédente
         */
         routeToParent() {
            this.$router.back()
        },

        /**
         * récupère le type de config dans le store à partir de l'id fourni
         * 
         * @param {number}  id de la configuration dyu type
         * 
         */
         getConfig(id) {
            if(id) {
                let config = this.veilles.find(e => e.id == id);
                console.log(config, 'configveille')
                this.veilleConfig = config
            }
        },

        modifyConfigVeille() {
            if(confirm('Souhaitez-vous modifier la configuration de la veille?')) { 
                this.pending.config = true
                this.$app.api.patch('v2/controle/veille/'+this.$route.params.idVeille, {
                    control_step: this.veille.control_step,
                    nom: this.veille.nom,
                    dd: this.veille.dd,
                    df: this.veille.df,
                    formulaire_id: this.veille.formulaire_id,
                    tlc: this.veilleConfig.objet,
                    tli: this.$route.params.id,
                    type: this.veilleConfig.type,
                })
                .then((data) => {
                    this.veille = data;
                    alert('la configuration "' + this.veille.nom + '" a été modifiée');
					this.$assets.getCollection("veilles").load();
                    this.$router.push('/types/'+this.$route.params.id);
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.config = false;
                });
            }

        },

        deleteVeille() {
            if(confirm('Souhaitez-vous supprimer cette veille?')) {
                this.pending.config = true
                this.$app.api.delete('v2/controle/veille/'+this.$route.params.idVeille)
                .then(() => {
                   
                    alert('la configuration "' + this.veille.nom + '" a été supprimée');
                    this.$assets.getCollection("veilles").load();
                    this.$router.push('/types');
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.config = false;
                    this.$router.push('/types');
                });
                this.pending.config = false;
            } 

        }
    },

    mounted(){
        /**
         * charge la config de la veille en focntion de l'id fourni dans l'url
         * 
         * @param   {number}    id  id de la config de la veille
         */
         this.getConfig(this.$route.params.idVeille)

    }
}
</script>