<template>
	<AppWrapper :cfg="cfg" :cfg-menu="cfgMenu" :cfg-slots="cfgSlots" @auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2 d-flex align-items-center" v-if="openedElement">
				<router-link to="/" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-arrow-left"></i>
					</a>
				</router-link>
				<router-link :to="'/element/' + openedElement.id + '/properties'" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-file-earmark me-1"></i>
						{{ openedElement.name }}
					</a>
				</router-link>

				<div class="dropdown">
					<button class="btn btn-dark dropdown-toggle" type="button" id="fileDdMenu" data-bs-toggle="dropdown"
						aria-expanded="false">
						Fichier
					</button>
					<ul class="dropdown-menu" aria-labelledby="fileDdMenu">
						<li>
							<router-link :to="'/element/' + openedElement.id + '/informations'" custom
								v-slot="{ navigate, href }">
								<a class="dropdown-item" :href="href" @click="navigate">Informations</a>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</template>


		<!-- Menu additionnel -->
		<!--
Modifier cfgSlots.menu = true; dans config.json pour activer.
-->
		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
				<AppMenuItem href="/suspensions" look="dark" icon="bi bi-app">Suspensions</AppMenuItem>
			</AppMenu>
		</template>



		<!-- Bouton de commutation et Affichage de la liste -->
		<template v-slot:list>
			<div>
				<div class="d-flex mt-3">
					<button class="btn w-100 mx-1"
						:class="['btn', { 'btn-primary': showPersonnels, 'btn-secondary': !showPersonnels }]"
						@click="toggleShow(true)">
						Personnels
					</button>
					<button class="btn w-100 mx-1"
						:class="['btn', { 'btn-primary': !showPersonnels, 'btn-secondary': showPersonnels }]"
						@click="toggleShow(false)">
						Habilitations
					</button>
				</div>

				<div class="mt-4">
					<AppMenu v-if="pending.elements">
						<div class="text-center">
							<div class="spinner-border text-primary" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
					</AppMenu>
					<AppMenu v-else>
						<AppMenuItem :href="getItemLink(item)" v-for="item in currentList" :key="item.id">

							<itemPersonnelSuspension v-if="showPersonnels" :personnel="item" :icon="'bi bi-person-fill'"
								:num="item.id" />


							<itemHabilitationSuspension v-else :habilitation="item" :icon="'bi bi-patch-check-fill'"
								:num="item.id" />

							<a>
								{{ showPersonnels ? item.personnel_name : item.habilitation_name }}
							</a>
						</AppMenuItem>
					</AppMenu>

				</div>
			</div>
		</template>


		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view v-if="isConnectedUser" />
			</div>
		</template>

	</AppWrapper>
</template>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import { mapState } from 'vuex'
import { AssetsCollection } from './js/app/services/AssetsCollection'
import itemPersonnelSuspension from './components/itemPersonnelSuspension.vue'
import itemHabilitationSuspension from './components/itemHabilitationSuspension.vue'

import { getAuth } from '@firebase/auth';

import CONFIG from "@/config.json"

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true
			},
			isConnectedUser: false,
			showPersonnels: true,
			currentList: [], // Initial empty list
		}
	},

	computed: {
		...mapState(['elements', 'openedElement', 'personnels', 'suspensions', 'habilitations', 'types']),

		/**
 * Retourne la liste des personnels si `showPersonnels` est `true`, sinon retourne la liste des habilitations.
 * @returns {Array} - La liste des personnels ou habilitations en fonction de la valeur de `showPersonnels`.
 */
		listItems() {
			return this.showPersonnels ? this.personnels : this.habilitations;
		},
	},


	methods: {


		/**
		 * Bascule l'affichage entre les personnels et les habilitations, et met à jour la liste courante.
		 * 
		 * @param {boolean} showPersonnels - Si vrai, affiche les personnels. Sinon, affiche les habilitations.
		 */
		toggleShow(showPersonnels) {
			this.showPersonnels = showPersonnels;
			this.currentList = showPersonnels ? this.personnels : this.habilitations;
		},

		/**
		 * Génère un lien basé sur l'élément donné, en fonction de l'affichage actuel (personnels ou habilitations).
		 * 
		 * @param {Object} item - L'élément pour lequel générer le lien.
		 * 
		 * @returns {string} - Le lien généré pour l'élément donné.
		 */
		getItemLink(item) {
			if (this.showPersonnels) {
				return `/suspensions/personnel/${item.id}`;
			} else {
				// Ajustez la route pour les habilitations si nécessaire
				return `/suspensions/habilitation/${item.id}`;
			}
		},

		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * 
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
		 * Initialise les collections de données au niveau du contrôleur d'assets
		 */
		initCollections() {


			// Create a collection de personnels
			const personnelsCollection = new AssetsCollection(this, {
				assetName: 'personnels',
				apiRoute: 'v2/personnel'
			});

			// reset the collection if exist before
			personnelsCollection.reset();

			// Add the collection
			this.$assets.addCollection("personnels", personnelsCollection);



			// Create a collection de suspensions
			const suspensionsCollection = new AssetsCollection(this, {
				assetName: 'suspensions',
				apiRoute: 'v2/habilitation/suspension'
			});

			// reset the collection if exist before
			suspensionsCollection.reset();

			// Add the collection
			this.$assets.addCollection("suspensions", suspensionsCollection);

			//create a collection d'habilitations

			const habilitationsCollection = new AssetsCollection(this, {
				assetName: 'habilitations',
				apiRoute: 'v2/habilitation'
			});

			// reset the collection if exist before
			habilitationsCollection.reset();

			// Add the collection
			this.$assets.addCollection("habilitations", habilitationsCollection);

		},

		/**
		 * Recupère toutes les applications auquelles l'utilisateur connecté à accés avec la licence selectionnée
		 */
		getFirebaseAppLicence() {
			const auth = getAuth();
			const user = auth.currentUser;

			const appLicences = this.$app.licence;

			const licences = appLicences.users.includes(user.email) ? appLicences.apps : [];

			for (const lic of licences) {
				if (lic.includes("kn")) {
					console.log("J'ai aussi kn regarde");

				}
			}

			console.log(licences);
		}
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		itemPersonnelSuspension,
		itemHabilitationSuspension,
	},

	mounted() {
		this.$app.addEventListener('structureChanged', async (structureId) => {

			this.$store.dispatch('switchStructure', structureId);

			this.$router.push('/');
			if (this.isConnectedUser) {
				this.initCollections();

				this.pending.elements = true;
				try {
					// Load all suspensions
					const personnelsCollection = this.$assets.getCollection("personnels");
					this.$assets.getCollection("suspensions").load();
					await personnelsCollection.load();

					const personnels = personnelsCollection.getCollection();

					let ids = [];

					personnels.forEach(personnel => {
						ids.push(personnel.id);
					});

					this.$assets.getCollection("habilitations").load({
						personnel_id: ids.join(',')
					});
				}
				catch (e) {
					this.$app.catchError(e);
				}
				finally {
					this.pending.elements = false;
				}
			}
			this.getFirebaseAppLicence();
		});
	}

}
</script>
