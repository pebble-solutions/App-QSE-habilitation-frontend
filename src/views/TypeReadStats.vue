
<template>
    <AppModal
    title="STATS"
    size="lg"
    @modal-hide="routeToParent()">
    <div v-if="!pending.formulaireStats && !pending.groupsAndQuestions && !pending.agent && !pending.controle">
        <StatsQuestionControlleByHabilitation :stats="stats" :groups-and-questions="groupsAndQuestions"/>
    </div>
    <div v-else>Chargement...</div>
    
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
     * Retourne a la vue précédente
     */
     routeToParent() {
        this.$router.back()
    },
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

        this.$app.api.get(`v2/information-groupe/${formulaireId}/stats`, {
            "personnel_ids": personnelId
        }).then((data) => {
            console.log(data, 'data  formulaire stats')
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
            console.log(data, 'data groups and questions')
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
     * charge les stats du formulaire
     */
    console.log(this.$route.params.idAgent  ,this.$route.params.idForm, 'agent puis formulaire')
    this.loadFormulaireStats(this.$route.params.idAgent  ,this.$route.params.idForm);
    this.getGroupsAndQuestions(this.$route.params.idForm);
},

};

</script>