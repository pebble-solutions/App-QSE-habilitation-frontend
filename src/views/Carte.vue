<template>
    <section class="my-1">
        <PersonnalInfo>{structure_personnel_info}</PersonnalInfo>
    </section>
    <section class="my-1">
        <ContractDetail>{contract_personnel_détails}</ContractDetail>
    </section>
    <section class="my-1">
        <PersonnalSkills>{personne_physique_aptitudes}</PersonnalSkills>  
    </section>
    <section class="my-1">
        <OngoingHabilitation></OngoingHabilitation>
    </section>
    <section claas="my-1">
        <SuspendedHabilitation></SuspendedHabilitation>
    </section>
    <section class="my-1">
        <Emergency></Emergency>
    </section>
</template>


<script>
import ContractDetail from '../components/ContractDetail.vue';
import OngoingHabilitation from '../components/OngoingHabilitation';
import SuspendedHabilitation from '../components/SuspendedHabilitation';
import PersonnalSkills from '../components/PersonnalSkills';
import PersonnalInfo from '../components/PersonnalInfo.vue';
import Emergency  from '../components/Emergency';
export default {
    components: {ContractDetail, OngoingHabilitation, SuspendedHabilitation, PersonnalSkills,PersonnalInfo, Emergency},
    data() {
        return {
            cfg: null
        }
    },

    beforeMount() {
        this.cfg = this.$app.cfg;
    }
}
</script>