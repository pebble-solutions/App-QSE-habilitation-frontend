<template>

    <!-- Première ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelIndex + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 2, 'px')  }"
            >
            <span>{{ displayDate(habilitationsPersonnels[0].dd) }}</span>
        </div>
    </div>

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 2, 'px')  }"
            >
            <span>{{dateDebutTotal()}}</span>
        </div>
    </div>
    <!-- Fin première ligne -->

    <!-- Deuxième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelIndex + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 3, 'px')  }"
            >
            <span>{{ displayDate(habilitationsPersonnels[0].df) }}</span>
        </div>
    </div>

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 3, 'px')  }"
            >
            <span>{{dateFinTotal()}}</span>
        </div>
    </div>
    <!-- Fin Deuxième ligne -->

</template>

<style lang="scss" scoped>
@import "../grid/grid.scss";
</style>

<script>
import { RegistreGrid } from '../../js/grid/RegistreGrid';
import {getDisplayFormatedDate} from '../../js/date'

export default {
    props: {
        rowIndex: Number,
        habilitationsPersonnels: Array,
        grid: RegistreGrid,
        personnelIndex: Number,
        personnelsSize: Number
    },

    computed: {
        /**
         * Retourne la largeur de colonne en pixel
         * 
         * @return {string}
         */
         columnWidthPx() {
            return `${this.grid.columnWidth}px`;
        }
    },

    methods: {
        getTopPosition(n, sx, coef){
            return this.grid.getTopPosition(n, sx, coef);
        },

        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        },

        /**
         * Retrourne la liste des habilitations du personnel pour un type donné.
         * 
         * @param {number} characteristicId L'ID de la caractéristique à trouver
         * @param {number} personnelId L'ID du personnel à trouver
         * 
         * @return {array}
         */
         getHabilitationsPersonnelByTypeId(characteristicId, personnelId) {
            if (personnelId){
                this.habilitationsPersonnels.filter(e => e.personnel_id == personnelId);
            }
            return this.habilitationsPersonnels.filter(e => e.characteristic_id == characteristicId);
        },

        displayDate(date){
            return getDisplayFormatedDate(date)
        },



        // TOTAL

        dateDebutTotal(){
            return "Total"
        },

        dateFinTotal(){
            return "Total"
        }
    }
}
</script>
