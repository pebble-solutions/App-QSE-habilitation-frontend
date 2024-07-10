<template>

    <!-- Première ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{
                'backgroudFalse': !habilitationStartDate,
                'mt-2' : habilitationStartDate
            }"
            :style="{ 
                left: habilitationStartDate ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                width: habilitationStartDate ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                top: habilitationStartDate ? getTopPosition((rowIndex * 10) + 1, 'px') : getTopPosition((rowIndex * 10) + 1) + 1 + 'px',
                height : !habilitationStartDate ? grid.rowHeight - 2 + 'px' : grid.rowHeight  
            }">
            <span v-if="habilitationStartDate">{{ displayDate(habilitationStartDate) }}</span>
        </div>
    </div>
    <!-- Fin première ligne -->

    <!-- Deuxième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{
                'backgroudFalse': !habilitationEndDate,
                'mt-2' : habilitationEndDate
            }"
            :style="{ 
                left: habilitationEndDate ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                width: habilitationEndDate ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                top: habilitationEndDate ? getTopPosition((rowIndex * 10) + 2, 'px') : getTopPosition((rowIndex * 10) + 2) + 1 + 'px', 
                height : !habilitationEndDate ? grid.rowHeight - 2 + 'px' : grid.rowHeight  
            }" >
            <span v-if="habilitationEndDate">{{ displayDate(habilitationEndDate) }}</span>
        </div>
    </div>
    <!-- Fin Deuxième ligne -->

    <!-- Troisième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
                :class="{
                    'backgroudFalse': !habilitationLastControlResult && !habilitationStartDate,
                    'mt-2': habilitationStartDate && !habilitationLastControlResult
                }"
                :style="{ 
                    left: habilitationLastControlResult ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                    width: habilitationLastControlResult ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                    top: habilitationLastControlResult ? getTopPosition((rowIndex * 10) + 3, 'px'):  getTopPosition((rowIndex * 10) + 3) + 'px', 
                    height : !habilitationLastControlResult && !habilitationStartDate ? grid.rowHeight - 2 + 'px' : grid.rowHeight 
                }" >

            <span class="control-result-item rounded m-1" 
                :class="[SAMIClassName(habilitationLastControlResult)]" 
                :title="'Contrôlé le : aucune idée je n\'ai pas les données'"
                v-if="habilitationLastControlResult" >
                {{ habilitationLastControlResult }}
            </span>
            <span v-else-if="habilitationStartDate && !habilitationLastControlResult">Aucun contrôle</span>
        </div>
    </div>
    <!-- Fin Troisième ligne -->

    <!-- Sixieme ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{'mt-2': !suspensionsPersonnels.length}"
            :style="{ 
                left: getLeftPosition(personnelIndex + 1, 'px'), 
                width: columnWidthPx, 
                top: getTopPosition((rowIndex * 10) + 6, 'px'), 
                background : styleSuspensions
            }" >

            <!-- <span v-if="suspensionsPersonnels.length" class="with-top-margin">Suspendu</span> -->
            <div v-if="suspensionsPersonnels.length" class="with-top-margin">
                <span>Suspendu</span>
            </div>
        </div>
    </div>
    <!-- Fin Sixieme ligne -->

    <!-- Septième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{
                'backgroudFalse': !suspensionsPersonnels.length,
                'mt-2' : suspensionsPersonnels.length
            }"
            :style="{ 
                left: suspensionsPersonnels.length ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                width: suspensionsPersonnels.length ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                top: suspensionsPersonnels.length ? getTopPosition((rowIndex * 10) + 7, 'px') : getTopPosition((rowIndex * 10) + 7) + 1 + 'px',
                height : suspensionsPersonnels.length ? grid.rowHeight : grid.rowHeight - 2 + 'px'
            }">

            <span v-if="suspensionsPersonnels.length">{{ suspensionsPersonnels[0].commentaire }}</span>
        </div>
    </div>
    <!-- Fin Septième ligne -->

    <!-- Huitième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{
                'backgroudFalse': !suspensionsPersonnels.length,
                'mt-2' : suspensionsPersonnels.length
            }"
            :style="{ 
                left: suspensionsPersonnels.length ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                width: suspensionsPersonnels.length ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                top: suspensionsPersonnels.length ? getTopPosition((rowIndex * 10) + 8, 'px') : getTopPosition((rowIndex * 10) + 8) + 1 + 'px',
                height : suspensionsPersonnels.length ? grid.rowHeight : grid.rowHeight - 2 + 'px'
            }">
            <span v-if="suspensionsPersonnels.length">{{ displayDateSuspensions(suspensionsPersonnels[0]) }}</span>
        </div>
    </div>
    <!-- Fin Huitième ligne -->

    <!-- Neuvième ligne -->
    <div class="position-absolute text-center">
        <div class="table-row-content"
            :class="{
                'backgroudFalse': !suspensionsPersonnels.length,
                'mt-2' : suspensionsPersonnels.length
            }"
            :style="{ 
                left: suspensionsPersonnels.length ? getLeftPosition(personnelIndex + 1, 'px') : getLeftPosition(personnelIndex + 1) + 2 + 'px', 
                width: suspensionsPersonnels.length ? columnWidthPx : grid.columnWidth - 4 + 'px', 
                top: suspensionsPersonnels.length ? getTopPosition((rowIndex * 10) + 9, 'px') : getTopPosition((rowIndex * 10) + 9) + 1 + 'px',
                height : suspensionsPersonnels.length ? grid.rowHeight : grid.rowHeight - 2 + 'px'
            }">
                <span v-if="suspensionsPersonnels.length">{{ displayDureeSuspension(suspensionsPersonnels[0]) }}</span>
        </div>
    </div>
    <!-- Fin Neuvième ligne -->

     <!-- Dixième ligne -->
     <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ 
                left:   getLeftPosition(personnelIndex + 1, 'px'), 
                width:  columnWidthPx , 
                top:    getTopPosition((rowIndex * 10) + 10, 'px'),
            }">
                <span class="text-success"> VA : 18 avr. 2023 > 18 avr. 2025</span>
                <span> & </span>
                <span class="text-danger"> EP : 18 avr. 2022 > 18 avr. 2024</span>
        </div>
    </div>
    <!-- Fin Dixième ligne -->

</template>

<style lang="scss" scoped>
@import "../grid/grid.scss";

.control-result-item {
    position: absolute;
    z-index: 2;
    width: 40px;
    line-height: 40px;
    height: 40px;
    text-align:center;
    left : 80px;
    top:0px;
}

.with-top-margin {
  margin-top: 10px; /* Ajoutez ici la valeur du décalage top souhaité */
}

</style>

<script>
import { RegistreGrid } from '../../js/grid/RegistreGrid';
import {getDisplayFormatedDate, daysToYearMonthDay, diffDate} from '../../js/date';
import { classNameFromSAMI } from '../../js/collecte'

export default {
    props: {
        rowIndex: Number,
        habilitationsPersonnels: Array,
        suspensionsPersonnels: Array,
        grid: RegistreGrid,
        personnelIndex: Number
    },

    data() {
        return {
            habilitationStartDate: this.habilitationsPersonnels[0]?.dd || null,
            habilitationEndDate: this.habilitationsPersonnels[0]?.df || null,
            habilitationLastControlResult: this.habilitationsPersonnels[0]?.last_control_result || null,
        };
    },

    computed: {
        /**
         * Retourne la largeur de colonne en pixel
         * 
         * @return {string}
         */
         columnWidthPx() {
            return `${this.grid.columnWidth}px`;
        },

        /**
         * Obtient le style CSS pour les suspensions du personnel.
         * 
         * @return {string|null} Style CSS à appliquer ou null si aucune suspension.
         */
        styleSuspensions() {
            return this.suspensionsPersonnels.length ? "red" : null;
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
         * Retourne la date pour qu'elle soit affichable lisiblement : 2 fevr. 2023
         * 
         * @param {string|date} date 
         * 
         * @return {string}
         */
        displayDate(date){
            return getDisplayFormatedDate(date)
        },

        /**
         * Retourne le label date_de_debut > date_de_fin pour qu'elle soit affichable lisiblement : 2 fevr. 2023 > 2 sept. 2023
         * 
         * @param {object} suspension 
         * 
         * @return {string}
         */
        displayDateSuspensions(suspension){
            return this.displayDate(suspension.dd) + " > " + this.displayDate(suspension.df)
        },

        displayDureeSuspension(suspension){
            return daysToYearMonthDay(diffDate(suspension.dd, suspension.df, 'day'))
        },

        /**
         * Retourne le nom de la classe CSS en fonction du résultat SAMI du contrôle
         * 
         * @return {string}
         */
        SAMIClassName(result_sami) {
            return classNameFromSAMI(result_sami);
        }

    }
}
</script>
