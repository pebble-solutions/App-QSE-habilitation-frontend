
<template>
        <AppModal
        title="STATS"
        size="lg">
        <div v-if="!pending.formulaireStats && !pending.groupsAndQuestions && !pending.agent && !pending.controle">
            <StatsQuestionControlleByHabilitation :stats="stats" :groups-and-questions="groupsAndQuestions"/>
        </div>
        <div v-else>Chargement...</div>
        <!-- Stats :{{ stats }} -->
        <!-- <pre>
            {{ groupsAndQuestions }}
        </pre> -->
        </AppModal>
</template>
<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
import StatsQuestionControlleByHabilitation from '../components/StatsQuestionControlleByHabilitation.vue';  

export default {
    components: { AppModal, StatsQuestionControlleByHabilitation},

    data() {
        return {
            pending: {
                formulaireStats: false,
                groupsAndQuestions: false,
            },
            stats: null,
            groupsAndQuestions: null,
            
        }
    },

    methods: {
        /**
         * Retourne les stats qui correspond a la question
         * 
         * @return {object}
         */
        questionStats() {
            let questionStats = this.stats.questions.find(qs => qs.id == this.question.id);
            return questionStats;
        },

        /**
         * recupere les stats du formulaire
         * @param {number} id id du formulaire
         * @returns {object}
         */
         loadFormulaireStats(personnelId , formulaireId) {
            this.pending.formulaireStats = true;

            console.log(formulaireId);

            this.$app.api.get(`v2/information-groupe/${formulaireId}/stats`, {
                "personnel_ids": personnelId
            }).then((data) => {
                console.log(data, 'stats')
                this.stats = data;
            }).catch(this.$app.catchError).finally(() => this.pending.formulaireStats = false);
        },
        /**
         * Récupere les blocs et question (ligne) du formulaire
         * 
         * @param {number} formulaireId ID du formulaire
         * 
         * @return {proxy}
         */
         getGroupsAndQuestions(formulaireId) {
            this.pending.groupsAndQuestions = true;

            this.$app.api.get(`v2/information-groupe/${formulaireId}`, {
                blocsandlignes: 1,
                ppp: "private"
            }).then((data) => {
                console.log(data, 'groupsAndQuestions');
                this.groupsAndQuestions = data;
            }).catch(this.$app.catchError).finally(() => this.pending.groupsAndQuestions = false);
        },
    },

    // /**
    //  * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
    //  */
    //  beforeRouteUpdate(to) {
    //     if (to.params.id != this.currentPersonnel.id) {
    //         this.loadHabilitationFromPersonnel(to.params.id);
    //         //this.resetStats();
    //     }
    // },

    beforeMount() {
        /**
         * charge 
         */
        this.loadFormulaireStats(this.$route.params.id  ,this.$route.params.idForm);
        this.getGroupsAndQuestions(this.$route.params.idForm);
    },
    
};

</script>