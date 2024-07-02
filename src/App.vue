<template>
	<AppWrapper :cfg="cfg" :cfg-menu="cfgMenu" :cfg-slots="cfgSlots" @auth-change="setLocal_user"
		@config-menu="displayConfig = true">
		<template v-slot:header></template>
		<template v-slot:list>
			<AppMenu v-if="listMode === 'programmer'">
				<HabilitationList />
			</AppMenu>
			<AppMenu v-else-if="listMode === 'habilitation'">
				<input type="text" class="form-control my-2 px-2" placeholder="Rechercher..." v-model="displaySearch" />
				<div v-if="!pending.habilitations">
					<AppMenuItem :href="'/types/' + type.id" icon="bi bi-patch-check-fill" :key="type.id"
						v-for="type in listConsultation(types)">
						{{ cleanTypeName(type.nom) }}
					</AppMenuItem>

					<div class="alert alert-warning italic" role="alert"
						v-if="listConsultation(types).length === 0 && types.length === 0">
						Aucune habilitation renseignée sur cette structure
					</div>
					<div class="alert alert-warning italic" role="alert"
						v-else-if="listConsultation(types).length === 0 && displaySearch">
						Aucune habilitation renseignée avec cette recherche
					</div>
				</div>
				<div class="text-center" v-else>
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'echeancier'">
				<FilterFormEcheancier />
			</AppMenu>
			<AppMenu v-else-if="listMode === 'registre'">
				<FilterFormRegistre />
			</AppMenu>
			<AppMenu v-else-if="listMode === 'operateur'">
				<PersonnelList v-slot="personnelProps">
					<FicheIndividuelleSuiviItem :agent="personnelProps.personnel"
						:stats="getStatsByAgent(personnelProps.personnel.id)" v-if="personnelProps" />
				</PersonnelList>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'suspension'">
				<SuspensionsFilter />
			</AppMenu>
			<AppMenu v-else>
				<AppMenuItem :href="getItemLink(item)" v-for="item in currentList" :key="item.id">
					<template v-if="showPersonnels">
						<itemPersonnelSuspension :personnel="item" :icon="'bi bi-person-fill'" :num="item.id" />
					</template>
					<template v-else>
						<itemHabilitationSuspension :habilitation="item" :icon="'bi bi-patch-check-fill'"
							:num="item.id" />
					</template>
					<a>
						{{ showPersonnels ? item.personnel_name : item.habilitation_name }}
					</a>
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="px-2">
				<router-view v-if="isConnectedUser" />
			</div>

			<AppModal title="Configuration du module" id="configModule" :display="displayConfig" :close-btn="true"
				class-name="modal-dialog-scrollable modal-xl" @modal-hide="displayConfig = false">
				<Config v-if="!pending.config" />
			</AppModal>
		</template>
	</AppWrapper>
</template>

<script>
import AppWrapper from "@/components/pebble-ui/AppWrapper.vue";
import AppMenu from "@/components/pebble-ui/AppMenu.vue";
import AppMenuItem from "@/components/pebble-ui/AppMenuItem.vue";
import { mapState, mapActions } from "vuex";
import { AssetsCollection } from "./js/app/services/AssetsCollection";
import { ROUTES_NAMES } from "./js/route";
import itemHabilitationSuspension from "@/components/itemHabilitationSuspension.vue";
import itemPersonnelSuspension from "@/components/itemPersonnelSuspension.vue";
import FilterFormEcheancier from "./components/echeancier/FilterForm.vue";
import Config from "./components/config/Config.vue";
import AppModal from "./components/pebble-ui/AppModal.vue";
import HabilitationList from "./components/menuList/HabilitationList.vue";
import PersonnelList from "@/components/PersonnelList.vue";
import FicheIndividuelleSuiviItem from "@/components/menuList/FicheIndividuelleSuiviItem.vue";
import FilterFormRegistre from "./components/registre/FilterForm.vue";
import SuspensionsFilter from "./components/filter/SuspensionsFilter.vue";

import CONFIG from "@/config.json";

export default {
	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				habilitations: false,
				config: false,
				formulaires: false,
			},
			isConnectedUser: false,
			displaySearch: "",
			currentList: [],
			displayConfig: false,
			characteristicPersonnelStats: [],
		};
	},

	computed: {
		...mapState(["habilitationType", "types", "personnels"]),

		listMode() {
			return this.getRouteGroupName(this.$route.name);
		},

		listItems() {
			return this.showPersonnels ? this.personnels : this.habilitations;
		},
	},

	methods: {
		...mapActions(["refreshHabilitationType", "refreshFormulaires"]),

		cleanTypeName(name) {
			return name.startsWith("Habilitation : ") ? name.substr(14) : name;
		},

		isActiveItem(item) {
			return this.openedElement && this.openedElement.id === item.id;
		},

		getRouteGroupName(routeName) {
			for (const groupName in ROUTES_NAMES) {
				const names = ROUTES_NAMES[groupName];
				if (names.includes(routeName)) {
					return groupName;
				}
			}
			return null;
		},

		getStatsByAgent(personnelId) {
			let statsByAgent = this.characteristicPersonnelStats.find(
				(e) => e.personnel_id == personnelId
			);
			return statsByAgent;
		},

		loadCharacteristicPersonnelStats() {
			this.pending.stats = true;
			this.$app
				.apiGet("v2/characteristicPersonnel/stats")
				.then((data) => {
					this.characteristicPersonnelStats = data;
				})
				.catch(this.$app.catchError)
				.finally(() => {
					this.pending.stats = false;
				});
		},

		setLocal_user(user) {
			if (user) {
				this.$store.dispatch("login", user);
				this.isConnectedUser = true;
			} else {
				this.$store.dispatch("logout");
				this.isConnectedUser = false;
			}
		},

		listConsultation(list) {
			let typeFiltred = list;
			if (this.displaySearch) {
				const searchInput = this.displaySearch.trim();
				if (/^\d+$/.test(searchInput)) {
					typeFiltred = typeFiltred.filter((item) =>
						searchInput.includes(item.id)
					);
				} else if (/^[a-zA-Z]+$/.test(searchInput)) {
					const searchPattern = new RegExp(searchInput, "i");
					typeFiltred = typeFiltred.filter((item) =>
						item.nom?.toUpperCase().match(searchPattern)
					);
				} else {
					if (
						confirm(
							'Cette recherche n\'est pas acceptée: "' +
							this.displaySearch +
							'". Filtre sur caractères numériques et alphabétiques uniquement.'
						)
					) {
						this.displaySearch = "";
					}
				}
			}
			return typeFiltred;
		},

		listPersonnel(list) {
			let personnelFiltered = list;
			personnelFiltered.sort((a, b) => {
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
			return personnelFiltered;
		},

		initCollections() {
			const typesCollection = new AssetsCollection(this, {
				assetName: "types",
				apiRoute: "v2/habilitation/type",
			});
			typesCollection.reset();

			const veillesCollection = new AssetsCollection(this, {
				assetName: "veilles",
				apiRoute: "v2/controle/veille",
			});
			veillesCollection.reset();

			const personnelsCollection = new AssetsCollection(this, {
				assetName: "personnels",
				apiRoute: "v2/personnel",
				requestPayload: {
					limit: "aucune",
				},
			});
			personnelsCollection.reset();

			const habilitationsPersonnelsCollection = new AssetsCollection(this, {
				assetName: "habilitationsPersonnels",
				apiRoute: "v2/characteristic/personnel",
				requestPayload: {
					last_control: 1,
					limit: "aucune",
				},
			});
			habilitationsPersonnelsCollection.reset();

			const suspensionsCollection = new AssetsCollection(this, {
				assetName: "suspensions",
				apiRoute: "v2/habilitation/suspension",
			});
			suspensionsCollection.reset();

			const habilitationsCollection = new AssetsCollection(this, {
				assetName: "habilitations",
				apiRoute: "v2/habilitation",
			});
			habilitationsCollection.reset();

			const habilitationsTypesCollection = new AssetsCollection(this, {
				assetName: "habilitationsTypes",
				apiRoute: "v2/controle/habilitation/type",
			});
			habilitationsTypesCollection.reset();

			const personnelsFilteredCollection = new AssetsCollection(this, {
				name: "personnelsFiltered",
				assetName: "personnelsFiltered",
				apiRoute: "v2/personnel",
			});
			personnelsFilteredCollection.reset();

			this.$assets.addCollection("types", typesCollection);
			this.$assets.addCollection("veilles", veillesCollection);
			this.$assets.addCollection("personnels", personnelsCollection);
			this.$assets.addCollection(
				"habilitationsPersonnels",
				habilitationsPersonnelsCollection
			);
			this.$assets.addCollection("suspensions", suspensionsCollection);
			this.$assets.addCollection("habilitations", habilitationsCollection);
			this.$assets.addCollection(
				"habilitationsTypes",
				habilitationsTypesCollection
			);
			this.$assets.addCollection(
				"personnelsFiltered",
				personnelsFilteredCollection
			);
		},

		loadHabilitationType() {
			this.pending.habilitations = true;
			this.$app
				.apiGet("v2/habilitation/type")
				.then((data) => {
					this.refreshHabilitationType(data);
				})
				.catch(this.$app.catchError)
				.finally(() => (this.pending.habilitations = false));
		},

		loadFormulaires() {
			this.pending.formulaires = true;
			let route = "data/GET/formulaire";
			this.$app
				.apiGet(route)
				.then((data) => {
					this.refreshFormulaires(data);
				})
				.catch(this.$app.catchError)
				.finally(() => (this.pending.formulaires = false));
		},
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
		FicheIndividuelleSuiviItem,
		FilterFormRegistre,
		SuspensionsFilter,
	},

	mounted() {
		this.$app.addEventListener("structureChanged", async (structureId) => {
			this.loadHabilitationType();
			this.$store.dispatch("switchStructure", structureId);

			if (this.isConnectedUser) {
				this.initCollections();

				const personnelsCollection = this.$assets.getCollection("personnels");
				this.$assets.getCollection("suspensions").load();
				await personnelsCollection.load();
				const personnels = personnelsCollection.getCollection();
				let ids = [];
				personnels.forEach((personnel) => {
					ids.push(personnel.id);
				});
				this.$assets.getCollection("habilitations").load({
					personnel_id: ids.join(","),
				});

				await this.$assets.getCollection("types").load();
				await this.$assets.getCollection("veilles").load();
				await this.$assets.getCollection("personnels").load();
				await this.$assets.getCollection("habilitationsPersonnels").load();
				await this.$assets.getCollection("personnelsFiltered").load({
					withContratFilter: 1,
					ordre: "croissant",
					limit: "aucune",
				});
				this.pending.habilitations = true;
				try {
					this.loadHabilitationType();
					this.loadFormulaires();
					this.loadCharacteristicPersonnelStats();

					const personnelsCollection = this.$assets.getCollection("personnels");
					await personnelsCollection.load();
					const personnels = personnelsCollection.getCollection();
					let ids = [];
					personnels.forEach((personnel) => {
						ids.push(personnel.id);
					});
					this.$assets.getCollection("habilitations").load({
						personnel_id: ids.join(","),
					});

					await this.$assets.getCollection("types").load();
					await this.$assets.getCollection("veilles").load();
					await this.$assets.getCollection("personnels").load();
					await this.$assets.getCollection("habilitationsPersonnels").load();
					this.$assets.getCollection("personnelsFiltered").reset();
					await this.$assets.getCollection("personnelsFiltered").load();
				} catch (e) {
					this.$app.catchError(e);
				} finally {
					this.pending.habilitations = false;
				}
			}
			this.idToIndexMap = {};
			this.currentList.forEach((item, index) => {
				this.idToIndexMap[item.id] = index;
			});
		});

		this.$router.push("/types");
	},
};
</script>

<style lang="scss">
@import "./variables";

.fs-7 {
	font-size: 0.8rem !important;
}

.progress-ht {
	height: 25px !important;
}

.list-group-item.active {
	z-index: 2;
	color: var(--bs-list-group-active-color) !important;
	background-color: $theme-color !important;
	border-color: $theme-color !important;
	border-top: solid 15px $theme-color !important;
	border-bottom: solid 15px $theme-color !important;
	font-size: 110%;
	font-weight: bold;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.565);
}
</style>