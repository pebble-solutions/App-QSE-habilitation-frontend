<template>
    <div>
        <!-- Votre code existant ici -->

        <!-- Ajoutez cette section pour afficher la liste des suspensions triées -->
        <div class="row mt-4">
            <div class="card col-md-12">
                <div class="card-body">
                    <h3 class="card-title text-center mb-3">Liste des Suspensions</h3>
                    <ul class="custom-ul">
                        <!-- Triez les suspensions par ordre de dd -->
                        <li v-for="suspension in sortedSuspensions" :key="suspension.id"
                            class="d-flex justify-content-between align-items-center bg-danger rounded text-white px-3 py-2 mb-2">
                            <span>{{ getHabilitationTypeName(suspension.habilitation_type_id) }}</span>
                            <span v-if="suspension.df">{{ formatSuspensionDate(suspension.df) }}</span>
                            <span v-else>En cours</span>
                        </li>
                    </ul>
                    <p v-if="suspensions.length === 0" class="text-center text-secondary">Aucune suspension</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            pending: {
                agent: false,
            },
            habilitationFromPerso: '',
            listControlDone: ''
        };
    },

    computed: {

        ...mapState(['suspensions', 'personnels', 'habilitations', 'types',]),

    },

    async mounted() {
        const suspensionCollection = this.$assets.getCollection('suspensions');
        await suspensionCollection.load();

    },

    
}




</script>
