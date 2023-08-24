<template>
	<div class="container py-2">
		<div class="card bg-custom mt-4">
			<div class="card-body">
				<h2 v-if="personnel" class="text-center text-white">{{ personnel.cache_nom }} <span
						class="text-secondary">#{{
							$route.params.id }}</span></h2>

				<div class="card mb-4">
					<div class="card-body">
						<h3 class="card-title text-center mb-3">Habilitations suspendues</h3>
						<ul class="custom-ul">
							<li class="d-flex justify-content-between align-items-center bg-danger rounded text-white px-3 py-2 mb-2"
								v-for="hab in getSuspendedHabilitations" :key="hab.id">
								<span>{{ getHabilitationTypeName(hab.habilitation_type_id) }}</span>
								<span>le {{ formatSuspensionDate(getSuspensionDate(hab.id)) }}</span>
							</li>
						</ul>
					</div>
				</div>

				<div class="card mb-4">
					<div class="card-body">
						<h3 class="card-title text-center mb-3">Autres habilitations</h3>
						<ul class="custom-ul">
							<li class="d-flex justify-content-between align-items-center bg-success rounded text-white px-3 py-2 mb-2"
								v-for="hab in getNonSuspendedHabilitations" :key="hab.id">
								{{ getHabilitationTypeName(hab.habilitation_type_id) }}
							</li>
						</ul>
						<p v-if="getNonSuspendedHabilitations.length === 0" class="text-center text-secondary">Aucune autre
							habilitation</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {

        ...mapState(['suspensions', 'personnels', 'habilitations', 'types']),

        /**
         * Retourne l'objet personnel correspondant à l'ID de l'URL.
         * @return {Object} L'objet personnel correspondant à l'ID.
         */
        personnel() {
            return this.personnels.find(el => el.id == this.$route.params.id);
        },

        /**
         * Retourne les habilitations associées à ce personnel.
         * @return {Array} Les habilitations du personnel.
         */
        habilitationPersonnel() {
            return this.habilitations.filter(el => el.personnel_id == this.$route.params.id);
        },

        /**
         * Retourne les suspensions associées aux habilitations du personnel.
         * @return {Array} Les suspensions du personnel.
         */
        getSuspensions() {
            return this.habilitationPersonnel.reduce((suspensions, hab) => {
                const suspension = this.suspensions.find(el => el.habilitation_id === hab.id);
                if (suspension) {
                    suspensions.push(suspension);
                }
                return suspensions;
            }, []);
        },

        /**
         * Retourne les habilitations non suspendues du personnel.
         * @return {Array} Les habilitations non suspendues du personnel.
         */
        getNonSuspendedHabilitations() {
            return this.habilitationPersonnel.filter(hab => !this.getSuspensions.some(sus => sus.habilitation_id === hab.id));
        },

        /**
         * Retourne les habilitations suspendues du personnel.
         * @return {Array} Les habilitations suspendues du personnel.
         */
        getSuspendedHabilitations() {
            return this.habilitationPersonnel.filter(hab => this.getSuspensions.some(sus => sus.habilitation_id === hab.id));
        },

        /**
         * Retourne le nom du type d'habilitation.
         * @param {number} habilitationTypeId - L'ID du type d'habilitation.
         * @return {string} Le nom du type d'habilitation.
         */
        getHabilitationTypeName() {
            return habilitationTypeId => {
                const habilitationType = this.types.find(type => type.id === habilitationTypeId);
                return habilitationType ? habilitationType.nom : '';
            };
        },

        /**
         * Retourne la date de suspension au format localisé.
         * @param {number} habilitationId - L'ID de l'habilitation.
         * @return {string} La date de suspension au format localisé.
         */
        getSuspensionDate() {
            return habilitationId => {
                const suspension = this.suspensions.find(sus => sus.habilitation_id === habilitationId);
                return suspension ? suspension.dd : '';
            };
        },

        /**
         * Formate la date en utilisant les options de format.
         * @param {string} date - La date à formater.
         * @return {string} La date formatée.
         */
        formatSuspensionDate() {
            return date => {
                if (date) {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return new Date(date).toLocaleDateString('fr-FR', options);
                }
                return '';
            };
        }
    },
};
</script>

<style scoped>
.custom-ul {
	padding-left: 0;
	list-style: none;
}

.bg-custom {
	background-color: #f78c6b9a;
}</style>
