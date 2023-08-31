<template>
    <div>
        <h4 class="fs-5">Ajouter une nouvelle tâche</h4>

        <div class="mb-3">
            <label for="formNomTache" class="form-label">Titre</label>
            <input type="text" class="form-control  w-50" id="formNomTache" placeholder="Entrer ici le nom de la nouvelle tâche">
        </div>
        <div class="mb-3">
            <label for="formDescriptionTache" class="form-label">Description</label>
            <textarea class="form-control w-50" id="formDescriptionTache" rows="3" placeholder="Entrer ici une description de la nouvelle tâche"></textarea>
        </div>
        <div class="mb-3">
            <label for="formTypeTache" class="form-label">Type</label>
            <span class="text-secondary"><br/>Definissez ici le type de retour souhaité pour valider la tâche</span>
            <select class="form-select mt-1 w-50" id="formTypeTache" aria-label="Select type tache">
                <option selected>Document</option>
                <option value="1">Controle</option>
                <option value="2">Vérification</option>
                <option value="3">Signature</option>
            </select>
        </div>
    </div>

    <div>
        <h4 class="fs-5">Configurer une nouvelle procédure</h4>
    
        <span>Ajouter une nouvelle tâche</span>

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
            pending: {
                config: false
            }
        }
    },

    methods: {

        /**
         * Enregistre les informations de configuration de procédure sur le serveur et met à jour la configuration locale.
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