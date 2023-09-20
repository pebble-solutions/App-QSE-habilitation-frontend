<template>
    <div class="list-group-item" >
        <div class="fst-italic pb-2">
             {{ question.id }} {{ question.question }} 
        </div>
        
        <QuestionStats v-if="questionStats" :stats="questionStats"/>
        
            <div v-if="questionStats.personnel">
                <div v-for="personnel in questionStats.personnel" :key="personnel.id">

                    <pre>
                        {{ personnel }}
                    </pre>
                </div>
            </div>
           
        
        <div class="row">
            <div class="col-12 col-lg-4">
                <span>Total des agents :</span>
                <span class="ms-2">{{ questionStats.global.nbResults }}</span>
                
            </div>
            <div class="col">

                <div class="progress progress-ht">
                    <div class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">{{ questionStats.global.S }}</div>
                    <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">{{ questionStats.global.A }}</div>
                    <div class="progress-bar bg-warning" role="progressbar" style="width: 25%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">{{ questionStats.global.M }}</div>
                    <div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">{{ questionStats.global.I }}</div>
                </div>
            </div>
            
        </div>
       
 
    </div>
</template>

<script>
import QuestionStats from './QuestionStats.vue';

export default {
    components: { QuestionStats },

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