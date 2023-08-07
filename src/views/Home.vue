<template>
	<div class="py-2" v-if="$store.state.login">
		<div>
			<img src="@/assets/pebble-dev.png" alt="Pebble Dev" class="logo w-100">
		</div>
		<h1 class="text-center">Bienvenue dans votre nouvelle application</h1>
		<hr>
		
		<form class="card my-4" method="post" @submit.prevent="recordNew()" v-if="tmpElement">
			<div class="card-body">
				<h2>Créer un nouvel enregistrement</h2>
				<div class="mb-3">
					<label for="element_name" class="form-label">Nom</label>
					<input type="text" class="form-control" id="element_name" name="name" v-model="tmpElement.name">
				</div>

				<div class="mb-3">
					<label for="element_description" class="form-label">Description</label>
					<textarea type="text" class="form-control" id="element_description" name="description" v-model="tmpElement.description"></textarea>
				</div>

				<button class="btn btn-primary btn-lg" type="submit" :disabled="pending.element">
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.element"></span>
					Créer
				</button>
			</div>
		</form>
		
		<h2>Bibliothèques pré-installés</h2>
		<ul>
			<li><a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/" target="_blank">Bootstrap 5</a></li>
			<li><a href="https://icons.getbootstrap.com/" target="_blank">Bootstrap icons</a></li>
			<li><a href="https://router.vuejs.org/" target="_blank">Vue Router</a></li>
			<li><a href="https://vuex.vuejs.org/" target="_blank">Vue X (store)</a></li>
		</ul>

		<h2>Outils de développement</h2>
		<ul>
			<li><strong><a href="https://github.com/cairnmanagement/pebble-ui" target="_blank">pebble-ui</a></strong> (module vuejs)</li>
			<li><strong><a href="https://github.com/cairnmanagement/appjs" target="_blank">APP.js</a></strong> (fonctions de gestion de l'application et de connexion à l'API)</li>
		</ul>
		<h2>Pour bien démarrer</h2>
		<ol>
			<li>Lisez la documentation de <strong><a href="https://github.com/cairnmanagement/sample-app">pebbleapp</a></strong> pour rester à jour</li>
			<li>Configurez la base de votre application dans /src/config.json</li>
			<li>Ne modifiez pas les sous-modules (/src/components/pebble-ui, /src/js/app). Ceux-ci se mettent à jour via pebbleapp.</li>
			<li>Développez vos vues dans /src/views et vos composants d'interface dans /src/components</li>
		</ol>
	</div>
</template>

<style lang="scss" scoped>
.logo {
	max-width:360px;
	display:block;
	margin:20px auto;
}
</style>

<script>

export default {
	name: 'Home',

	data() {
		return {
			pending: {
				element: false
			},
			tmpElement: {
				name: "",
				description: ""
			}
		}
	},

	methods: {
		/**
		 * Enregistre un nouvel élément.
		 * Étape 1 : appel la fonction record
		 * Étape 2 : enregistre la modification dans le store
		 * Étape 3 : redirige la route vers le nouvel élément
		 */
		async recordNew() {
			this.pending.element = true;

			try {
				const data = await this.$app.api.post('v2/sample', this.tmpElement, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
				this.$store.dispatch("updateElements", [data]);
				this.$router.push('/element/'+data.id);
			} catch (e) {
				this.$app.catchError(e);
			} finally {
				this.pending.element = false;
			}
		}
	}
}
</script>
