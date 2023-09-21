<template>
    <div class="list-group-item" >
        <div class="fst-italic pb-2">
             {{ question.id }} {{ question.question }} 
        </div>
        <QuestionStats v-if="questionStats" :stats="questionStats"/>
            <!-- partie commentée en attendant correction des données serveur -->
            <!-- <div v-if="questionStats.personnel.length">
            <div v-for="personnel in questionStats.personnel" :key="personnel.id">
            <ResultProgressBar v-if="personnel" :questionStats="personnel.stats"></ResultProgressBar>
            </div>
            </div> -->
        <div v-else>Pas de Statistiques pour l'agent {{ questionStats.personnel }}</div>
        <!-- composants total des réponses -->
        <ResultProgressBar v-if="questionStats.global" :questionStats="questionStats.global"/>
    </div>
</template>

<script>
import ResultProgressBar from '../ResultProgressBar.vue';
import QuestionStats from './QuestionStats.vue';


export default {
    components: { QuestionStats, ResultProgressBar },
    
       

    props: {
        question: Object,
        stats: Object
    },

    computed: {
        /**
         * Retourne les stats qui correspond a la question
         * 
         * @return {object}
         */
        questionStats() {
            let questionStats = this.stats.questions.find(qs => qs.id == this.question.id);
           
            return questionStats;   
        }
    },

}
</script>