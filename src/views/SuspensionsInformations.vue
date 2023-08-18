<template>
	<div class="container py-2">
		<div class="card bg-custom mt-4">
			<div class="card-body">
				<h1 v-if="personnel" class="text-center text-white">{{ personnel.cache_nom }} <span class="text-warning">#{{
					$route.params.id }}</span></h1>

				<div class="card mb-4">
					<div class="card-body">
						<h2 class="card-title text-center">Habilitations suspendues :</h2>
						<ul>
							<li class="text-danger" v-for="hab in getSuspendedHabilitations" :key="hab.id">
								{{ getHabilitationTypeName(hab.habilitation_type_id) }}
							</li>
						</ul>
					</div>
				</div>

				<div class="card mb-4">
					<div class="card-body">
						<h2 class="card-title text-center">Autres habilitations :</h2>
						<ul>
							<li class="text-success" v-for="hab in getNonSuspendedHabilitations" :key="hab.id">
								{{ getHabilitationTypeName(hab.habilitation_type_id) }}
							</li>
						</ul>
						<p v-if="getNonSuspendedHabilitations.length === 0" class="text-center text-secondary">Aucune autre
							habilitation</p>
					</div>
				</div>
			</div>
		</div>
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
	},
};
</script>

<style scoped>
.bg-custom {
	background-color: #F78C6B;
}
</style>
