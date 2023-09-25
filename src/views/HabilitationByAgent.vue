
<template>
    <div class="container py-2">
        <div class="card bg-custom mt-4">
            <div class="card-body">
                <h2 v-if="personnel" class="text-center text-white">
                    {{ personnel.cache_nom }}
                    <span class="text-secondary"> #{{ $route.params.id }}</span>
                </h2>
                <SuspensionsPersonnelInformations></SuspensionsPersonnelInformations>
            </div>
        </div>
    </div>


<!--    <div class="container text-custom p-2 mb-2 mt-4 justify-center">-->
<!--            <div class="row">-->
<!--                <div class="col-12 col-lg-6">-->
<!--                        <div ref="chart1" style="width: 100%; height: 300px;"></div>-->
<!--                </div>-->
<!--                <div class="col-12 col-lg-6">-->
<!--                        <div ref="chart2" style="width: 100%; height: 300px;"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--    </div>-->

    <div class="container py-2 px-2">
        <div v-if="!pending.agent && !pending.control" class="card bg-custom text-white p-4 mb-4 shadow">
            <template v-if="listHabByPersoJoinType.length">
                <h2 class="card-title text-center mb-3">Toutes les habilitations : </h2>
                <div class="card mb-2" v-for="hab in listHabByPersoJoinType" :key="hab.id">
                    <HabMonitor :personnelHabilitation="hab" :displayHab="true" :displayAgent="false" />
                </div>
            </template>
            <div v-else class="text-center">Aucune habilitation pour ce personnel.</div>
        </div>
        <spinner v-else></spinner>
    </div>
    <RouterView></RouterView>
</template>
  
<script>
import { mapState } from 'vuex';
import SuspensionsPersonnelInformations from '../components/SuspensionsPersonnelInformations.vue';
import HabMonitor from '../components/HabMonitor.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import Spinner from '../components/pebble-ui/Spinner.vue';
import { RouterView } from 'vue-router';
// import * as echarts from 'echarts';


export default {
    components: {  HabMonitor, Spinner,  RouterView, SuspensionsPersonnelInformations}, 

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

        // /**
        //  * Crée deux graphiques ECharts dans des conteneurs HTML spécifiques.
        //  * @function
        //  * @memberof VotreClasse
        //  * @name createEChartsCharts
        //  *
        //  * @description Cette méthode initialise deux graphiques ECharts dans des conteneurs HTML donnés, génère des données aléatoires pour les graphiques, et définit des options spécifiques pour chaque graphique.
        //  *
        //  * @param {HTMLElement} this.$refs.chart1 - Référence au premier conteneur du graphique.
        //  * @param {HTMLElement} this.$refs.chart2 - Référence au deuxième conteneur du graphique.
        //  * @returns {void}
        //  */
        // createEChartsCharts() {
        //     // Récupérez les références aux div
        //     const chart1Container = this.$refs.chart1;
        //     const chart2Container = this.$refs.chart2;
        //
        //     // Créez une instance de graphique ECharts dans chaque div
        //     const chart1 = echarts.init(chart1Container);
        //     const chart2 = echarts.init(chart2Container);
        //
        //
        //     // Générer les données pour personnalData avec 6 résultats espacés d'environ 180 jours
        //     const personnalData = [];
        //     let currentDate = new Date(new Date().getFullYear() - 3, 0, 1); // Date de départ il y a 3 ans
        //
        //     for (let i = 0; i < 9; i++) {
        //         const dataPoint = {
        //             Year: currentDate,
        //             line: 'personnel1',
        //             Income: Math.random() * (9.5 - 5) + 4, // Note aléatoire entre 6 et 9.5
        //         };
        //         personnalData.push(dataPoint);
        //         currentDate = new Date(currentDate.getTime() + (180 * 24 * 60 * 60 * 1000)); // Ajoute environ 180 jours
        //     }
        //
        //     // Générer les données pour averageData avec 50 résultats chronologiques
        //     const averageData = [];
        //     currentDate = new Date(new Date().getFullYear() - 3, 0, 1); // Réinitialise la date de départ
        //     const endDate = new Date(); // Date actuelle
        //     const minInterval = 18; // Minimum d'espacement en jours
        //     const maxInterval = 24; // Maximum d'espacement en jours
        //     const numberOfDates = 70; // Nombre de dates à générer
        //
        //
        //     for (let i = 0; i < numberOfDates; i++) {
        //         // Générer un nombre aléatoire d'intervalles de jours entre minInterval et maxInterval
        //         const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        //
        //         // Ajouter l'espacement aléatoire en jours à la date actuelle
        //         currentDate.setDate(currentDate.getDate() + randomInterval);
        //
        //         // Assurez-vous que la date générée est dans les trois dernières années
        //         if (currentDate > endDate) {
        //             break; // Sortez de la boucle si nous avons dépassé la date actuelle
        //         }
        //
        //         const dataPoint = {
        //             Year: new Date(currentDate), // Utilisez une copie de la date actuelle
        //             line: 'Moyenne',
        //             Income: Math.random() * (9.5 - 6) + 6, // Note aléatoire entre 6 et 9.5
        //         };
        //         averageData.push(dataPoint);
        //     }
        //     // Options pour le premier graphique
        //     const option1 = {
        //         title: {
        //             text: 'Résultats totaux des questions SAMI',
        //         },
        //         xAxis: {
        //             type: 'category',
        //             data: ['S', 'A', 'M', 'I'],
        //         },
        //         yAxis: {
        //             type: 'value',
        //             min: 0,
        //             max: 50,
        //         },
        //         series: [
        //             {
        //                 data: [
        //                     {
        //                         value: Math.floor(Math.random() * 50),
        //                         itemStyle: {
        //                             color: '#14A44D'
        //                         }
        //                     },
        //                     {
        //                         value: Math.floor(Math.random() * 50),
        //                         itemStyle: {
        //                             color: '#3B71CA'
        //                         }
        //                     },
        //                     {
        //                         value: Math.floor(Math.random() * 50),
        //                         itemStyle: {
        //                             color: '#E4A11B'
        //                         }
        //                     },
        //                     {
        //                         value: Math.floor(Math.random() * 50),
        //                         itemStyle: {
        //                             color: '#DC4C64'
        //                         }
        //                 },
        //             ],
        //                 type: 'bar',
        //             },
        //         ],
        //     };
        //
        //
        //
        //     const option2 = {
        //         title: {
        //             text: 'Évolution de la moyenne des résultats',
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //         },
        //         yAxis: {
        //             type: 'value',
        //             min: 0,
        //             max: 10,
        //             nameLocation: 'middle',
        //         },
        //         xAxis: {
        //             type: 'time',
        //             min: new Date(new Date().getFullYear() - 3, 0, 1), // Début il y a 3 ans
        //             max: new Date(), // Fin à la date actuelle
        //             name: 'Date',
        //         },
        //         series: [
        //             {
        //                 name: 'Données Personnelles',
        //                 type: 'line',
        //                 data: personnalData.map((entry) => ({
        //                     value: [entry.Year, entry.Income],
        //                 })), // Utilisez les dates précises
        //                 showSymbol: true,
        //                 encode: {
        //                     x: 'Year',
        //                     y: 'Income',
        //                     itemName: 'Year',
        //                     tooltip: ['Income'],
        //                 },
        //             },
        //             {
        //                 name: 'Moyenne',
        //                 type: 'line',
        //                 data: averageData.map((entry) => ({
        //                     value: [entry.Year, entry.Income],
        //                 })), // Utilisez les dates précises
        //                 showSymbol: true,
        //                 encode: {
        //                     x: 'Year',
        //                     y: 'Income',
        //                     itemName: 'Year',
        //                     tooltip: ['Income'],
        //                 },
        //             },
        //         ],
        //     };
        //
        //
        //     // Appliquez les options aux graphiques
        //     chart1.setOption(option1);
        //     chart2.setOption(option2);
        // },


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
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.personnel.id) {
            this.loadHabilitationFromPersonnel(to.params.id);
        }
    },

    beforeMount() {
        /**
         * Charge la liste des habilitations du personnel concerné.
         */
        this.loadHabilitationFromPersonnel(this.$route.params.id);
        // charge les suspensions
        const suspensionCollection = this.$assets.getCollection('suspensions');
        suspensionCollection.load();   
    
    },


    // mounted() {

    //     this.loadHabilitationFromPersonnel(this.$route.params.id); // Assurez-vous d'appeler cette méthode ici si nécessaire.
    // },
    // updated() {
    //     // Appelez la fonction createEChartsCharts à chaque mise à jour de la vue.
    //     this.createEChartsCharts();
    // },
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