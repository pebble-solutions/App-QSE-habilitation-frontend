<template>
    <div>
        <AppModal
        :title="'Création d\'une veille sur habilitation'"
        @submit="createVeille()"
        @modal-hide="routeToParent()"
        :submit-btn="true"
        :cancel-btn="true"
        
        >
            <FormConfigVeille
            :config-veille="veille"
            @update-veille="updateVeille">
            </FormConfigVeille>

        </AppModal>
    </div>
</template>
<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
import FormConfigVeille from '../components/FormConfigVeille.vue';
import { mapState } from 'vuex';
export default{

    computed: {
        ...mapState(['veilles']),
    },

    components: {AppModal, FormConfigVeille},

    data() {
        return {

            veille: {
                nom: null,
                dd: null,
                df: null,
                formulaire_id: null,
                control_step: null,
            },
            pending: {
                config: false,
            }
    

        }
    },

    methods: {

        /**
         * Met à jour les informations de la veille à partir du formulaire
         * @param {Object} val 
         */
        updateVeille(val) {
            this.veille = val;
        },
        createVeille(){
            this.pending.config = true
            this.$app.api.post('/v2/controle/veille', {
                nom: this.veille.nom,
                dd: this.veille.dd,
                df: this.veille.df,
                formulaire_id: this.veille.formulaire_id,
                control_step: this.veille.control_step,
                tlc: 'Characteristic',
                type: 'Habilitation',
                tli: this.$route.params.id,
            })
            .then((data) => {
                this.veille = data;
                alert('la configuration "' + this.veille.nom + '" a été créée');
                this.$assets.getCollection("veilles").load();
                this.$router.push('/types/'+this.$route.params.id);
            }) 
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.config = false;
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