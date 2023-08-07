<template>
	<div class="container py-4">
		<h1>À propos</h1>
		<p>
			{{cfg.moduleLabel}} pour Pebble 5
		</p>
		<p>
			Développeurs : Guillaume MODARD, Killian KOPP
		</p>

		<h2>Licences</h2>
		<p>
			Ce projet est distribué sous la <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">licence GNU GPL V3</a>.
		</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			cfg: null
		}
	},

	beforeMount() {
		this.cfg = this.$app.cfg;
	}
}
</script>