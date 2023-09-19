<template>
	<AppWrapper :cfg="cfg" :cfg-menu="cfgMenu" :cfg-slots="cfgSlots" @auth-change="setLocal_user" @config-menu="displayConfig = true">

		<template v-slot:header>
			
		</template>


		<!-- Menu additionnel -->
		<!--
Modifier cfgSlots.menu = true; dans config.json pour activer.
-->
		<!-- <template v-slot:menu>
<AppMenu>
<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
<AppMenuItem href="/about" look="dark" icon="bi bi-app">À propos</AppMenuItem>
</AppMenu>
</template> -->

		<template v-slot:list>
			<AppMenu v-if="listMode === 'personnels'">
				<!-- <AppMenuItem :href="'/personnels/' + personnel.id" v-for="personnel in personnels" :key="personnel.id">
					<div :class="['row', 'justify-content-center', 'align-items-center', { 'active': isActiveItem(personnel) }]">
						<div class="col-1">
							<span>
								<UserImage :name="personnel.cache_nom" :size="isActiveItem(personnel) ? 'xl' : ''" />
							</span>
						</div>
						<div class="col-8 ps-4">
							<span>{{ personnel.cache_nom }}</span>
						</div>
						<div class="col-2 text-end">
							<span class="fw-lighter"># {{ personnel.id }}</span>
						</div>
					</div>
				</AppMenuItem> -->
			</AppMenu>
			<AppMenu v-else-if="listMode === 'programmer'">
				<HabilitationList />
			</AppMenu>
			<AppMenu v-else-if="listMode === 'habilitation'">
				<input type="text" class="form-control my-2 px-2" placeholder="Rechercher..." v-model="displaySearch">
				<div v-if="!pending.habilitations">
					<AppMenuItem :href="'/types/' + type.id" icon="bi bi-patch-check-fill" :key="type.id" v-for="type in listConsultation(types)"> {{ cleanTypeName(type.nom) }} </AppMenuItem>
					
					<div class="alert alert-warning italic" role="alert" v-if="listConsultation(types).length == 0 && types.length == 0">Aucune habilitation renseignée sur cette structure</div>
					<div class="alert alert-warning italic" role="alert" v-else-if="listConsultation(types).length == 0 && displaySearch">Aucune habilitation renseignée avec cette recherche</div>

				</div>
				<div class="text-center" v-else>
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			</AppMenu>

			<AppMenu v-else-if="listMode === 'suspension'">
				<!-- <button class="btn w-100 mx-1"
						:class="['btn', { 'btn-primary': showPersonnels, 'btn-secondary': !showPersonnels }]"
						@click="toggleShow(true)">
						Personnels
					</button>
					<button class="btn w-100 mx-1"
						:class="['btn', { 'btn-primary': !showPersonnels, 'btn-secondary': showPersonnels }]"
						@click="toggleShow(false)">
						Habilitations
					</button>
					<div class="text-center">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div> -->
			</AppMenu>
			<AppMenu v-else-if="listMode === 'echeancier' || listMode === 'registre'">
				<FilterFormEcheancier />
			</AppMenu>
			<AppMenu v-else-if="listMode === 'operateur'">
				<PersonnelList v-slot="personnelProps">
					<FicheIndividuelleSuiviItem :agent="personnelProps.personnel" :stats="getStatsByAgent(personnelProps.personnel.id)" v-if="personnelProps"/>
				</PersonnelList>
			</AppMenu>
			<AppMenu v-else>
				<AppMenuItem :href="getItemLink(item)" v-for="item in currentList" :key="item.id">
					<template v-if="showPersonnels">
						<itemPersonnelSuspension :personnel="item" :icon="'bi bi-person-fill'" :num="item.id" />
					</template>
					<template v-else>
						<itemHabilitationSuspension :habilitation="item" :icon="'bi bi-patch-check-fill'" :num="item.id" />
					</template>
					<a>
						{{ showPersonnels ? item.personnel_name : item.habilitation_name }}
					</a>
				</AppMenuItem>
			</AppMenu>

		</template>


		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view v-if="isConnectedUser" />
			</div>

			<AppModal title="Configuration du module"
				id="configModule"
				:display="displayConfig"
				:close-btn="true"
				class-name="modal-dialog-scrollable modal-xl"
				
				@modal-hide="displayConfig = false">
				<Config v-if="!pending.config" />
			</AppModal>
		</template>

	</AppWrapper>
</template>

<style lang="scss">
@import './variables';

.fs-7 {
	font-size: 0.80rem !important;
}

.progress-ht {
	height: 25px !important;
}

.list-group-item.active {
	z-index: 2;
	color: var(--bs-list-group-active-color) !important;
	;
	background-color: $theme-color !important;
	;
	border-color: $theme-color !important;
	;
	border-top: solid 15px $theme-color !important;
	border-bottom: solid 15px $theme-color !important;
	font-size: 110%;
	font-weight: bold;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.565);
}

/* Annule les paddings droit et gauche pour les éléments enfants de .row */
.row>* {
	padding-right: 0 !important;
	padding-left: 0 !important;
}
</style>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import { mapState, mapActions } from 'vuex'
import { AssetsCollection } from './js/app/services/AssetsCollection'
import { ROUTES_NAMES } from './js/route';
import itemHabilitationSuspension from '@/components/itemHabilitationSuspension.vue'
import itemPersonnelSuspension from '@/components/itemPersonnelSuspension.vue'
import FilterFormEcheancier from './components/echeancier/FilterForm.vue'
import Config from './components/config/Config.vue'
import AppModal from './components/pebble-ui/AppModal.vue'
import HabilitationList from './components/menuList/HabilitationList.vue'
import PersonnelList from "@/components/PersonnelList.vue";
import FicheIndividuelleSuiviItem from "@/components/menuList/FicheIndividuelleSuiviItem.vue";

import CONFIG from "@/config.json"

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				habilitations: false,
				config: false,
				formulaires: false
			},
			isConnectedUser: false,
			displaySearch: '',
			currentList: [],
			showPersonnels: true,
			currentIndex: null,
			currentItemId: null,
			idToIndexMap: {},
			displayConfig: false,
			characteristicPersonnelStats: [],
		}
	},

	computed: {
		...mapState(['habilitationType', 'types', 'personnels']),

		/**
		 * Détermine quelle liste afficher :
		 * collecte, programmation
		 * 
		 * @return {string}
		 */
		listMode() {
			return this.getRouteGroupName(this.$route.name);
		},

		listItems() {
			return this.showPersonnels ? this.personnels : this.habilitations;
		},

	},

	methods: {
		...mapActions(['refreshHabilitationType', 'refreshFormulaires']),

		toggleShow(showPersonnels) {
			this.showPersonnels = showPersonnels;
			this.currentList = showPersonnels ? this.personnels : this.habilitations;
		},

		getItemLink(item) {
			if (this.showPersonnels) {
				return `/suspensions/personnel/${item.id}`;
			} else {
				// Adjust the route for habilitations if needed
				return `/suspensions/habilitation/${item.id}`;
			}
		},

		cleanTypeName(name) {
			// Supprime le préfixe "Habilitation : " du nom si présent
			return name.startsWith('Habilitation : ') ? name.substr(14) : name;
		},

		navigateToPrevItem() {
			const currentIndex = this.currentList.findIndex(item => this.isActiveItem(item));
			if (currentIndex > 0) {
				this.$router.push(this.getItemLink(this.currentList[currentIndex - 1]));
			}
		},

		navigateToNextItem() {
			const currentIndex = this.currentList.findIndex(item => this.isActiveItem(item));
			if (currentIndex < this.currentList.length - 1) {
				this.$router.push(this.getItemLink(this.currentList[currentIndex + 1]));
			}
		},

		isActiveItem(item) {
			return this.openedElement && this.openedElement.id === item.id;
		},

		handleArrowKeyNavigation(event) {
			// Vérifier si l'utilisateur appuie sur les touches haut ou bas
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault(); // Empêcher le comportement par défaut du défilement de la page
				const items = this.listItems; // Remplacez par la liste appropriée

				if (items.length === 0) {
					return; // Pas besoin de navigation si la liste est vide
				}

				// Mettre à jour l'index actuel en fonction de la touche pressée
				if (event.key === 'ArrowUp') {
					this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
				} else if (event.key === 'ArrowDown') {
					this.currentIndex = (this.currentIndex + 1) % items.length;
				}

				// Mettre à jour l'ID de l'élément actuellement sélectionné
				this.currentItemId = items[this.currentIndex].id;

				// Mettre à jour l'URL en fonction de l'élément actuel
				this.$router.push(`/personnels/${this.currentItemId}`);
			}
		},

		handleItemSelection(item) {
			this.currentIndex = this.idToIndexMap[item.id];
			this.currentItemId = item.id;
			this.$router.push(`/personnels/${this.currentItemId}`);
		},

		/**
		 * Retourne le nom du groupe auquel appartient la route à analyser.
		 * 
		 * @param {string} routeName Nom de la route à analyser
		 * 
		 * @return {string}
		 */
		getRouteGroupName(routeName) {
			for (const groupName in ROUTES_NAMES) {
				const names = ROUTES_NAMES[groupName];

				if (names.includes(routeName)) {
					return groupName;
				}
			}
			return null;
		},

		/**
		 * Retourn les states du personnel qui correspond a l'agent fournis en parametre
		 *
		 * @param {integer} personnelId l'id du personnel
		 *
		 * @return {array}
		 */
		getStatsByAgent(personnelId) {
			let statsByAgent = this.characteristicPersonnelStats.find(e => e.personnel_id == personnelId);
			return statsByAgent;
		},

		/**
		 * Charge les states de characteristic personnel par personnel
		 */
		loadCharacteristicPersonnelStats() {
			this.pending.stats = true;

			this.$app.apiGet('v2/characteristicPersonnel/stats')
			.then((data) => {
				this.characteristicPersonnelStats = data;
			})
			.catch(this.$app.catchError)
			.finally(this.pending.stats = false);
		},


		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * @param {Object} user Un objet LocalUser
		 */
		setLocal_user(user) {
			if (user) {
				this.$store.dispatch('login', user);
				this.isConnectedUser = true;
			}
			else {
				this.$store.dispatch('logout');
				this.isConnectedUser = false;
			}
		},

		/**
		 * retourne un tableau des types d'habilitations filtrés
		 * @param {Array} list liste des types d'habilitation
		 * @returns	{Array}	typeFiltred	résultat du filtre
		 */
		listConsultation(list) {

			let typeFiltred = list;
			if (this.displaySearch) {
				const searchInput = this.displaySearch.trim();
				if (/^\d+$/.test(searchInput)) {
					typeFiltred = typeFiltred.filter(item => searchInput.includes(item.id));
				} else if (/^[a-zA-Z]+$/.test(searchInput)) {
					const searchPattern = new RegExp(searchInput, 'i');
					typeFiltred = typeFiltred.filter(item => item.nom?.toUpperCase().match(searchPattern));
				}
				else {
					if (confirm('Cette recherche n\'est pas acceptée: "' + this.displaySearch + '". Filtre sur caractères numériques et alphabétiques uniquement.')) {
						this.displaySearch = '';
					}
				}
			}
			return typeFiltred;

		},

		/**
		 * retourne un tableau des personnels triés par ordre alpha
		 * @param	{Array}	list liste du personnel
		 * @return	{Array}	personnelFiltred liste du personnel trié
		 */

		listPersonnel(list){
			let personnelFiltered = list;
			personnelFiltered.sort((a,b) => {
				const nameA = a.cache_nom.toUpperCase();
				const nameB = b.cache_nom.toUpperCase();
				if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
			});
			return personnelFiltered

		},

		/**
		 * Initialise les collections de données au niveau du contrôleur d'assets
		 */
		initCollections() {

			const typesCollection = new AssetsCollection(this, {
				assetName: 'types',
				apiRoute: 'v2/habilitation/type'
			});

			const veillesCollection = new AssetsCollection(this, {
				assetName: 'veilles',
				apiRoute: 'v2/controle/veille'
			});
			const personnelsCollection = new AssetsCollection(this, {
				assetName: 'personnels',
				apiRoute: 'v2/personnel',
				requestPayload: {
                    limit: "aucune"
                }
			});
			const habilitationsPersonnelsCollection = new AssetsCollection(this, {
				assetName: 'habilitationsPersonnels',
				apiRoute: 'v2/characteristic/personnel',
				requestPayload : {
					last_control: 1,
					limit: "aucune",
				}
			});
			const suspensionsCollection = new AssetsCollection(this, {
				assetName: 'suspensions',
				apiRoute: 'v2/habilitation/suspension'
			});
			const habilitationsCollection = new AssetsCollection(this, {
				assetName: 'habilitations',
				apiRoute: 'v2/habilitation'
			});
			const habilitationsTypesCollection = new AssetsCollection(this, {
				assetName: 'habilitationsTypes',
				apiRoute: 'v2/controle/habilitation/type'
			});
			const personnelsFilteredCollection = new AssetsCollection(this, {
				name: "personnelsFiltered",
				assetName: "personnelsFiltered",
				apiRoute: "v2/personnel",
				requestPayload: {
					contratDdFilter: this.contratDdFilter,
					contratDfFilter: this.contratDfFilter,
					withContratFilter: this.withContratFilter,
					withoutContratFilter: this.withoutContratFilter,
					ordre: this.ordre,
					limit: "aucune"
				}
			});

			this.$assets.addCollection("types", typesCollection);
			this.$assets.addCollection("veilles", veillesCollection);
			this.$assets.addCollection("personnels", personnelsCollection);
			this.$assets.addCollection("habilitationsPersonnels", habilitationsPersonnelsCollection);
			this.$assets.addCollection("suspensions", suspensionsCollection);
			this.$assets.addCollection("habilitations", habilitationsCollection);
			this.$assets.addCollection("habilitationsTypes", habilitationsTypesCollection);
			this.$assets.addCollection("personnelsFiltered", personnelsFilteredCollection);

		},

		/**
		 * charge la liste des habilitations type depuis le serveur et les charge dans le store
		 */
		loadHabilitationType() {
			this.pending.habilitations = true;
			this.$app.apiGet('v2/habilitation/type')
				.then((data) => {
					this.refreshHabilitationType(data);
				}).catch(this.$app.catchError).finally(() => this.pending.habilitations = false);
		},

		/**
		 *  Charge la liste des formulaires et les enregistre dans le store
		 */

		loadFormulaires() {
			this.pending.formulaires = true
			let route = 'data/GET/formulaire'
			this.$app.apiGet(route)
			.then((data) => {
					this.refreshFormulaires(data);
				}).catch(this.$app.catchError).finally(() => this.pending.formulaires = false);
		}
		/**
		 * Recupère toutes les applications auquelles l'utilisateur connecté à accés avec la licence selectionnée
		 */
		// getFirebaseAppLicence() {
		// 	const auth = getAuth();
		// 	const user = auth.currentUser;
		// 	const appLicences = this.$app.licence;
		// 	const licences = appLicences.users.includes(user.email) ? appLicences.apps : [];
		// 	for (const lic of licences) {
		// 		if (lic.includes("kn")) {
		// 			console.log("J'ai aussi kn regarde");
		// 		}
		// 	}
		// 	console.log(licences);
		// }
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		itemHabilitationSuspension,
		itemPersonnelSuspension,
		FilterFormEcheancier,
		Config,
		AppModal,
		HabilitationList,
		PersonnelList,
		FicheIndividuelleSuiviItem
	},

	mounted() {
		// Ajouter les écouteurs d'événements pour les touches fléchées
		window.addEventListener('keydown', this.handleArrowKeyNavigation);
		
			this.$app.addEventListener('structureChanged', async (structureId) => {
				this.loadHabilitationType();

				this.$store.dispatch('switchStructure', structureId);

				if (this.isConnectedUser) {
					this.initCollections();

					this.pending.habilitations = true;
					try {
						this.loadHabilitationType();
						this.loadFormulaires();
						this.loadCharacteristicPersonnelStats();

						const personnelsCollection = this.$assets.getCollection("personnels");
						// this.$assets.getCollection("suspensions").load();
						await personnelsCollection.load();
						const personnels = personnelsCollection.getCollection();
						let ids = [];
						personnels.forEach(personnel => {
							ids.push(personnel.id);
						});
						this.$assets.getCollection("habilitations").load({
							personnel_id: ids.join(',')
						});
						
						await this.$assets.getCollection("types").load();
						await this.$assets.getCollection("veilles").load();
						await this.$assets.getCollection("personnels").load();
						await this.$assets.getCollection("habilitationsPersonnels").load();
						await this.$assets.getCollection("personnelsFiltered").load();
						// await this.$assets.getCollection("suspensions").load();

						// Mettre à jour currentItemId en fonction des paramètres de l'URL
						const currentItemIdFromURL = parseInt(this.$route.params.id);
						if (!isNaN(currentItemIdFromURL)) {
							this.currentItemId = currentItemIdFromURL;
						}
					}
					catch (e) {
						this.$app.catchError(e);
					}
					finally {
						this.pending.habilitations = false;
					}
				}
				this.idToIndexMap = {};
    this.currentList.forEach((item, index) => {
        this.idToIndexMap[item.id] = index;
    });
		},
		);

		this.$router.push('/types');
	},


			beforeUnmount() {
			// Nettoyer les écouteurs d'événements avant la destruction du composant
			window.removeEventListener('keydown', this.handleKeyDown);
		},

}
</script>