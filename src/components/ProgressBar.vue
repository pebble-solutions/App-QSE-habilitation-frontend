<template>
    <div v-if="varTime" class="progress-container" ref="progressContainer">
        <div class="progress progress-ht text-light text-shadow-effect position-relative" role="progressbar"
            aria-valuemin="0" aria-valuemax="100">
            <span class="position-absolute w-100 text-center" ref="progressLabel">{{ barLabel(varTime) }}</span>
            <div class="progress-bar progress-ht h-100 overflow-visible" role="progressbar" :class="returnClass(varTime)"
                :style="widthStyle(varTime)"></div>
        </div>
    </div>
</template>

<script>
import { daysToYearMonthDay } from '../js/date.js';

export default {

    props: {
        dd: {
            type: Date,
        },
        df: {
            type: Date,
        },
        value: Object,
        label: {
            type: String,
        }
    },

    computed: {
        /**
         * Retourne la date de début de la référence en fonction des propriétés passées au composant.
         */
        valueDd() {
            if (this.dd) {
                return new Date(this.dd);
            } else {
                return new Date(this.value.dd);
            }
        },

        /**
         * Retourne la date de fin de la référence en fonction des propriétés passées au composant.
         */
        valueDf() {
            if (this.df) {
                return new Date(this.df);
            } else {
                return new Date(this.value.df);
            }
        },

        varTime() {
            const now = new Date();
            const endDate = this.valueDf;
            const startDate = this.valueDd;
            let nowTime = now.getTime() / 1000;
            let endTime = endDate.getTime() / 1000;
            let beginTime = startDate.getTime() / 1000;

            let consoTime = nowTime - beginTime;
            let restTime = endTime - nowTime;
            let totalTime = endTime - beginTime;

            let remainingDays = Math.floor(restTime / (60 * 60 * 24));
            let totalDays = Math.floor(totalTime) / (60 * 60 * 24);
            let consoDays = Math.floor(consoTime) / (60 * 24 * 60);

            let consoPerCent = Math.ceil((consoDays / totalDays) * 100);

            let data = { remainingDays, consoPerCent, totalDays };

            return data;
        },

        percent() {
            const now = new Date();
            const startDate = new Date(this.valueDd);

            let nowTime = now.getTime() / 1000;
            let beginTime = startDate.getTime() / 1000;

            let time = nowTime - beginTime;
            let consoDays = Math.floor(time / (60 * 60 * 24));
            let percent = Math.floor(consoDays / 11);

            return percent;
        }

  }, 
    methods: {

        returnClass(data) {
            if (180 < data.remainingDays) {
                return 'bg-success';
            }

            if (120 < data.remainingDays && 180 >= data.remainingDays) {
                return 'bg-info';
            }

            if (90 < data.remainingDays && 120 >= data.remainingDays) {
                return 'bg-warning';
            }

            if (0 < data.remainingDays && 90 >= data.remainingDays) {
                return 'bg-danger text-light';
            }

            if (0 >= data.remainingDays) {
                return 'bg-dark text-light';
            }
        },

        widthStyle(data) {
            if (data.consoPerCent > 0) {
                return "width:" + data.consoPerCent + "%";
            }

            return "width: 100%";
        },

        /**
         * return the sentence to display in the progress bar
         * in function if it's expired or not
         * 
         * @param {object} data contient restinDay, consoPerCent et totalDays de l'habilitation
         * 
         * @return {string}
         */
        barLabel(data) {
            if (data.remainingDays <= 0) {
                return "Expiré depuis " + daysToYearMonthDay(Math.abs(data.remainingDays));
            } else {
                return 'Renouvellement sous ' + daysToYearMonthDay(Math.abs(data.remainingDays));
            }
        },

        returnLabel(data) {
            const label = this.label ? this.label : '';
            if (data.restinDays <= 0) {
                return this.cleanLabel(label + ' expiré depuis ') + ' ' + daysToYearMonthDay(Math.abs(data.remainingDays));
            }
            else {
                if (data.consoPerCent >= 71) {
                    return this.cleanLabel(label + ' à réaliser sous ') + ' ' + daysToYearMonthDay(Math.abs(data.remainingDays))
                }
            }
        },
        /**
         * Enlève les espaces au début et à la fin puis ajoute une majuscule au début si nécessaire
         * @param {String} label 
         */
        cleanLabel(label) {
            let lowerCaseLabel = label.slice(0);
            return lowerCaseLabel.charAt(0).toUpperCase() + lowerCaseLabel.slice(1);
        },
        adjustHeight() {
            const labelHeight = this.$refs.progressLabel.offsetHeight;
            const newContainerHeight = labelHeight + 8; // 4px de marge en haut et en bas
            this.$refs.progressContainer.style.minHeight = `${newContainerHeight}px`;
        },
    },
    

    mounted() {
        this.adjustHeight();
    },

    updated() {
        this.adjustHeight();
    },

}

</script>

<style scoped>
.text-shadow-effect {
    text-shadow: 2px 1px 2px #000000df;
}

.position-absolute {
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    font-size: 110%;
}

.progress-container {
    display: flex;
    flex-direction: column;
    min-height: 30px;
    /* Ajustez selon vos besoins */
}

.progress {
    flex-grow: 1;
    /* Permet à la barre de progresser de prendre tout l'espace vertical disponible */
}</style>