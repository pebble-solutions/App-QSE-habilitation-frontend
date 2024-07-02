<template>
    <div class="row-no-padding-x justify-content-center align-items-center">
        <div class="col-1">
            <span>
                <UserImage :name="agent.cache_nom" />
            </span>
        </div>
        <div class="col-8 ps-4">
            <span>{{ agent.cache_nom }}</span>
        </div>
        <div class="col-2 text-end">
            <span class="fw-lighter"># {{ agent.id }}</span>
        </div>
    </div>
    <div class="badge-group mt-2" v-if="nbTotalHabilitation">
        <template v-for="badge in badges" :key="badge.label">
            <span class="badge status-badge me-2" :class="'text-bg-' + badge.style"
                v-if="getHabiliationNb(badge.style) > 0">
                <i class="bi" :class="badge.icon"></i>
                <span class="mx-1">{{ getHabiliationNb(badge.style) }}</span>
                <span class="status-detail">{{ badge.label }}</span>
            </span>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.status-badge .status-detail {
    display: none;
}

.status-badge:hover .status-detail {
    display: inline;
}

.badge-group {
    display: flex;
    align-items: center;

    >.badge {
        border-radius: 4px;
        /* Ajoutez cette ligne pour définir les coins arrondis */
        margin-right: 4px;
        /* Ajoutez une marge entre les badges */
    }

    >.badge:first-child {
        margin-left: 10px;
        /* Ajoutez une marge à gauche du premier badge */
    }
}

.row-no-padding-x {
    display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  padding-top: 4px;
  padding-bottom: 4px;
}


</style>

<script>
import UserImage from '../pebble-ui/UserImage.vue';
export default {
    components: { UserImage },
    props: {
        agent: Object,
        stats: Object
    },

    data() {
        return {
            nbTotalHabilitation: 0,
            nbExpired: 0,
            nbExpirationWarning: 0,
            badges: [
                {
                    style: "secondary",
                    icon: "bi-calendar2-check-fill",
                    label: "Habilitation"
                },
                {
                    style: "danger",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expirée"
                },
                {
                    style: "warning",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expire dans 1 mois"
                }
            ]
        }
    },

    methods: {
        /**
         * Retourne le nombre a afficher en fonction du style du badge
         * 
         * @param {string} badgeStyle le style du badge
         * 
         * @return {number}
         */
        getHabiliationNb(badgeStyle) {
            let dataNb;

            switch (badgeStyle) {
                case "danger":
                    dataNb = this.nbExpired;
                    break;

                case "warning":
                    dataNb = this.nbExpirationWarning;
                    break;

                default:
                    dataNb = this.nbTotalHabilitation;
                    break;
            }

            return dataNb;
        },
    },

    mounted() {
        if (this.stats) {
            this.nbTotalHabilitation = this.stats.total;
            this.nbExpired = this.stats.expired;
            this.nbExpirationWarning = this.stats.expirationWarning;
        }
    },
};

</script>