<template>

    <!-- Première ligne -->

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 1, 'px')  }"
            >
            <span>{{dateDebutTotal()}}</span>
        </div>
    </div>
    <!-- Fin première ligne -->

    <!-- Deuxième ligne -->

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 2, 'px')  }"
            >
            <span>{{dateFinTotal()}}</span>
        </div>
    </div>
    <!-- Fin Deuxième ligne -->

    <!-- Troisième ligne -->

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 3, 'px')  }"
            >
            <span>{{lastControlResultTotal()}}</span>
        </div>
    </div>
    <!-- Fin Troisième ligne -->

     <!-- Sixieme ligne -->

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 6, 'px')  }"
            >
            <span>{{labelSuspensionsTotal}}</span>
        </div>
    </div>
    <!-- Fin Sixieme ligne -->

    <!-- Septième ligne -->
  
    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 7, 'px')  }"
            >
            <span>{{labelSuspensionsCommentaireTotal}}</span>
        </div>
    </div>
    <!-- Fin Septième ligne -->

    <!-- Neuvième ligne -->

    <div class="position-absolute text-center">
        <div class="table-row-content mt-2"
            :style="{ left: getLeftPosition(personnelsSize + 1, 'px'), width: columnWidthPx, top: getTopPosition((rowIndex * 10) + 9, 'px')  }"
            >
            <span>{{labelSuspensionsDureeTotal}}</span>
        </div>
    </div>
    <!-- Fin Neuvième ligne -->

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
</style>

<script>
import { RegistreGrid } from '../../js/grid/RegistreGrid';
import {getDisplayFormatedDate, daysToYearMonthDay, diffDate} from '../../js/date';
import { classNameFromSAMI } from '../../js/collecte'

export default {
    props: {
        rowIndex: Number,
        grid: RegistreGrid,
        personnelsSize: Number,
        suspensionsTotal: Array
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
         * Obtient le label des suspensions totales.
         * 
         * @param {number} suspensionsTotal - Le nombre total de suspensions.
         * @return {string} Le label des suspensions totales.
         */
        labelSuspensionsTotal() {
            let nbSuspenssion = this.suspensionsTotal.length;
            if (nbSuspenssion === 0) {
                return "Aucune suspension";
            } else if (nbSuspenssion === 1) {
                return "1 suspension";
            } else {
                return nbSuspenssion + " suspensions";
            }
        },

        /**
         * Obtient le label du nombre total de commentaires pour les suspensions.
         * 
         * @return {string} Le label du nombre total de commentaires.
         */
        labelSuspensionsCommentaireTotal() {
            const count = this.suspensionsTotal.filter(sus => sus.commentaire).length;

            if (count === 0) {
                return "Aucun commentaire";
            } else if (count === 1) {
                return "1 commentaire";
            } else {
                return count + " commentaires";
            }
        },

        // labelSuspensionsDureeTotal(){
        //     if (this.suspensionsTotal.length != 0){
        //         let countDiffDate = 0;
        //         for (let suspension of this.suspensionsTotal) {
        //             countDiffDate = countDiffDate + diffDate(suspension.dd, suspension.df, 'day');
        //         }
        //         return daysToYearMonthDay(countDiffDate)
        //     }
        //     return ""
        // }

        /**
         * Obtient le label de la durée totale des suspensions.
         * 
         * @return {string} Le label de la durée totale des suspensions au format "Année(s) Mois Jour(s)".
         */
        labelSuspensionsDureeTotal() {
            if (this.suspensionsTotal.length === 0) {
                return "";
            }

            const totalDurationInDays = this.suspensionsTotal.reduce((acc, suspension) => {
                const durationInDays = diffDate(suspension.dd, suspension.df, 'day');
                return acc + durationInDays;
            }, 0);

            return daysToYearMonthDay(totalDurationInDays);
        }



    },

    methods: {
        getTopPosition(n, sx, coef){
            return this.grid.getTopPosition(n, sx, coef);
        },

        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        },

        displayDate(date){
            return getDisplayFormatedDate(date)
        },

        /**
         * Retourne le nom de la classe CSS en fonction du résultat SAMI du contrôle
         * 
         * @return {string}
         */
        SAMIClassName(result_sami) {
            return classNameFromSAMI(result_sami);
        },


        // TOTAL

        dateDebutTotal(){
            return "Total"
        },

        dateFinTotal(){
            return "Total"
        },
        lastControlResultTotal(){
            return "S"
        },
    }
}
</script>
