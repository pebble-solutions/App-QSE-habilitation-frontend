<template>

    <div class="position-relative border-bottom border-secondary" :style="{height : tableHeightPx, width : tableWidthPx}">

        <div class="table-grid" :style="{width : tableWidthPx}">
            <div v-for="n in gridRows" class="table-row border border-secondary" :key="n" :style="{ top: getTopPosition(n, 'px', 2) }"></div>
            <div v-for="n in gridCols" class="table-col border border-secondary" :key="n" :style="{ left: getLeftPosition(n, 'px', 2) }"></div>
        </div>

        <div class="table-content" :style="{width : tableWidthPx}">
            <div class="table-row-content" :style="{top: getTopPosition(1, 'px')}">
                <div class="table-header mx-2">
                    <strong>{{ headerLabel }}</strong>
                </div>
                <div class="position-absolute text-center" 
                    :style="{ left:callGetLeftPosition(col, 'px'), width: columnWidthPx }"
                    style="top: 0px" 
                    v-for="col in cols" 
                    :key="col.id" >

                    <UserImage :name="col.cache_nom" v-if="personnels.length"/>

                    <!-- <div v-if="personnels.length">
                        <div class="d-flex align-items-center my-2 mx-2">
                            <div class="me-2">
                                <UserImage :name="col.cache_nom" />
                            </div>
                            <h3 class="my-0 fs-5">{{ col.cache_nom }}</h3>
                        </div>
                    </div> -->

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
import { WeeksGrid } from '../../js/grid/WeeksGrid';
import UserImage from '../pebble-ui/UserImage.vue';

export default {
    props: {
        grid: {
            type: WeeksGrid, // Assurez-vous que WeeksGrid est bien un objet si c'est le cas
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
         * Retourne le nombre de colonne à tracer incluant l'entête
         * 
         * @return {number}
         */
        gridCols() {
            return Math.round(this.cols.length / 2);
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

        callGetLeftPosition(item, sx, coef){
            let n = this.cols.indexOf(item);
            return this.grid.getLeftPosition(n,sx,coef)
        }
    }
}
</script>
