<template>
    <div class="row mt-2">

        <div class="col-12 col-lg-4">
            <div class="d-flex align-items-center mb-2" :class="className">
                <LastControlAndResult v-if="personnelLastResultDate" :date="personnelLastResultDate" :value="personnelLastResult"/>
                <!-- <LastControlAndTextResult v-else :date="personnelLastResultDate" :value="personnelLastResult" /> -->
            </div>
        </div>
    
        <div class="col-12 col-lg-8" v-if="personnelStatsAverage">
            <JaugeSami :personnalAverage="personnelStatsAverage" :name="personnelName" :generalAverage="generalStatsAverage" />
        </div>
    </div>
        

</template>


<script>
import { mapState } from 'vuex';
import JaugeSami from '../JaugeSami.vue';
import LastControlAndResult from '../LastControlAndResult.vue';
// import LastControlAndTextResult from '../LastControlAndTextResult.vue';

export default {
    components: { JaugeSami, LastControlAndResult },

    props: {
        stats: Object
    },

    computed: {
        ...mapState(['personnels']),

        /**
         * Retourne le nom du personnel
         */
        personnelName() {
            let personnel = this.personnels.find(personnel => personnel.id == this.stats.personnel[0].id);

            if (!personnel) {
                return 'personnel non trouvé';
            }

            return personnel.cache_nom;
        },

        /**
         * Retourne la note moyenne du personnel sur la question
         */
        personnelStatsAverage() {
            if(this.stats.personnel.length){
                return this.stats.personnel[0].stats.average;
            }
            else return null;   
        },

        /**
         * Retourne la note moyenne global de la question
         */
        generalStatsAverage() {
            return this.stats.global.average;
        },

        /**
         * Retourne le dernier resultat de la question par le personnel
         */
        personnelLastResult() {
            if(this.stats.personnel.length) {
                return this.stats.personnel[0].stats.lastResult;    
            }
            else return null;
        },

        /**
         * Retourne la date du dernier resultat de la question par le personnel
         */
        personnelLastResultDate() {
            if(!this.stats.personnel.length) {
                return null;
            }
            else {
                let date = this.stats.personnel[0].stats.lastResultDate;
                return date;    
            }

        },

        /**
         * return un nom de classe en fonction si la moyenne du personnel est renseigné ou pas
         */
        className() {
            if (this.personnelStatsAverage == null) {
                return 'justify-content-start';
            }

            return 'justify-content-between';
        },

        /**
         * Boolean en fonction si la reponse moyenne du personnel est null ou pas
         */
        textDisplayClass() {
            if (this.personnelStatsAverage == null) {
                return true;
            }

            return false;
        }
    }
};
</script>
  