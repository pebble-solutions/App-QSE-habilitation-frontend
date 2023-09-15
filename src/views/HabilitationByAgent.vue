<template>
    <SuspensionsPersonnelInformations></SuspensionsPersonnelInformations>

    <!-- <div class="container text-custom p-2 mb-2">
        <h2 class="card-title text-center mb-1">Statistiques : </h2>
        <div class="row">
            <div class="col-md-6 p-3">
                <img src="../assets/chart1.png" alt="icone 1" class="img-fluid rounded shadow">
            </div>
            <div class="col-md-6 p-3">
                <img src="../assets/chart3.png" alt="icone 3" class="img-fluid rounded shadow">
            </div>
        </div>
    </div> -->

    <div class="container py-2 px-2">
        <div class="card bg-custom text-white p-4 mb-4 shadow">
            <h2 class="card-title text-center mb-3">Toutes les habilitations : </h2>
            <div class="card mb-2" v-for="hab in listHabByPersoJoinType" :key="hab.id">
                <HabMonitor :personnelHabilitation="hab" :displayHab="true" :displayAgent="false">
                </HabMonitor>
            </div>
        </div>
    </div>
</template>
  
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import SuspensionsPersonnelInformations from './SuspensionsPersonnelInformations.vue';
import HabMonitor from '../components/HabMonitor.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';

export default {
    components: { SuspensionsPersonnelInformations, HabMonitor },

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
                if (this.listHabByPersoJoinType[i].configVeille.id) {
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
                    console.log(this.listHabByPersoJoinType[i].configVeille.id, "pas de config veille id");
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
  