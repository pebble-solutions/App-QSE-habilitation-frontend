<template>
	<div class="card bg-light" v-if="!pending.control">
		<div class="card-body align-items-center">
			<!-- Titre -->
			<div class="text-center mb-3">
				<strong v-if="displayAgent" class="me-2">{{returnName(personnelHabilitation.personnel_id)}}</strong>
				<!-- <span v-if="personnelHabilitation.personnel.dsortie">date sortie le {{ changeFormatDateLit(personnelHabilitation.personnel.dsortie) }}</span> -->
				<strong v-if="displayHab">{{personnelHabilitation.habilitation_type_id}}</strong>
				<span class="ms-2" v-if="personnelHabilitation">
					<button class=" btn btn-sm bg-custom"
						@click.prevent="this.$router.push({name:'StatsAgent', params:{idAgent:personnelHabilitation.personnel_id, idForm:veilleConfig.formulaire_id}})">
						<span>STATS</span>
						<i class="bi bi-arrow-up-right-square ms-2"></i>	
					</button>
				</span>
			</div>
			<div class="row">
				<!-- Colonne 1 : Validité de l'habilitation -->
				<div class="col-lg-4 col-12">
					<div class="px-2 mb-3 mb-lg-0">
						<div class="fw-bold col-12">Validité : 3 ans<span class="fw-lighter ms-2">#{{ personnelHabilitation.id }}</span> </div>
						<div class="col-12">du {{ changeFormatDateLit(personnelHabilitation.dd) }} au {{ changeFormatDateLit(personnelHabilitation.df) }}</div>
						<!-- Composant ProgressBar -->
						<ProgressBar :dd="new Date(personnelHabilitation.dd)  " :df="new Date(personnelHabilitation.df)"></ProgressBar>
					</div>
				</div>

				<!-- Colonne 2 : Résultat des contrôles -->
				<div class="col-lg-4 col-12">
					<div class="col text-center">
						<div>
							<span v-if="personnelHabilitation.last_control_date">dernier contrôle le  {{ changeFormatDateLit(personnelHabilitation.last_control_date) }}</span>
							<span v-else>Pas de contrôle enregistré</span>
						</div>
						<div v-if="controles"  class="d-flex  flex-wrap align-items-center justify-content-start px-2">
							<button class="mb-2" v-for="kn in controles.control" :key="kn.id"
							@click.prevent="this.$router.push({name: 'readCollecte', params:{idCollecte:kn.id}})"
							:class="['btn', 'btn-sm', classNameFromSAMI(kn.sami), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
							:data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="'#' + kn.id+ ' du '+changeFormatDateLit(kn.date_done) ">
							{{ kn.sami }}
							</button>
						</div>
					</div>
					
				</div>
				<!-- Colonne 3 : caractéristique veille-->
				<div class="col-12 col-lg-4" >
					<Spinner v-if="veille && pending.control"></Spinner>
					<template v-else-if="veille && !pending.control">
						<span class="fw-lighter me-2"> #{{ veilleConfig.id }} </span>
						<span>Veille tous les <span class="fw-lighter">{{ veilleConfig.control_step}}</span>  jours</span>
						<div v-if="veille">
							<div>Dernier contrôle : <span class="fw-lighter ms-2">{{changeFormatDateLit(veille.date_last)}}</span> </div>
							<!-- Composant ProgressBar -->
							<ProgressBar v-if="veille" :dd="new Date(veille.date_last)" :df="delay(veille.date_last, veilleConfig.control_step)"></ProgressBar>
						</div>  
					</template>
					<div class="text-secondary d-flex align-items-center" v-else>
						<i class="bi bi-calendar2-x me-2"></i>
						<em>Pas de contrôle enregistré pour cette veille</em>
					</div>
				</div>
		</div>
	</div>
</div>
</template>
<script>
// import { Tooltip } from 'bootstrap';
import ProgressBar from '../components/ProgressBar.vue';
import { dateFormat, classNameFromSAMI } from '../js/collecte';
import Spinner from './pebble-ui/Spinner.vue';
import { mapState } from 'vuex';
export default {
	components: { ProgressBar, Spinner},
	props: {
		habId: Number,
		veilleConfig: Object,
		collecte: Object,
		info: Object,
		displayAgent: Boolean,
		displayHab: Boolean,
		personnelHabilitation: Object,
		veille: Object,
		controles: Object,
	},
	computed: {
		...mapState(['types', 'listActifs','personnels']),
	
	},
	data() {
		return {
			pending: {
				control: false
			},
		};
	},
	methods: {

		/**
		* retourne le nom du personnel
		* 
		* @param {number}  id du personnel
		* 
		* @return {string}
		*/
		returnName(id){
			let personnel = this.personnels.find (e => e.id == id);
			if(personnel) {
				return personnel.cache_nom
			}
			else return 'personnel non trouvé'
		},
				
		/**
		* return la date de l'expiration du délai de veille (+pdv) à partir de la date du dernier contrôle
		* @param {date} date la date du dernier contôle réalise
		* @param	{number}	pasdeveille pas de veille de la veille concernée
		*/
		delay(date, pdv){
			let dd = new Date(date);
			dd.setDate(dd.getDate()+pdv);
			return dd
		},
		
		changeFormatDateLit(el) {
			return dateFormat(el);
		},
		classNameFromSAMI(reponse) {
			return classNameFromSAMI(reponse);
		},
	},
	mounted() {
		
		// Initialisation des tooltips Bootstrap après le rendu du composant
		// this.$nextTick(function () {
		// 	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		// 	tooltipTriggerList.forEach(function (tooltipTriggerEl) {
		// 		return new Tooltip(tooltipTriggerEl)
		// 	})
		// })
	}
}
</script>
<style  scoped>
.btn-square {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
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
	font-size: 12px;
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
</style>


