<template>
	<div class="container py-4">
		<h1>À propos</h1>
		<p>
			{{cfg.moduleLabel}} pour Pebble 5
		</p>
		<p>
			bla bla bla
			bla bla bla
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