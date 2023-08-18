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
		<!-- <template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
				<AppMenuItem href="/about" look="dark" icon="bi bi-app">À propos</AppMenuItem>
			</AppMenu>
		</template> -->

		<template v-slot:list>
			<AppMenu>
				<input type="text" class="form-control my-2 px-2" placeholder="Rechercher..." v-model="displaySearch" >
				<!-- <AppMenuItem :href="'/element/'+el.id" icon="bi bi-file-earmark" v-for="el in elements" :key="el.id">{{el.name}}</AppMenuItem> -->
				<AppMenuItem :href="'/types/'+type.id" icon="bi bi-gear" v-for="type in  listConsultation(habilitationType)" :key="type.id" >{{ type.nom }}</AppMenuItem>
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
import { mapState,mapActions } from 'vuex'
import { AssetsCollection } from './js/app/services/AssetsCollection'

import CONFIG from "@/config.json"

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true,
				habilitations: false,
			},
			isConnectedUser: false,
			displaySearch: '',
		}
	},

	computed: {
		...mapState(['elements', 'openedElement', 'habilitationType' ]) 
	},

	methods: {
		...mapActions(['refreshHabilitationType']),

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
					if (confirm('Cette recherche n\'est pas acceptée: "'+ this.displaySearch +'". Filtre sur caractères numériques et alphabétiques uniquement.')) {
						this.displaySearch = '';
					}
				}
			}
			return typeFiltred;

		},

		/**
		 * Initialise les collections de données au niveau du contrôleur d'assets
		 */
		initCollections() {
			const elementsCollection = new AssetsCollection(this, {
				assetName: 'elements',
				apiRoute: 'v2/sample'
			});

			elementsCollection.reset();

			const typesCollection = new AssetsCollection(this, {
				assetName: 'types',
				apiRoute: 'v2/habilitation/type'
			});
			typesCollection.reset();

			const veillesCollection = new AssetsCollection (this, {
				assetName: 'veilles',
				apiRoute: 'v2/controle/veille'
			});
			const personnels = new AssetsCollection (this, {
				assetName: 'personnels',
				apiRoute: 'v2/personnel'
			});


			this.$assets.addCollection("elements", elementsCollection);
			this.$assets.addCollection("types", typesCollection);
			this.$assets.addCollection("veilles", veillesCollection);
			this.$assets.addCollection("personnels", personnels);


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
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem
	},

	mounted() {
		this.$app.addEventListener('structureChanged', async (structureId) => {
			this.loadHabilitationType();

			this.$store.dispatch('switchStructure', structureId);

			this.$router.push('/');
			if (this.isConnectedUser) {
				this.initCollections();

				this.pending.elements = true;
				try {
					await this.$assets.getCollection("elements").load();
					await this.$assets.getCollection("types").load();
					await this.$assets.getCollection("veilles").load();
					await this.$assets.getCollection("personnels").load();


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