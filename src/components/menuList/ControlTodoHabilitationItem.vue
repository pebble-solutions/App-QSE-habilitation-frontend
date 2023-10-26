<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="me-2" v-if="!pending.personnels">
            <UserImage :name="nomPersonnel" v-if="nomPersonnel"></UserImage>
        </div>
        <div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100">
            <div class="d-flex align-items-center">
                <span class="fw-lighter me-2">Habilitation #{{ habilitationPersonnel.id }}</span>
                <strong v-if="titre">{{ nomHabilitationType }}</strong>
            </div>
            <strong v-if="!pending.personnels">{{ nomPersonnel }}</strong>

            <span :class="badgeClass" class="badge border text-bg-light rounded-pill">
                <i class="bi bi-hourglass"></i>
                <span class="ms-1" v-if="daysUntilRenewal >= 0">Expire dans {{ daysUntilRenewal }} jours</span>
                <span v-else>Habilitation expiré depuis {{ -1 * daysUntilRenewal }} jours</span>
            </span>
        </div>
    </div>
    <div v-for="suspension in suspensions" :key="suspension.id">
        <div v-if="wasSuspended(suspension)">
            <div class="text-danger fw-bold">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <span>Suspendue du {{ changeFormatDateLit(suspension.dd) }}
                    <template v-if="suspension.df !== null">au {{ changeFormatDateLit(suspension.df)}}</template>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import UserImage from '../pebble-ui/UserImage.vue';
import { getDisplayFormatedDate } from '../../js/date';

export default {
    data() {
        return {
            personnels: null,
            nomPersonnel: '',
            typesCollection: null,
            nomHabilitationType: '',
            daysUntilRenewal: 0,
            badgeClass: '',
        }
    },
    props: {
        titre: Boolean,
        habilitationPersonnel: Object,
        suspensions : Array
    },
    computed: {
        ...mapState(['pending']),
    },
    watch: {
        /**
         * Observe l'object pending, si le pending est a false alors, la methode d'appel des noms des variables est appelée
         */
        pending: {
            deep: true,
            handler(newValue) {
                if (!newValue.personnels) {
                    this.getName();
                }
            },
        },
    },
    methods: {
        /**
		 * Change le format de la date au format littéral.
		 *
		 * @param {Date} el - La date à formater.
		 * @returns {string} La date formatée.
		 */
		changeFormatDateLit(el) {
			return getDisplayFormatedDate(el);
		},

        /**
		 * Calcul de la propriété isSuspension basée sur les suspensions actuelles.
		 *
		 * @returns {boolean} Renvoie vrai si une suspension correspondante est trouvée et que la date df est nulle ou dans le futur, sinon renvoie faux.
		 */
        wasSuspended(suspension) {
			return suspension.habilitation_id === this.habilitationPersonnel.id && (suspension.df === null || new Date(suspension.df) > new Date());
		},

        /**
         * Passe une chaine de caractère au pluriel en fonction d'une quantité
         * 
         * @param {string} str La chaîne à transformer
         * @param {number} qt La quantité
         */
        plural(str, qt) {
            const invariables = ['mois'];
            return qt > 1 && !invariables.includes(str) ? `${str}s` : str;
        },
        
        /**
         * Initialise la valeur du nom du personnel dont l'id est egal au personnel_id de l'habilitation
         */
        getName() {
            const personnel = this.personnels.getCollection().find(e => e.id == this.habilitationPersonnel.personnel_id);
            if (personnel != null) {
                this.nomPersonnel = personnel.cache_nom;
            } else {
                this.nomPersonnel = '?';
            }
        },

        /**
         * Initialise la valeur du nom de l'habilitation dont l'id est egal au characteristic_id de l'habilitation
         */
        getHabilitionName() {
            const habilitation = this.typesCollection.getCollection().find(e => e.id == this.habilitationPersonnel.characteristic_id);
            if (habilitation != null) { 
                this.nomHabilitationType = habilitation.nom;
            } else {
                this.nomHabilitationType = '?';
            }
        },

        /**
         * Initialise la variable badgeClass avec la valeur de la class bootstraps en fonction du temps avant la fin de l'habilitation
         */
        buildBadgeClass() {

            const daysUntilRenewal = Math.trunc( (new Date(this.habilitationPersonnel.df) - new Date) / (1000 * 3600 * 24));
            if (daysUntilRenewal > 30) {
                this.badgeClass = 'border-success text-success';
            } else if (daysUntilRenewal > 15 && daysUntilRenewal <= 30) {
                this.badgeClass = 'border-primary text-primary';
            } else if (daysUntilRenewal >= 0 && daysUntilRenewal <= 15) {
                this.badgeClass = 'border-warning text-warning';
            } else if (daysUntilRenewal < 0) {
                this.badgeClass = 'border-danger text-danger';
            }
            this.daysUntilRenewal = daysUntilRenewal;
        },

        /**
         * Récupère les informations liées aux collections
         */
        initFromCollections() {

            if (!this.pending.personnels) {
                this.getName();
            }
            
            this.getHabilitionName();

            this.buildBadgeClass();
        },
    },
    components: {
        UserImage
    },

    mounted() {

        this.personnels = this.$assets.getCollection('personnels');
        this.typesCollection = this.$assets.getCollection('types');

        this.initFromCollections();
    },

    updated() {
        this.initFromCollections();
    }
}
</script>
