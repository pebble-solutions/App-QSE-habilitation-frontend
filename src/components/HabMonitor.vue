<template>
	<div class="card" :class="{ 'bg-light': !pending.control, 'border-danger red-card': shouldDisplayRedBorder() }">
		<div v-for="suspension in suspensions" :key="suspension.id">
			<div v-if="isSuspension(suspension)">
				<div class="ribbon ribbon-top-left"><span>suspendue !</span></div>
			</div>
		</div>
		<div class="card-body">
			<!-- Titre -->
			<div class="position-relative text-center">
				<strong v-if="displayAgent" class="me-2">{{ returnName(personnelHabilitation.personnel_id) }}</strong>
				<strong v-if="displayHab">{{ personnelHabilitation.habilitationType.nom }}</strong>
				<button class="btn btn-sm butn-custom-stats text-white position-absolute end-0"
					@click.prevent="this.$router.push({ name: 'agentStats', params: { id: this.$route.params.id, idForm: personnelHabilitation.configVeille.formulaire_id } })">
					<span>STATS</span>
					<i class="bi bi-arrow-up-right-square ms-2"></i>
				</button>
			</div>
			<div class="row">
				<!-- Colonne 1 : Validité de l'habilitation -->
				<div class="col-lg-4 col-12">
					<div class="px-2 pt-2 mb-3 mb-lg-0">
						<div class="fw-bold col-12">Validité : 3 ans<span class="fw-lighter ms-2">#{{
							personnelHabilitation.id }}</span></div>
						<div class="col-12 pb-1" v-if="showDate">Du {{ changeFormatDateLit(personnelHabilitation.dd) }} au
							{{ changeFormatDateLit(personnelHabilitation.df) }}
							<button class="btn btn-sm" @click.prevent="showDate = false">
								<i class="bi bi-pencil-square ms-2"></i>
							</button> 
						</div>
						<div class="row align-items-end mb-2 ms-3" v-if="!showDate">
							<div class="col-6">
								<label for="dd" class="form-label ms-4">Date de début</label>
								<input type="date" format="YYYY-MM-DD" class="form-control" id="dd" v-model="ddHab">
							</div>
							<div class="col-2">
								<button class="btn btn-sm btn-success w-100 mb-1" @click.prevent="saveNewDate()" :disabled="!ddHab">
								<i class="bi bi-check"></i>
								</button>
							</div>
							<div class="col-2">
								<button class="btn btn-sm btn-secondary w-100 mb-1" @click.prevent="showDate = true">
								<i class="bi bi-x"></i>
								</button>
							</div>
						</div>
												
						<!-- Composant ProgressBar -->
						<ProgressBar class="mb-2" :dd="new Date(personnelHabilitation.dd)"
							:df="new Date(personnelHabilitation.df)"></ProgressBar>
						<div>
							<div v-for="suspension in suspensions" :key="suspension.id">
								<div v-if="isSuspension(suspension)">
									<div class="text-danger fw-bold">
										<i class="bi bi-exclamation-triangle-fill me-2"></i>
										<span>Suspendue du {{ changeFormatDateLit(suspension.dd) }}
											<template v-if="suspension.df !== null">au {{ changeFormatDateLit(suspension.df)
											}}</template>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Colonne 2 : Résultat des contrôles -->
				<div class="col-lg-4 col-12">
					<div class="px-2 pt-2 mb-3 mb-lg-0">
						<div class="col text-center">
							<span v-if="personnelHabilitation.last_control_date">Dernier contrôle le {{
								changeFormatDateLit(personnelHabilitation.last_control_date) }}</span>
							<span v-else>Pas de contrôle enregistré</span>
							<div v-if="personnelHabilitation.controles"
								class="d-flex flex-row flex-wrap align-items-center justify-content-start px-2">
								<button class="mb-2" v-for="kn in personnelHabilitation.controles" :key="kn.id"
									@click.prevent="this.$router.push({ name: 'readCollecteOperateur', params: { idCollecte: kn.id } })"
									:class="['btn', 'btn-sm', classNameFromSAMI(kn.sami), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
									:data-bs-toggle="'tooltip'" :data-bs-placement="'top'"
									:title="'#' + kn.id + ' du ' + changeFormatDateLit(kn.date_done)">
									{{ kn.sami }}
								</button>
							</div>
						</div>

					</div>
				</div>

				<!-- Colonne 3 : caractéristique veille -->
				<div class=" col-lg-4 col-12">
					<div class="px-2 pt-2 mb-3 mb-lg-0">
						<template v-if="personnelHabilitation.configVeille">
							<span class="fw-lighter me-2">#{{ personnelHabilitation.configVeille.id }}</span>
							<span>Veille tous les <span class="fw-lighter">{{
								personnelHabilitation.configVeille.control_step }}</span> jours</span>
							<div v-if="personnelHabilitation.veille">
								<div v-if="!personnelHabilitation.veille.date_last"
									class="d-flex align-items-center text-danger">
									<i class="bi bi-exclamation-triangle-fill me-2"></i>
									Jamais contrôlé
								</div>
								<template v-else>
									<div>Dernier contrôle : {{ changeFormatDateLit(personnelHabilitation.veille.date_last)
									}}</div>
									<ProgressBar :dd="new Date(personnelHabilitation.veille.date_last)"
										:df="delay(personnelHabilitation.veille.date_last, personnelHabilitation.configVeille.control_step)">
									</ProgressBar>
								</template>
							</div>
							<div v-else>
								Pas de contrôle à programmer
							</div>
						</template>
						<div class="text-secondary d-flex align-items-center" v-else>
							<i class="bi bi-calendar2-x me-2"></i>
							<em>Pas de contrôle enregistré pour cette veille</em>
						</div>
					</div>
				</div>

				<div class="position-relative text-center mb-4">

					<div v-for="suspension in suspensions" :key="suspension.id">
						<div v-if="isSuspension(suspension)">
							<router-link :to="{ name: 'editSuspension', params: { idSuspension: suspension.id } }"
							v-slot="{ href, navigate }" custom v-if="shouldDisplayRedBorder()">
								<a :href="href" @click="navigate" class="btn btn-sm butn-custom-stats text-white position-absolute end-0 mb-1 me-1">
									<span>Lever la suspension</span>
									<i class="bi bi-arrow-up-right-square ms-2"></i>
								</a>
							</router-link>
						</div>
					</div>

					<router-link :to="{ name: 'createSuspension', params: { idHabilitation: personnelHabilitation.id }}"
					v-slot="{ href, navigate }" custom v-if="!shouldDisplayRedBorder()">
						<a :href="href" @click="navigate" class="btn btn-sm butn-custom-stats text-white position-absolute end-0 mb-1 me-1">
							<span>Suspendre</span>
							<i class="bi bi-arrow-up-right-square ms-2"></i>
						</a>
					</router-link> 
				</div>

			</div>
		</div>
	</div>
</template>

  
<script>
import { Tooltip } from 'bootstrap';
import ProgressBar from '../components/ProgressBar.vue';
import { dateFormat, classNameFromSAMI } from '../js/collecte';
import { mapState } from 'vuex';
import { toSqlDate } from '../js/date';

export default {
	components: { ProgressBar },
	props: {
		habId: Number,
		collecte: Object,
		info: Object,
		displayAgent: Boolean,
		displayHab: Boolean,
		personnelHabilitation: Object,
		veille: Object,
		controles: Object,
	},
	computed: {
		...mapState(['types', 'listActifs', 'personnels', 'suspensions']),
	},
	data() {
		return {
			showDate: true,
			ddHab: null,
			pending: {
				control: false
			},
		};
	},
	methods: {

		/**
		 * Calcul de la propriété isSuspension basée sur les suspensions actuelles.
		 *
		 * @returns {boolean} Renvoie vrai si une suspension correspondante est trouvée et que la date df est nulle ou dans le futur, sinon renvoie faux.
		 */
		isSuspension(suspension) {
			return suspension.habilitation_id === this.personnelHabilitation.id && (suspension.df === null || new Date(suspension.df) > new Date());
		},

		/**
		 * Vérifie si une suspension est trouvée et que la date df est nulle ou dans le futur.
		 *
		 * @returns {boolean} Renvoie vrai si une suspension correspondante est trouvée et que la date df est nulle ou dans le futur, sinon renvoie faux.
		 */
		shouldDisplayRedBorder() {
			// Vérifier si une suspension est trouvée et que la date df est nulle ou dans le futur
			if (this.suspensions && this.suspensions.length > 0) {
				for (const suspension of this.suspensions) {
					if (suspension.habilitation_id === this.personnelHabilitation.id) {
						if (suspension.df === null || new Date(suspension.df) > new Date()) {
							return true; // Afficher la bordure rouge
						}
					}
				}
			}
			return false; // Ne pas afficher la bordure rouge
		},

		/**
		 * Retourne le nom du personnel.
		 *
		 * @param {number} id - L'ID du personnel.
		 * @returns {string} Le nom du personnel ou "personnel non trouvé" si non trouvé.
		 */
		returnName(id) {
			let personnel = this.personnels.find(e => e.id == id);
			if (personnel) {
				return personnel.cache_nom;
			} else {
				return 'personnel non trouvé';
			}
		},

		/**
		 * Calcule la date de l'expiration du délai de veille (+pdv) à partir de la date du dernier contrôle.
		 *
		 * @param {Date} date - La date du dernier contrôle réalisé.
		 * @param {number} pdv - Le pas de veille de la veille concernée.
		 * @returns {Date} La date d'expiration calculée.
		 */
		delay(date, pdv) {
			let dd = new Date(date);
			dd.setDate(dd.getDate() + pdv);
			return dd;
		},

		/**
		 * Change le format de la date au format littéral.
		 *
		 * @param {Date} el - La date à formater.
		 * @returns {string} La date formatée.
		 */
		changeFormatDateLit(el) {
			return dateFormat(el);
		},

		/**
		 * Obtient la classe CSS à partir de la réponse SAMI.
		 *
		 * @param {string} reponse - La réponse SAMI.
		 * @returns {string} La classe CSS correspondante.
		 */
		classNameFromSAMI(reponse) {
			return classNameFromSAMI(reponse);
		},

		async saveNewDate() {
			const newStartDate = this.ddHab.slice(0, 10);
			const currentStartDate = this.personnelHabilitation.dd.slice(0, 10);

			if (newStartDate !== currentStartDate) {
				const startDate = new Date(this.ddHab);
				const endDate = new Date(startDate);
				endDate.setFullYear(startDate.getFullYear() + 3);
				endDate.setDate(endDate.getDate() - 1);

				const obj = {
				dd: newStartDate,
				df: toSqlDate(endDate)
				};

				const habilitationsPersonnelsCollection = this.$assets.getCollection("habilitationsPersonnels");

				try {
				const data = await this.$app.api.patch(`v2/habilitation/personnel/${this.personnelHabilitation.id}`, obj);
				habilitationsPersonnelsCollection.updateCollection([data]);
				} catch (error) {
				this.$app.catchError(error);
				} finally {
				this.showDate = true;
				}
			}
		}
	},
	mounted() {
		// Initialisation des tooltips Bootstrap après le rendu du composant
		this.$nextTick(function () {
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			tooltipTriggerList.forEach(function (tooltipTriggerEl) {
				return new Tooltip(tooltipTriggerEl)
			})
		})
		this.dd = this.personnelHabilitation.dd;

	}
}
</script>
  
<style scoped>
.btn-square {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;

}

.butn-custom-stats {
	background-color: #f78c6b;

}

.butn-custom-stats:hover {
	background-color: #dc6e4c;
	/* Couleur foncée pour l'overlay */
	transform: scale(1.1);
}

/**

.btn {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
*/

.bg-custom {
	background-color: #f78c6b;
}

.tooltip {
	position: absolute;
	top: -30px;
	left: 50%;
	transform: translateX(-50%);
	padding: 5px;
	background-color: #000;
	color: #fff;
	font-size: 16px;
	border-radius: 3px;
	white-space: nowrap;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease, visibility 0.3s ease;
}

.btn:hover .tooltip {
	opacity: 1;
	visibility: visible;
}

/* ruban */
@import url(https://fonts.googleapis.com/css?family=Lato:700);

body {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 40vh;
	background: #f0f0f0;
}

.box {
	position: relative;
	max-width: 500px;
	width: 80%;
	height: 300px;
	background: #fff;
	box-shadow: 0 0 15px rgba(0, 0, 0, .1);
}

/* common */
.ribbon {
	width: 100px;
	height: 100px;
	overflow: hidden;
	position: absolute;
}

.ribbon::before,
.ribbon::after {
	position: absolute;
	z-index: -1;
	content: '';
	display: block;
	border: 5px solid #2980b9;
}

.ribbon span {
	position: absolute;
	display: block;
	width: 225px;
	padding: 8px 0;
	padding-left: 47px;
	background-color: #dc3545;
	box-shadow: 0 5px 10px rgba(0, 0, 0, .1);
	color: #fff;
	font: 600 10px/1 'Lato', sans-serif;
	text-shadow: 0 1px 1px rgba(0, 0, 0, .2);
	text-transform: uppercase;
	text-align: center;
}

/* top left*/
.ribbon-top-left {
	top: -3px;
	left: -3px;
}

.ribbon-top-left::before,
.ribbon-top-left::after {
	border-top-color: transparent;
	border-left-color: transparent;
}

.ribbon-top-left::before {
	top: 0;
	right: 0;
}

.ribbon-top-left::after {
	bottom: 0;
	left: 0;
}

.ribbon-top-left span {
	right: -25px;
	top: 30px;
	transform: rotate(-36deg);
}

.red-card {
	border: 7px solid red;
	background-color: #ef151574 !important;
	color: white !important;
}

.red-card strong {
	color: white !important;
	font-size: 1, 4em !important;
}
</style>