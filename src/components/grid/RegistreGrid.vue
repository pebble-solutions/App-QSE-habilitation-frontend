<template>

    <div class="position-relative border-bottom border-secondary" :style="{height : tableHeightPx, width : tableWidthPx}">

        <div class="table-grid" :style="{width : tableWidthPx}">
            <div v-for="n in gridRows" class="table-row border border-secondary" :key="n" :style="{ top: getTopPositionHabilitation(n, 'px', 1), width: grid.firstColumnWidth + 'px'}"></div>
            <div v-for="n in infoGridRows" class="table-row border border-secondary" :key="n" :style="{ top: getTopPosition(n, 'px', 1), left: grid.firstColumnWidth + 'px'}"></div>
            <div class="table-col border border-secondary" :style="{ left: grid.firstColumnWidth + 'px', width: grid.secondColumnWidth + 'px' }"></div>
            <div v-for="n in gridCols" class="table-col border border-secondary" :key="n" :style="{ left: getLeftPosition(n, 'px', 2), width: columnWidthPx}"></div>
        </div>

        <div class="table-content" :style="{width : tableWidthPx}">
            <div class="table-row-content" :style="{top: getTopPosition(1, 'px')}">
                <div class="table-header mx-2">
                    <strong>{{ headerLabel }}</strong>
                </div>
                    <div class="position-absolute text-center" 
                        :style="{ left:getLeftPosition(cols.indexOf(col) + 1, 'px'), width: columnWidthPx }"
                        style="top: 0px" 
                        v-for="col in cols" 
                        :key="col.id" >

                        <div class="mx-1" v-if="personnels.length">
                            <div class="d-flex align-items-center">
                                <div class="me-1">
                                    <UserImage :name="col.cache_nom" />
                                </div>
                                <h5 class="fs-5">{{ personnelName(col) }}</h5>
                            </div>
                        </div>

                </div>
            </div>

            <slot></slot>
        </div>
    </div>

</template>

<style lang="scss" scoped>
@import "./grid.scss";
</style>

<script>
import { RegistreGrid } from '../../js/grid/RegistreGrid.js';
import UserImage from '../pebble-ui/UserImage.vue';

export default {
    props: {
        grid: {
            type: RegistreGrid,
            required: true
        },
        headerLabel: String,
        personnels: {
            type: Array,
            default: () => []
        },
        types: {
            type: Array,
            default: () => []
        }
    },

    components: {UserImage},

    computed: {
        /**
         * Retourne la hauteur complète du tableau en pixel
         * 
         * @return {string}
         */
        tableHeightPx() {
            return this.grid.getTableHeight("px");
        },

        /**
         * Retourne la largeur complète du tableau en pixel
         * 
         * @return {string}
         */
        tableWidthPx() {
            return this.grid.getTableWidth("px");
        },

        /**
         * Retourne la largeur de colonne en pixel
         * 
         * @return {string}
         */
        columnWidthPx() {
            return `${this.grid.columnWidth}px`;
        },

        /**
         * Retourne le nombre de lignes à tracer, incluant l'entête
         * 
         * @return {number}
         */
        gridRows() {
            return Math.trunc((this.grid.rows +1) / 2);
        },

         /**
         * Retourne le nombre de lignes à tracer, incluant l'entête
         * 
         * @return {number}
         */
        infoGridRows(){
            return Math.trunc(((this.grid.rows*10) +1) / 2);
        },

        /**
         * Retourne le nombre de colonne à tracer incluant l'entête
         * 
         * @return {number}
         */
        gridCols() {
            return Math.round(this.grid.cols +1 / 2);
        },

        cols(){
            if (this.personnels.length){
                return this.personnels;
            } else if (this.types.length){
                return this.types
            }else {
                return []
            }
        }
    },

    methods: {
        /**
         * Retourne la position d'une ligne depuis le haut du tableau
         * 
         * @param {number} n Index de la ligne
         * @param {string} sx Suffix à ajouter à la valeur (ex : "px")
         * @param {number} coef Coeficient (2 = une ligne sur deux)
         * 
         * @return {string|number}
         */
        getTopPosition(n, sx, coef) {
            return this.grid.getTopPosition(n, sx, coef);
        },

        /**
         * Retourne la position d'une ligne depuis le haut du tableau
         * 
         * @param {number} n Index de la ligne
         * @param {string} sx Suffix à ajouter à la valeur (ex : "px")
         * @param {number} coef Coeficient (2 = une ligne sur deux)
         * 
         * @return {string|number}
         */
         getTopPositionHabilitation(n, sx, coef) {
            return this.grid.getTopPositionHabilitation(n, sx, coef);
        },

        /**
         * Retourne la position d'une colonne depuis la gauche du tableau
         * 
         * @param {number} n Index de la colonne
         * @param {string} sx Suffix à ajouter à la valeur (ex : "px")
         * @param {number} coef Coeficient (2 = une colonne sur deux)
         * 
         * @return {string|number}
         */
        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        },

        /**
         * Retourne le nom du personnel d'une colonne du tableau
         * 
         * @param {object} personnel personnel de la collonne
         * 
         * @return {string}
         */
        personnelName(personnel){
            if (personnel.cache_nom) {
                const [nom, prenom] = personnel.cache_nom.split(" ");
                const nomFormate = nom.toUpperCase();
                const prenomFormate = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
                const nomFinal = `${nomFormate}\n${prenomFormate}`;

                return nomFinal
            }
            return "Aucun nom renseigné"
        }
    }
}
</script>
