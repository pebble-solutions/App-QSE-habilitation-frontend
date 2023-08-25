<template>
    <div class="container py-2 px-2" >
        <Spinner v-if="pending.agent"></Spinner>
        <template v-if="habilitationFromPerso.length" >
            <h5>Liste des habilitations</h5>

            <div class="mb-3" v-for="hab in habilitationFromPerso" :key="hab.id">
                <HabMonitor :habId="hab.id"></HabMonitor>
            </div>
            <div>
            </div>

        </template>
        <AlertMessage v-else> Ce personnel n'est pas habilité</AlertMessage>
    </div>  
</template>
<script>
// import {mapState, mapActions} from 'vuex'; 
// import HabMonitor from '../components/HabMonitor.vue';
import { mapState } from 'vuex';
import HabMonitor from '../components/HabMonitor.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import { dateFormat } from '../js/date';


export default {

    components:  { AlertMessage, Spinner,HabMonitor},

    computed: {
        ...mapState(['types'])

    },

    data() {
        return {
            pending: {
                agent:false
            },
            habilitationFromPerso: '',
            listControlDone: '',
            personnel_id: null,
            veille: null,
        }
    },


    methods: {

        // /**
        //  * retourne le nom de  habilitation type en fonction de l'id fourni
        //  * @param {number} id 
        //  * @returns {string}    le nom du type d'habilitation
        //  */
        // findHabilitationType(id) {
        // let habilitationType = this.types.find((e) => e.id == id);
        // // let nom = habilitationType.nom
        // return habilitationType.nom
        // },

        /**
         * Envoie une requête pour charger la liste des habilitation d'un personnel
         * en fonction de l'id fourni
         * @param {Number} id du personnel 
         */
         loadHabilitationFromPersonnel(id) {
            this.pending.agent = true;
            this.$app.apiGet('v2/controle/habilitation', {
                personnel_id : id,
            })
            .then((data) => {
                console.log(data, id)
                this.habilitationFromPerso = data;
            })
            .catch(this.$app.catchError).finally(() => this.pending.agent = false);
        },
        /**
         * retourne la date entrée en param_tre sous le format 23 jui. 2023
         * @param {date} el 
         */
        changeFormatDateLit(el) {
            return dateFormat(el);
        },

        loadHabilitationPerso(id) {
            this.pending.control = true;
            this.$app.apiGet('v2/controle/habilitation', {
            id: id,
            })
            .then((data) => {
                this.habilitationPerso = data;
                this.hab = data[0]
                let veilleId = this.hab.habilitation_type_id
                this.$app.apiGet('v2/controle/veille/' + veilleId + '/todo', { CSP_min: 0, CSP_max: 600 })
                    .then((data) => {
                    this.listControlToDo = data;
                    if(this.listControlToDo){
                    let veille = this.listControlToDo.find((e) => e.personnel_id == this.hab.personnel_id)
                    console.log(veille , 'veille')
                    if (veille) {
                    this.lastControl = veille.date_last
                    }
                    else this.noLastControl = 'La veille est à jour'
                    }
                    })
                    .catch(this.$app.catchError).finally(() => this.pending.control = false);
                })
            .catch(this.$app.catchError).finally(() => this.pending.control = false);
        },
      
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
     beforeRouteUpdate(to) {
        if (to.params.id != this.personnel_id) {
            this.loadHabilitationFromPersonnel (to.params.id);

        }
    },

    beforeMount () {
        /**
         * charge la list des habilitations du personnel concerné
         */
        this.loadHabilitationFromPersonnel(this.$route.params.id);
    }

}
</script>