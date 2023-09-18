<template>
    <div class="container py-2">
        <div class="card bg-custom mt-4">
            <div class="card-body">
                <h2 v-if="personnel" class="text-center text-white">{{ personnel.cache_nom }} <span
                        class="text-secondary">#{{
                            $route.params.id }}</span></h2>
                <SuspensionsPersonnelInformations></SuspensionsPersonnelInformations>
            </div>
        </div>
    </div>


    <div class="container text-custom p-2 mb-2">
        <h2 class="card-title text-center mb-1">Statistiques :</h2>
        <div class="row">
            <div class="col-md-6 p-3">
                <div ref="chart1" style="width: 100%; height: 300px;"></div>
            </div>
            <div class="col-md-6 p-3">
                <div ref="chart2" style="width: 100%; height: 300px;"></div>
            </div>
        </div>
    </div>

    <div class="container py-2 px-2">
        <div v-if="!pending.agent && !pending.control" class="card bg-custom text-white p-4 mb-4 shadow">
            <template v-if="listHabByPersoJoinType.length">
                <h2 class="card-title text-center mb-3">Toutes les habilitations : </h2>
                <div class="card mb-2" v-for="hab in listHabByPersoJoinType" :key="hab.id">
                    <HabMonitor :personnelHabilitation="hab" :displayHab="true" :displayAgent="false">
                    </HabMonitor>
                </div>
            </template>
            <div v-else class="text-center">Aucune habilitation pour ce personnel.</div>
        </div>
        <spinner v-else></spinner>
    </div>
</template>
  
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import SuspensionsPersonnelInformations from './SuspensionsPersonnelInformations.vue';
import HabMonitor from '../components/HabMonitor.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import Spinner from '../components/pebble-ui/Spinner.vue';
import * as echarts from 'echarts';

export default {
    components: { SuspensionsPersonnelInformations, HabMonitor, Spinner },

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
        ...mapState(['types', 'personnelsFiltered', 'suspensions', 'habilitationsPersonnels', 'veilles', 'personnels']),

        /**
         * retourne les informations du personnel depuis l'id passé dans l'url
         */
        currentPersonnel() {
            return this.personnelsFiltered.find((e) => e.id == this.$route.params.id);
        },
        /**
      * Retourne l'objet personnel correspondant à l'ID de l'URL.
      * @return {Object} L'objet personnel correspondant à l'ID.
      */
        personnel() {
            return this.personnels.find(el => el.id == this.$route.params.id);
        },
    },

    methods: {


        createEChartsCharts() {
            // Récupérez les références aux div
            const chart1Container = this.$refs.chart1;
            const chart2Container = this.$refs.chart2;

            // Créez une instance de graphique ECharts dans chaque div
            const chart1 = echarts.init(chart1Container);
            const chart2 = echarts.init(chart2Container);

            // Options pour le premier graphique
            const option1 = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }
                ]
            };

            // Options pour le deuxième graphique (vous pouvez personnaliser cela)
            const option2 = {
                // ...
            };

            // Appliquez les options aux graphiques
            chart1.setOption(option1);
            chart2.setOption(option2);
        },



        /**
         * Envoie une requête pour charger la liste des habilitations d'un personnel
         * en fonction de l'id fourni
         * @param {Number} id - ID du personnel
         */
        async loadHabilitationFromPersonnel(id) {
            this.pending.agent = true;
            let listHabilitationsByPerso = this.habilitationsPersonnels.filter(e => e.personnel_id == id);
            let assemblerHabilitationType = new AssetsAssembler(listHabilitationsByPerso);
            await assemblerHabilitationType.joinAsset(this.$assets.getCollection('types'), 'characteristic_id', 'habilitationType');
            let joinList = assemblerHabilitationType.getResult();
            this.listHabByPersoJoinType = joinList;

            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                let config = this.veilles.find(e => e.objet_id == this.listHabByPersoJoinType[i].characteristic_id);
                this.listHabByPersoJoinType[i].configVeille = config;
            }

            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                this.pending.control = true;
                await this.$app.apiGet('v2/collecte', {
                    habilitation_id: this.listHabByPersoJoinType[i].id,
                    kn2kn_info: 'OUI',
                    retard_info: 'OUI',
                    type: 'KN'
                })
                    .then((data) => {
                        let control = data;
                        this.listHabByPersoJoinType[i].controles = control;
                    })
                    .catch(this.$app.catchError).finally(() => this.pending.control = false);
            }

            for (let i = 0; i < this.listHabByPersoJoinType.length; i++) {
                this.pending.control = true;
                console.log(this.listHabByPersoJoinType[i].configVeille, "config veille .id");
                if (this.listHabByPersoJoinType[i].configVeille) {
                    await this.$app.apiGet('v2/controle/veille/' + this.listHabByPersoJoinType[i].configVeille.id + '/todo', { CSP_min: 0, CSP_max: 600 })
                        .then((data) => {
                            let veille = data;
                            if (veille) {
                                let veilleByHab = veille.find(e => e.habilitation_id == this.listHabByPersoJoinType[i].id);
                                this.listHabByPersoJoinType[i].veille = veilleByHab;
                            }
                            else {
                                let veillebyhab = null;
                                this.listHabByPersoJoinType[i].veille = veillebyhab;
                            }
                        })
                        .catch(this.$app.catchError).finally(() => this.pending.control = false);
                }
                else {
                    console.log(this.listHabByPersoJoinType[i].configVeille, "pas de config veille id");
                    this.pending.control = false;
                }
            }

            this.pending.agent = false;
        },

        /**
         * Retourne le nom de l'habilitation en fonction de l'ID fourni.
         * @param {Number} id - ID de l'habilitation
         * @returns {string} Nom de l'habilitation
         */
        returnNameHab(id) {
            let hab = this.habilitationType.find((e) => e.id == id);
            return hab.nom;
        },

        /**
         * Modifie le format de la date au format 01 févr. 2021.
         * @param {string} el - Date à formater
         * @returns {string} Date formatée
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
         * Charge la liste des habilitations du personnel concerné.
         */
        this.loadHabilitationFromPersonnel(this.$route.params.id);
    },
    mounted() {
        this.createEChartsCharts();
        this.loadHabilitationFromPersonnel(this.$route.params.id); // Assurez-vous d'appeler cette méthode ici si nécessaire.
    },
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
  