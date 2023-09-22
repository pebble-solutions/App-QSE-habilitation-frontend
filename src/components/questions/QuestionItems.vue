<template>
    <div class="list-group-item" >
        <div class="fst-italic pb-2 fs-5">
            <span>{{ question.question }}</span>
            <span class="fw-lighter ms-2 fs-6">#{{ question.id }}</span>
        </div>
        
        <!-- composant dernière réponse et stats -->
        <QuestionStats v-if="questionStats" :stats="questionStats"/>
        <!-- composant pour réponse de l'agent -->
        <div v-if="questionStats.personnel.length">
            <div v-for="personnel in questionStats.personnel" :key="personnel.id">
                <ResultProgressBar v-if="personnel" :questionStats="personnel.stats"></ResultProgressBar>
            </div>
        </div>
        <div v-else>Pas de Statistiques pour l'agent {{ questionStats.personnel }}</div>
        <!-- composants pour total des réponses -->
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