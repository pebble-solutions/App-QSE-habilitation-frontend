<template>
	<div class="container py-4">
		<h1>{{ $route.params.id }}</h1>
		{{ el }}
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