<template>
    <h4 class="fs-5">Configuration de la veille</h4>

    <div class="mb-3">
        <label for="formPasDeVeille" class="form-label">Pas de veille</label>
        <input type="number" class="form-control" id="formPasDeVeille" placeholder="Entrer ici la valeur du pas de veille" :value="control_step">
    </div>

    <div class="my-3 text-end">
        <button type="button" class="btn btn-admin" @click.prevent="record()">
            <span class="spinner-border spinner-border-sm" v-if="pending.config"></span>
            <i class="bi bi-shield-shaded" v-else></i> 
            Appliquer
        </button>
    </div>
</template>

<script>

export default {
    data() {
        return {
            control_step : 180,
            pending: {
                config: false
            }
        }
    },

    methods: {

        /**
         * Enregistre les informations de configuration de la veille sur le serveur et met à jour la configuration locale.
         */
         record() {
            if (window.confirm("La modification de ces paramètres impacte l'ensemble des prochaines veilles sur les habilitations sur cette structure. Souhaitez-vous confirmer ?")) {
                this.pending.config = true;

                ////////////////////////////////////////////////////////////////////////
                // Appel API et modification du store de la config de veille generale //
                ////////////////////////////////////////////////////////////////////////

                // this.$app.apiPost('gtaDeclaration/POST/config', this.control_step)
                // .then(() => {
                //     this.updateConfigGta(this.tmpConfig);
                //     this.$emit('config-gta-update', this.tmpConfig);
                // })
                // .catch(this.$app.catchError).finally(() => this.pending.config = false);

            }
        }

    },

}
</script>