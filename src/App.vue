<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2 d-flex align-items-center" v-if="openedElement">
				<router-link to="/" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-arrow-left"></i>
					</a>
				</router-link>
				<router-link :to="'/element/'+openedElement.id+'/properties'" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-file-earmark me-1"></i>
						{{openedElement.name}}
					</a>
				</router-link>

				<div class="dropdown">
					<button class="btn btn-dark dropdown-toggle" type="button" id="fileDdMenu" data-bs-toggle="dropdown" aria-expanded="false">
						Fichier
					</button>
					<ul class="dropdown-menu" aria-labelledby="fileDdMenu">
						<li>
							<router-link :to="'/element/'+openedElement.id+'/informations'" custom v-slot="{ navigate, href }">
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

		<template v-slot:list>
			<AppMenu>
				<AppMenuItem :href="'/suspensions/'+el.id" icon="bi bi-file-earmark" v-for="el in suspensions" :key="el.id">{{el}}</AppMenuItem>
			</AppMenu>
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
			isConnectedUser: false
		}
	},

	computed: {
		...mapState(['elements', 'openedElement', 'suspensions'])
	},

	methods: {
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
		 * Initialise les collections de données au niveau du contrôleur d'assets
		 */
		initCollections() {
			const elementsCollection = new AssetsCollection(this, {
				assetName: 'elements',
				apiRoute: 'v2/habilitation/type'
			});

			elementsCollection.reset();

			const typesCollection = new AssetsCollection(this, {
				assetName: 'types',
				apiRoute: 'v2/habilitation/type'
			});

			typesCollection.reset();

			this.$assets.addCollection("elements", elementsCollection);
			this.$assets.addCollection("types", typesCollection);






			// Create a collection
			const suspensionsCollection = new AssetsCollection(this, {
				assetName: 'suspensions',
				apiRoute: 'v2/habilitation/suspension'
			});

			// reset the collection if exist before
			suspensionsCollection.reset();

			// Add the collection
			this.$assets.addCollection("suspensions", suspensionsCollection);
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
		AppMenuItem
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
					this.$assets.getCollection("suspensions").load();
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