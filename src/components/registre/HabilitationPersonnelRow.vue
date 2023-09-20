<template>
    <div class="table-row-content" :style="{ top: getTopPositionHabilitation(rowIndex + 2, 'px') }">
        <div class="table-header mx-2 fs-7" :title="rowLabel">

            <div class="d-flex align-items-center align-self-center">
                <div class="me-2" v-if="useUserImage">
                    <UserImage :name="rowLabel" />
                </div>
                <span :class="labelClassName">
                    <i class="bi" :class="labelIcon" v-if="labelIcon"></i>
                    {{ displayRowLabel }}
                </span>
            </div>
        </div>
    </div>
    <div class="position-absolute text-center" :style="{ width: grid.secondColumnWidth + 'px' }">
        <div
            class="table-row-content mt-2"
            v-for="item in items"
            :key="item.key"
            :style="{ top: getTopPosition(rowIndex*10 + item.key +1, 'px'), left: grid.firstColumnWidth + 'px' }"
            >

            <span>{{ item.label }}</span>
        </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../grid/grid.scss";
</style>

<script>
// import { diffDate } from '../../js/date';
import UserImage from '../pebble-ui/UserImage.vue';
import { RegistreGrid } from '../../js/grid/RegistreGrid';
// import { getSelfDateEnd, getSelfDateStart } from '../../js/contrat';

export default {
    components: { UserImage },
    props: {
        rowIndex: Number,
        habilitationType: Object,
        habilitationsPersonnels: Array,
        personnel: Object,
        rowLabel: String,
        grid: RegistreGrid,
        useUserImage: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            items: [
                { key: 1, label: 'Date de début' },
                { key: 2, label: 'Date de fin' },
                { key: 3, label: 'Dernière Date' },
                { key: 4, label: 'Note Moyenne' },
                { key: 5, label: 'Date prochain KN' },
                { key: 6, label: 'Suspension' },
                { key: 7, label: 'Motif' },
                { key: 8, label: 'Date' },
                { key: 9, label: 'Durée' },
                { key: 10, label: 'VA et VP' },
            ],
        };
    },

    computed: {
        /**
         * Retourne une version nettoyée et réduite du libellé de ligne
         * 
         * @return {string}
         */
        displayRowLabel() {
            const maxlen = this.useUserImage ? 18 : 25;
            let label = this.rowLabel.replace(/^Habilitation\s*:\s*/, "");
            label = label.replace(/^!/, "");

            if (label.length > maxlen) {
                label = label.substring(0, maxlen - 1) + "...";
            }

            return label;
        },

        /**
         * Classe CSS du libellé de ligne.
         * Le libellé est affiché en rouge lorsqu'il commencer par le caractère "!"
         * 
         * @return {string}
         */
        labelClassName() {
            return this.rowLabel.match(/^!/) ? "text-danger" : "";
        },

        /**
         * Icone du libellé de ligne
         * Le libellé prend un point d'esclamation lorsqu'il commence par le caractère "!"
         */
        labelIcon() {
            return this.rowLabel.match(/^!/) ? "bi-exclamation-triangle-fill" : "";
        }
    },

    methods: {
        getTopPosition(n, sx, coef){
            return this.grid.getTopPosition(n, sx, coef);
        },

        getTopPositionHabilitation(n, sx, coef) {
            return this.grid.getTopPositionHabilitation(n, sx, coef);
        },

        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        },

        getWeekStartInTimeline(refDd) {
            return this.grid.getWeekStartInTimeline(refDd);
        },

        getWeekEndInTimeline(refDd, refDf) {
            return this.grid.getWeekEndInTimeline(refDd, refDf);
        },

        getWidth(cols, sx) {
            return this.grid.getWidth(cols, sx);
        }
    },
}
</script>
