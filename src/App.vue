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


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
				<AppMenuItem href="/registre" look="dark" icon="bi bi-app">Registre d'habilitation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu>
				<AppMenuItem :href="'/registre/'+ personnelHabilite.id" icon="bi bi-person" v-for="personnelHabilite in personnelHabilites()" :key="personnelHabilite.id">{{personnelHabilite.cache_nom}}</AppMenuItem>
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
		...mapState(['elements', 'openedElement', 'habilitations', 'personnels'])
	},

	methods: {

		// personnelHabilites(){
		// 	let personnelHabilite = [];

		// 	for(let personnel of this.personnels){
		// 		for(let habilitation of this.habilitations){
		// 			if(personnel.id == habilitation.personnel_id){
		// 				personnelHabilite.push(personnel)
		// 			}
		// 		}
		// 	}

		// 	return personnelHabilite;
		// },
		personnelHabilites() {
			const personnelHabiliteSet = new Set();
			for (const habilitation of this.habilitations) {
				const personnel = this.personnels.find(personnel => personnel.id === habilitation.personnel_id);
				if (personnel) {
					personnelHabiliteSet.add(personnel);
				}
			}
			console.log(personnelHabiliteSet)
			return Array.from(personnelHabiliteSet);
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
		 * Initialise les collections de données au niveau du contrôleur d'assets
		 */
		initCollections() {
			const elementsCollection = new AssetsCollection(this, {
				assetName: 'elements',
				apiRoute: 'v2/sample'
			});

			
			const typesCollection = new AssetsCollection(this, {
				assetName: 'types',
				apiRoute: 'v2/sample/types'
			});
			
			const habilitationCollection = new AssetsCollection(this, {
				assetName: 'habilitations',
				apiRoute: 'v2/habilitation'
			});

			const habilitationTypeCollection = new AssetsCollection(this, {
				assetName: 'habilitationType',
				apiRoute: 'v2/habilitation/type'
			});
			
			const personnelsCollection = new AssetsCollection(this, {
				assetName: 'personnels',
				apiRoute: 'v2/personnel'
			});
			
			habilitationCollection.reset();
			personnelsCollection.reset();
			elementsCollection.reset();
			typesCollection.reset();
			habilitationTypeCollection.reset();

			this.$assets.addCollection("elements", elementsCollection);
			this.$assets.addCollection("types", typesCollection);
			this.$assets.addCollection("habilitations", habilitationCollection);
			this.$assets.addCollection("personnels", personnelsCollection);
			this.$assets.addCollection("habilitationType", habilitationTypeCollection);
			
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
					this.$assets.getCollection("elements").load();

					const personnelsCollection = this.$assets.getCollection("personnels");
					
					await personnelsCollection.load();

					const personnels = personnelsCollection.getCollection();

					let ids = [];

					personnels.forEach(personnel => {
						ids.push(personnel.id);
					});

					const collection = this.$assets.getCollection("habilitations");
					collection.requestPayload = {
						personnel_id: ids.join(",")
					};

					this.$assets.getCollection("habilitations").load();
					this.$assets.getCollection("habilitationType").load();
				}
				catch (e) {
					this.$app.catchError(e);
				}
				finally {
					this.pending.elements = false;
				}
			}
		});

	}

}
</script>