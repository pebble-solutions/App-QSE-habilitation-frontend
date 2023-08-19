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

				<!-- debogage

		<div class="card text-center mt-5">
			<div class="card-body bg-danger">
				<h2 class="text-white">Débogage :</h2>

				<div class="card mb-4">
					<div class="card-body">
						<h2 class="card-title">Habilitations by perso :</h2>
						<div>{{ habilitationPersonnel }}</div>
					</div>
				</div>

				<div class="card mb-4">
					<div class="card-body">
						<h2 class="card-title">Suspensions : </h2>
						<div>{{ suspensions }}</div>
					</div>
				</div>

				<div class="card">
					<div class="card-body">
						<h2 class="card-title">Types :</h2>
						<div>{{ types }}</div>
					</div>
				</div>
			</div>
		</div>
	-->

			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState(['suspensions', 'personnels', 'habilitations', 'types']),

		personnel() {
			return this.personnels.find(el => el.id == this.$route.params.id);
		},

		habilitationPersonnel() {
			return this.habilitations.filter(el => el.personnel_id == this.$route.params.id);
		},

		getSuspensions() {
			return this.habilitationPersonnel.reduce((suspensions, hab) => {
				const suspension = this.suspensions.find(el => el.habilitation_id === hab.id);
				if (suspension) {
					suspensions.push(suspension);
				}
				return suspensions;
			}, []);
		},

		getNonSuspendedHabilitations() {
			return this.habilitationPersonnel.filter(hab => !this.getSuspensions.some(sus => sus.habilitation_id === hab.id));
		},

		getSuspendedHabilitations() {
			return this.habilitationPersonnel.filter(hab => this.getSuspensions.some(sus => sus.habilitation_id === hab.id));
		},

		getHabilitationTypeName() {
			return habilitationTypeId => {
				const habilitationType = this.types.find(type => type.id === habilitationTypeId);
				return habilitationType ? habilitationType.nom : '';
			};
		},
		getSuspensionDate() {
			return habilitationId => {
				const suspension = this.suspensions.find(sus => sus.habilitation_id === habilitationId);
				return suspension ? suspension.dd : '';
			};
		},
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
