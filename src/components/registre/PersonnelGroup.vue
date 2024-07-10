<template>
        <div class="my-3">
        <RegistreGridVue
            :grid="grid"
            headerLabel="Habilitations"
            :personnels="personnels"
            v-if="grid">

            <habilitation-personnel-row
                :grid="grid"
                :rowIndex="index"
                :rowLabel="habilitationType.nom"
                :habilitationsPersonnels="habilitationsPersonnel"
                :personnels="personnels"
                :habilitationType="habilitationType"
                
                v-for="(habilitationType, index) in habilitationsTypes"
                :key="index" />

        </RegistreGridVue>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { RegistreGrid } from '../../js/grid/RegistreGrid.js';
import RegistreGridVue from '../grid/RegistreGrid.vue';
import HabilitationPersonnelRow from './HabilitationPersonnelRow.vue';

export default {

    props:{
        personnels: Array,
        habilitationsTypes: Array,
        habilitationsPersonnel: Array,
    },

    data() {
		return {
            size : 200,
            firstColumnWidth: 200,
            firstColumnHeight: 500,
            secondColumnWidth: 220,
            row: 50,
            grid: null
		}
	},

    components: { RegistreGridVue, HabilitationPersonnelRow},

    computed: {
        ...mapState(['echeancier']),

        /**
         * Retourne la liste des habilitation utilisées par le personnel
         */
        usedHabilitationsTypes() {
            let habilitationsTypes = [];

            this.habilitationsPersonnel.forEach((habilitationPersonnel) => {
                const found = this.habilitationsTypes.find(e => e.id == habilitationPersonnel.characteristic_id);

                if (!found) {
                    const habilitationType = this.getHabilitationById(habilitationPersonnel.characteristic_id); 
                    habilitationsTypes.push(habilitationType ? habilitationType : {
                        id: habilitationPersonnel.characteristic_id,
                        nom: "!Habilitation " + habilitationPersonnel.characteristic_id + " inconnue"
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
         * Initialise la grille d'affichage
         */
        initGrid() {
            this.grid = new RegistreGrid({
                columnWidth: this.size,
                rowHeight: this.row,
                secondColumnWidth: this.secondColumnWidth,
                firstColumnWidth: this.firstColumnWidth,
                firstColumnHeight : this.firstColumnHeight,
                rows: this.habilitationsTypes.length + 1,
                cols: this.personnels.length
            });
        }

    },

    mounted() {
        this.initGrid();
    }
}

</script>
