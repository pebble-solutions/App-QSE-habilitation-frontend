<template>
	<div class="card bg-light" v-if="!pending.control">
		list de la veille{{ veille }}
		<br><br>
		detail habilitation{{ personnelHabilitation }}
		<br><br>
		config veille{{ veilleConfig }}
		
		<div class="card-body">
			<!-- Titre -->
			<div class="text-center mb-1">
				<strong v-if="displayAgent" class="me-2">{{returnName(personnelHabilitation.personnel_id)}}</strong>
				<strong v-if="displayHab">{{personnelHabilitation.habilitation_type_id}}</strong>
			</div>
			<div class="row">
				<!-- Colonne 1 : Validité de l'habilitation -->
				<div class="col-lg-4 col-12">
					<div class="px-2 mb-3 mb-lg-0">
						<div class="fw-bold col-12">Validité : 3 ans <span class="fw-lighter">#{{ personnelHabilitation.id }}</span> veille {{ personnelHabilitation.characteristic_id }} <span> </span> </div>
						<div class="col-12">{{ changeFormatDateLit(personnelHabilitation.dd) }}
							au {{ changeFormatDateLit(personnelHabilitation.df) }}
						</div>
						<!-- Composant ProgressBar -->
						<ProgressBar :dd="new Date(personnelHabilitation.dd)  " :df="new Date(personnelHabilitation.df)"></ProgressBar>
					</div>
				</div>

				<!-- Colonne 2 : Résultat des contrôles -->
				
				<div class="col">
					<div>
						<span v-if="personnelHabilitation.last_control_date">dernier contrôle le  {{ changeFormatDateLit(personnelHabilitation.last_control_date) }}</span>
						<span v-else>Pas de contrôle enregistré</span>
					</div>
					<div v-if="listControlDone" class="d-flex flex-row-reverse flex-wrap align-items-center justify-content-end px-2">
						<button class="mb-2" v-for="kn in listControlDone" :key="kn.id"
						:class="['btn', 'btn-sm', classNameFromSAMI(kn.sami), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
						:data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="'#' + kn.id">
						{{ kn.sami }}
					</button>
				</div>
			</div>
			
			<!-- Colonne 3 : caractéristique veille-->
			<div class="col-lg-4 col-12 px-2" >
				
				<Spinner v-if="veille && pending.control"></Spinner>
				<template v-else-if="veille && !pending.control">
					<span class="fw-lighter me-2"> #{{ veilleConfig.id }} </span><span>Veille tous les <span class="fw-lighter">{{ veilleConfig.control_step}} </span>  jours</span>
					<div v-if="veille">
						<div>Dernier contrôle : {{changeFormatDateLit(veille.date_last)}}</div>
					</div>  
					<!-- Composant ProgressBar -->
					<ProgressBar v-if="veille" :dd="new Date(veille.date_last)" :df="delay(veille.date_last, veilleConfig.control_step)"></ProgressBar>
					<div class="text-success" v-else> {{ noLastControl }}<i class="bi bi-check text-success"></i></div>
				</template>
				<div class="text-secondary d-flex align-items-center" v-else>
					<i class="bi bi-calendar2-x me-2"></i>
					<em>Pas de veille pour cette  habilitation</em>
				</div>
			</div>
			
			
		</div>
	</div>
</div>
</template>
<script>
import { Tooltip } from 'bootstrap';
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
	},
	computed: {
		...mapState(['types', 'listActifs','personnels']),
	
	
	
	
	},
	data() {
		return {
			pending: {
				control: false
			},
			listControlDone: '',
			habilitationPerso: [],
			hab: '',
			resultat: '',
			lastControlDate: '',
			infosHab: [],
			lastControl:'',
			noLastControl: '',
			listControlTodo: '',
			
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
		* return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
		* @param {date} date la date du dernier contôle réalise
		*/
		delay(date, pdv){
			let dd = new Date(date);
			
			dd.setDate(dd.getDate()+pdv);
			
			return dd
		},
		
		
		async loadinfosCollecte(id) {
			this.pending.control = true
			this.$app.apiGet('v2/collecte', {
				habilitation_id: id,
				kn2kn_info: 'OUI',
				retard_info: 'OUI',
				type: 'KN'
			})
			.then((data) => {
				this.listControlDone = data;
			})
			.catch(this.$app.catchError).finally(() => this.pending.control = false);
			await this.findVeilleHab(id);
		},
		
		
		changeFormatDateLit(el) {
			return dateFormat(el);
		},
		classNameFromSAMI(reponse) {
			return classNameFromSAMI(reponse);
		},
	},
	mounted() {
		// this.loadinfosCollecte(this.personnelHabilitation.id)
		
		// Initialisation des tooltips Bootstrap après le rendu du composant
		this.$nextTick(function () {
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			tooltipTriggerList.forEach(function (tooltipTriggerEl) {
				return new Tooltip(tooltipTriggerEl)
			})
		})
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

.btn {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
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


