<template>
        <div class="my-3">
        <RegistreGrid
            :grid="grid"
            headerLabel="Habilitations"
            :personnels="personnels"
            v-if="grid">

            <habilitation-personnel-row
                :grid="grid"
                :rowIndex="index"
                :rowLabel="habilitationType.nom"
                :habilitationsPersonnels="getHabilitationsPersonnelByTypeId(habilitationType.id)"
                :habilitationType="habilitationType"
                
                v-for="(habilitationType, index) in usedHabilitationsTypes"
                :key="index" />

        </RegistreGrid>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { WeeksGrid } from '../../js/grid/WeeksGrid';
import RegistreGrid from '../grid/RegistreGrid.vue';
import HabilitationPersonnelRow from './HabilitationPersonnelRow.vue';

export default {

    props:{
        personnels: Array,
        habilitationsTypes: Array,
        habilitationsPersonnel: Array,
    },

    data() {
		return {
			// size : 50,
            size : 50,
            firstColumnWidth: 200,
            grid: null
		}
	},

    components: { RegistreGrid, HabilitationPersonnelRow},

    computed: {
        ...mapState(['echeancier']),

        /**
         * Retourne la liste des habilitation utilisées par le personnel
         */
        usedHabilitationsTypes() {
            let habilitationsTypes = [];

            this.habilitationsPersonnel.forEach((habilitationPersonnel) => {
                const found = habilitationsTypes.find(e => e.id == habilitationPersonnel.characteristic_id);

                if (!found) {
                    const habilitationType = this.getHabilitationById(habilitationPersonnel.characteristic_id); 
                    habilitationsTypes.push(habilitationType ? habilitationType : {
                        id: habilitationPersonnel.characteristic_id,
                        nom: "!Habilitation "+habilitationPersonnel.characteristic_id+" inconnue"
                    });
                }
            });

            return habilitationsTypes;
        },
    },

    methods: {
        /**
         * Retourne une habilitation par son ID
         * 
         * @param {number} id ID de l'habilitation à trouver
         * 
         * @return {object}
         */
        getHabilitationById(id) {
            return this.habilitationsTypes.find(e => e.id == id);
        },

        /**
         * Retrourne la liste des habilitations du personnel pour un type donné.
         * 
         * @param {number} characteristicId L'ID de la caractéristique à trouver
         * 
         * @return {array}
         */
        getHabilitationsPersonnelByTypeId(characteristicId, personnelId) {
            if (personnelId){
                this.habilitationsPersonnel.filter(e => e.personnel_id == personnelId);
            }
            return this.habilitationsPersonnel.filter(e => e.characteristic_id == characteristicId);
        },

        /**
         * Initialise la grille d'affichage
         */
        initGrid() {
            this.grid = new WeeksGrid({
                columnWidth: this.size,
                rowHeight: this.row,
                firstColumnWidth: this.firstColumnWidth,
                rows: this.usedHabilitationsTypes.length + 1
            });
        }
    },

    mounted() {
        this.initGrid();
    }
}

</script>
