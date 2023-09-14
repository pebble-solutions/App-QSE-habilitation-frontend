<template>
    <div>
        <h4 class="fs-5">Configuration de la veille</h4>
        <div class="mb-3">
            <label for="formPasDeVeille" class="form-label">Pas de veille</label>
            <p class="text-muted">Modifier ici la période entre chaque contrôle de veille sur toutes les habilitations.</p>
            <div class="input-group mb-2">
                <input
                    type="number"
                    class="form-control"
                    id="formPasDeVeille"
                    placeholder="Entrer ici la valeur du pas de veille"
                    v-model="control_step.valeur"
                    required
                />
                <select class="form-select" id="formPasDeVeille1" aria-label="Select type periode" v-model="control_step.periode">
                    <option selected>Mois</option>
                    <option>Jours</option>
                    <option>Années</option>
                </select>
            </div>
        </div>

        <div class="my-3 text-end">
            <button type="button" class="btn btn-admin" @click.prevent="record" :disabled="pending.config">
                <span class="spinner-border spinner-border-sm" v-if="pending.config"></span>
                <i class="bi bi-shield-shaded" v-else></i>
                Appliquer
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            control_step: {
                valeur: null,
                periode : "Mois",
            },

            pending: {
                config: false,
            }
        };
    },

    methods: {
        async record() {
            if (!this.control_step.valeur) {
                window.alert("Veuillez renseigner une valeur afin de modifier le pas de veille.");
            } else {
                if (window.confirm("La modification de cette valeur impacte l'ensemble des veilles sur les habilitations sur cette structure. La valeur du pas de veille de toutes les habilitations sera des lors de "+ this.control_step.valeur+" "+this.control_step.periode+". Souhaitez-vous confirmer ?")) {
                    this.pending.config = true;
                    const veillesCollection = this.$assets.getCollection("veilles");

                     try {
                        for (const veilleHabilitation of veillesCollection.getCollection()) {
                            let veille = veilleHabilitation;
                            veille.control_step = this.controlStepValue();
                            veille.tlc = "Characteristic";
                            veille.tli = veille.objet_id;

                            await this.$app.api.patch('v2/controle/veille/' + veille.id, veille)
                            .then((data) => {
                                veillesCollection.updateCollection([data]);
                            });
                        }
                    } catch (error) {
                        this.$app.catchError(error);
                    } finally {
                        this.pending.config = false;
                    }
                }
            }
        },

        controlStepValue(){
            if (this.control_step.periode === "Mois"){
                return this.control_step.valeur*30;
            } else if (this.control_step.periode === "Années"){
                return this.control_step.valeur*365;
            } else {
                return this.control_step.valeur;
            }
        }
    }
};
</script>
  