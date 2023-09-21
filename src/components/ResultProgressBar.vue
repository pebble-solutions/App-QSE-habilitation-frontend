<template>

    <div class="row mt-2">
            <div class="col-12 col-lg-4 mb-3">
                <span v-if="questionStats.personnelId">agent {{ questionStats.personnelId }}  <span class="ms-2">{{ questionStats.nbResults }}réponse</span></span>
                <span v-else>tous les agents:<span class="mx-2 fw-bold">{{ questionStats.nbResults }}</span>réponses</span>
            </div>
            <div class="col-12 col-lg-8">

                <div class="progress progress-ht">
                    <div class="progress-bar bg-success" role="progressbar" :style="getProgressBarWidth(questionStats.S, questionStats.nbResults)" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">{{ questionStats.S }}</div>
                    <div class="progress-bar" role="progressbar"  :style="getProgressBarWidth(questionStats.A, questionStats.nbResults)" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">{{ questionStats.A }}</div>
                    <div class="progress-bar bg-warning" role="progressbar" :style="getProgressBarWidth(questionStats.M, questionStats.nbResults)" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">{{ questionStats.M }}</div>
                    <div class="progress-bar bg-danger" role="progressbar" :style="getProgressBarWidth(questionStats.I, questionStats.nbResults)" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">{{ questionStats.I }}</div>
                </div>
            </div>
            
        </div>
</template>
<script>
export default {
    props: {
        questionStats: Object
    },

    methods: {
        /**
         * Retourne l'attribut style de  la progress bar
         * 
         * @param {number} valueW - Valeur particulière des réponses à la question
         * @param {number} valueT - Valeur totale des réponses à la question
         * 
         * @returns {string} - valeur de l'attribut style
         */
        getProgressBarWidth(valueW, valueT) {
            const clampedValue = Math.round((valueW/valueT) * 100)+'%';
            return 'width:'+clampedValue;
        }
    }
}
</script>