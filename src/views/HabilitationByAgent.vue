<template>
    <SuspensionsPersonnelInformations></SuspensionsPersonnelInformations>

    <div class="container text-custom p-2 mb-2">
        <!-- <h2 class="card-title text-center mb-1">Statistiques : </h2> -->
        <div class="row">
            <div class="col-md-6 p-3">
                <img src="../assets/chart1.png" alt="icone 1" class="img-fluid rounded shadow">
            </div>
            <div class="col-md-6 p-3">
                <img src="../assets/chart3.png" alt="icone 3" class="img-fluid rounded shadow">
            </div>
        </div>
    </div>

    <div class="container py-2 px-2">
        <div class="card bg-custom text-white p-4 mb-4 shadow">
            <h2 class="card-title text-center mb-3">Toutes les habilitations : </h2>
            <div class="card mb-2" v-for="hab in listHabByPersoJoinType" :key="hab.id">
                <HabMonitor :personnelHabilitation="hab" :displayHab="true" :displayAgent="false">
                </HabMonitor>
            </div>
        </div>

        <!-- <Spinner v-if="pending.agent"></Spinner>
        <template v-else>
            <div class="d-flex align-items-baseline">
                <span class="me-3 fw-lighter"># {{ $route.params.id }}</span>
                <h2 class="mb-3">
                    {{ currentPersonnel.cache_nom }}
                </h2>
            </div>

            <div class="row">
                <div class="col-12 col-md-6">
                    <h3 class="mx-2">Liste des habilitations</h3>
                    <div class="list-group" v-for="hab in habilitationFromPerso" :key="hab.id">
                        <RouterLink :to="'/operateur/' + $route.params.id + '/' + hab.id" custom
                            v-slot="{ navigate, href, isActive }">
                            <a :href="href" @click="navigate" class="list-group-item list-group-item-action mb-2"
                                :class="{ 'active': isActive }">
                                <div class="d-flex justify-content-between">
                                    <span> {{ returnNameHab(hab.habilitation_type_id) }}</span>
                                    <span>
                                        {{ hab.id }}
                                    </span>
                                    <span>
                                        échéance le {{ changeFormatDateLit(hab.df) }}
                                    </span>
                                </div>
                                <ProgressBar :value="hab"></ProgressBar>
                            </a>
                        </RouterLink>

                    </div>
                </div>
                <div class="col">
                    <RouterView></RouterView>
                </div>
            </div>

            <alert-message v-if="!habilitationFromPerso.length" class="m-3" variant="warning"
                icon="bi-exclamation-square">Cet opérateur n'a pas été habilité </alert-message>
        </template> -->
    </div>
</template>

<script>
import { mapState } from 'vuex';
// import Spinner from '../components/pebble-ui/Spinner.vue';
import { dateFormat } from '../js/collecte';
// import ProgressBar from '../components/ProgressBar.vue';
// import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import SuspensionsPersonnelInformations from './SuspensionsPersonnelInformations.vue';
import HabMonitor from '../components/HabMonitor.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';

export default {
    components: { SuspensionsPersonnelInformations, HabMonitor }, // Spinner, ProgressBar, AlertMessage,

    data() {
        return {
            pending: {
                agent: false,
                control: false,
            },
            habilitationFromPerso: '',
            listControlDone: '',
            listHabByPersoJoinType: '',
        }
    },

    computed: {
        ...mapState(['types', 'personnelsFiltered', 'suspensions', 'habilitationsPersonnels', 'veilles']),

        /**
         * retourne les informations du personnel depuis l'id passé dans l'url
         */
        currentPersonnel() {
            return this.personnelsFiltered.find((e) => e.id == this.$route.params.id);
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
            let listHabilitationsByPerso = this.habilitationsPersonnels.filter(e => e.personnel_id == id);
            let assemblerHabilitationType = new AssetsAssembler(listHabilitationsByPerso);
            await assemblerHabilitationType.joinAsset(this.$assets.getCollection('types'), 'characteristic_id', 'habilitationType');
            let joinList = assemblerHabilitationType.getResult();
            this.listHabByPersoJoinType = joinList;

            // fais une boucle sur la liste des habilitations pour trouver la veille correspondante
            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                let config = this.veilles.find(e => e.objet_id == this.listHabByPersoJoinType[i].characteristic_id);
                this.listHabByPersoJoinType[i].configVeille = config;
            }

            // fait une boucle pour recuperer les controles de chaque habilitation du personnel

            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                this.pending.control = true;
                await this.$app.apiGet('v2/collecte', {
                    habilitation_id: id,
                    kn2kn_info: 'OUI',
                    retard_info: 'OUI',
                    type: 'KN'
                })
                    .then((data) => {
                        let control = data;
                        console.log(data, "control")
                        this.listHabByPersoJoinType[i].controles = control;
                    })
                    .catch(this.$app.catchError).finally(() => this.pending.control = false);

            }

            // fait une boucle pour recuperer les veilles de chaque habilitation du personnel
            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                this.pending.control = true;
                await this.$app.apiGet('v2/controle/veille/' + this.listHabByPersoJoinType[i].configVeille.id + '/todo', { CSP_min: 0, CSP_max: 600 })
                    .then((data) => {
                        let veille = data;
                        
                        // selectionne les veiles correspondant a l'habilitation personnelle en cours
                        let veilleByHab = veille.find(e => e.habilitation_id == this.listHabByPersoJoinType[i].id);
                        console.log(veilleByHab, "veillebyhab")
                        this.listHabByPersoJoinType[i].veilles = veilleByHab;
                    })
                    .catch(this.$app.catchError).finally(() => this.pending.control = false);

            } 

            this.pending.agent = false;

        },


        // cherche la config de la veille correspondant aux habilitations du personnel
        findConfigVeille(id) {
            let config = this.veilles.find(e => e.objet_id == id);
            this.configVeille = config;

        },


        /**
         * retourne le nom de l'habilitation en fonction de l'id fourni
         */
        returnNameHab(id) {
            let hab = this.habilitationType.find((e) => e.id == id);
            return hab.nom


        },
        /**
        * Modifie le format de la date entrée en paramètre et la retourne 
        * sous le format 01 févr. 2021
        * @param {string} date 
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
.bg-custom {
    background-color: #f78c6b9a;
}

.text-custom {
    color: #f78c6b9a;
}
</style>