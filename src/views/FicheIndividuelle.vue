<template>
    <div class="card custom-app-color mt-4 mx-2 text-white py-2 px-2">
        <Spinner v-if="pending.agent"></Spinner>
        <template v-if="habilitationFromPerso.length">
            
            <h2 class="text-center">Liste des habilitations de {{ returnName(habilitationFromPerso[0].personnel_id) }}</h2>

            <div class="mb-3" v-for="hab in listHabPersoType" :key="hab.id">
                <HabMonitor :hab="hab" :displayHab="true" :displayAgent="false"></HabMonitor>
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
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';



export default {

    components: { AlertMessage, Spinner, HabMonitor },

    computed: {
        ...mapState(['types', 'personnels']),

    },

    data() {
        return {
            pending: {
                agent: false
            },
            habilitationFromPerso: '',
            listHabPersoType:'',
            personnel_id: null,
            veille: null,
            personnel: null,
        }
    },

    methods: {

       

        /**
         * Envoie une requête pour charger la liste des habilitation d'un personnel
         * en fonction de l'id fourni
         * @param {Number} id du personnel 
         */
        async loadHabilitationFromPersonnel(id) {
            this.pending.agent = true;
            await this.$app.apiGet('v2/controle/habilitation', {
                personnel_id: id,
            })
                .then((data) => {
                    this.habilitationFromPerso = data;
                    console.log(this.habilitationFromPerso, 'habperso');
                })
                .catch(this.$app.catchError)
                .finally(() => this.pending.agent = false);
            this.infosList()
        },

        async infosList() {
            let assemblerPersonnel= new AssetsAssembler(this.habilitationFromPerso);
            await assemblerPersonnel.joinAsset(this.$assets.getCollection("personnels"), 'personnel_id', 'personnel');
            let joinedListHab = assemblerPersonnel.getResult();
            console.log(joinedListHab, 'assembler?');
            let assemblerType = new AssetsAssembler(joinedListHab);
            await assemblerType.joinAsset(this.$assets.getCollection ("types"), 'habilitation_type_id', 'habilitationtype');
            let joinedType = assemblerType.getResult();
            this.listHabPersoType = joinedType;
        },


        returnName(id) {
            let personnel = this.personnels.find(e => e.id === id);
            if (personnel) {
                return personnel.cache_nom;
            } else {
                return personnel;
            }
        },

        /**
         * retourne la date entrée en param_tre sous le format 23 jui. 2023
         * @param {date} el 
         */
        changeFormatDateLit(el) {
            return dateFormat(el);
        },

       
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.personnel_id) {
            this.loadHabilitationFromPersonnel(to.params.id);
        }
    },


    beforeMount() {
        /**
         * charge la list des habilitations du personnel concerné
         */
        this.loadHabilitationFromPersonnel(this.$route.params.id);
    }

}
</script>
<style scoped>
.custom-app-color {
    background-color: #F78C6B;
}
</style>