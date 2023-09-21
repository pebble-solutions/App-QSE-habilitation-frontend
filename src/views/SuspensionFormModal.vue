<template>
    <AppModal @update-type="updateType" @modal-hide="routeToParent()">
        <!-- <pre class="text-start" v-if="suspension">{{ suspension }}</pre> -->
        <div class="row text-center pb-0" v-if="suspension">
            <!-- Colonne pour le nom de l'habilitation -->
            <div class="col-12 px-2">
                <span class="fw-bold">{{ suspension.habilitation?.habilitationType?.nom }}</span>
            </div>
            <!-- Colonne pour le nom du personnel -->
            <div class="col-12 px-2">
                <p>{{ suspension.habilitation?.personnel?.cache_nom }}</p>

            </div>
            <!-- Colonne pour les dates, la durée et les commentaires -->
            <div class="col-md-12 p-2">
                <div class="card bg-ligh text-secondary">
                    <div class="card-body p-1">
                        <div class="row px-3 align-items-center">
                            <div class="col-12">
                                <span class="fw-bold">Dates:</span>
                            </div>
                            <div v-if="!suspension.df" class="col-12">

                                <p>{{ formatSuspensionText(suspension.dd, suspension.df) }}</p>
                            </div>
                            <div v-else class="col-7 text-end">

                                <p>{{ formatSuspensionText(suspension.dd, suspension.df) }}</p>
                            </div>
                            <div v-if="suspension.df" class="col-4">
                                <input type="date" v-model="suspension.df" class="form-control border-0 px-2"
                                    @change="dateModified = true">
                            </div>
                            <div class="col-12">
                                <span class="fw-bold">Durée:</span>
                                <p>{{ getSuspensionDuration(suspension.dd, suspension.df) }} jours</p>
                            </div>
                            <div class="col-12">
                                <span class="fw-bold">Commentaire:</span>
                                <p>{{ suspension.commentaire }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bouton "Modifier la date de fin de suspension" -->
           <div class="col-12 px-2 mb-1">
    <button class="btn btn-white-custom w-100" :class="{ 'btn-white': isHovered[1] }" @click="modifyDate()"
        @mouseover="onButtonHover(1)" @mouseout="onButtonHover(0)">
        {{ getButtonLabel() }}
    </button>
</div>

            <!-- Bouton "Lever la suspension" -->
            <div class="col-12 px-2 mb-1">
                <button class="btn btn-white-custom w-100" :class="{ 'btn-primary': isHovered[2] }"
                    @mouseover="onButtonHover(2)" @mouseout="onButtonHover(0)">
                    {{ buttonText[1] }}
                </button>
            </div>

            <!-- Bouton "Supprimer la suspension" -->
            <div class="col-12 px-2">
                <button class="btn btn-danger text-white w-100" :class="{ 'btn-white': isHovered[3] }"
                    @mouseover="onButtonHover(3)" @mouseout="onButtonHover(0)">
                    {{ buttonText[2] }}
                </button>
            </div>

        </div>
    </AppModal>
</template>

<script>
import { mapState } from 'vuex';
import AppModal from '../components/pebble-ui/AppModal.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';

export default {
    components: { AppModal, },

    data() {
        return {
            buttonText: [
                'Modifier la date de fin de suspension',
                'Lever la suspension',
                'Supprimer la suspension'
            ],
            suspension: null,
            isHovered: [false, false, false, false], // Initialisation des états de survol
            dateModified: false, // Variable pour suivre la modification de la date
        };
    },

    computed: {
        ...mapState(['pending'])
    },

    methods: {
        modifyDate() {
            if (this.dateModified) {
                // La date a été modifiée, vous pouvez effectuer l'action souhaitée ici
                // Par exemple, envoyer la modification.
            } else {
                // La date n'a pas été modifiée, afficher un message d'erreur
                alert("Vous devez entrer une nouvelle date pour envoyer la modification.");
            }
        },


        isDateModified() {
            // Vérifie si la date df est différente de la date initiale (null ou autre)
            return this.suspension.df !== null && this.suspension.df !== this.suspension.dfInitial;
        },


        onButtonHover(index) {
            if (index === 1) {
                this.buttonText[0] = 'Modifier la date de fin de suspension';
            } else if (index === 2) {
                this.buttonText[1] = 'Lever la suspension';
            } else if (index === 3) {
                this.buttonText[2] = 'Supprimer la suspension';
            } else {
                // Réinitialiser tous les libellés si aucun bouton n'est survolé
                this.buttonText = [
                    'Modifier la date de fin de suspension',
                    'Lever la suspension',
                    'Supprimer la suspension'
                ];
            }
        },

        getButtonLabel() {
            if (this.suspension.df === null) {
                // Si suspension.df est null, affiche "Ajouter une date de fin de suspension"
                return "Ajouter une date de fin de suspension";
            } else {
                // Sinon, affiche le texte standard
                return this.getSuspensionDuration(this.suspension.dd, this.suspension.df) + " jours";
            }
        },
        /**
        * Retourne à la vue précédente
        */
        routeToParent() {
            this.$router.go(-1);
        },

        /**
         * Charge les informations de la suspension passée en paramètre
         * 
         * @param   {number}    id  id de la suspension à charger
         */
        async loadSuspensionData(id) {
            const collection = this.$assets.getCollection("suspensions");

            try {
                this.suspension = await collection.getById(id);
                const assemblerSuspension = new AssetsAssembler([this.suspension]);
                await assemblerSuspension.joinAsset(this.$assets.getCollection("habilitations"), "habilitation_id", "habilitation");
                const habilitation = assemblerSuspension.getResult("habilitation");
                const assemblerHabilitation = new AssetsAssembler(habilitation);
                await assemblerHabilitation.joinAsset(this.$assets.getCollection("personnels"), "personnel_id", "personnel");
                await assemblerHabilitation.joinAsset(this.$assets.getCollection("types"), "habilitation_type_id", "habilitationType");
                this.suspension.habilitation = assemblerHabilitation.getResult()[0];
                // Formater la date de suspension.df au format "aaaa-mm-jj" s'il existe
                if (this.suspension.df) {
                    const dfDate = new Date(this.suspension.df);
                    this.suspension.df = dfDate.toISOString().split('T')[0]; // Format "aaaa-mm-jj"
                }
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
        /**
     * Calcule la durée de la suspension en jours.
     * 
     * @param {string} dd - La date de début.
     * @param {string} df - La date de fin.
     * 
     * @return {number} La durée en jours.
     */
     getSuspensionDuration(dd, df) {
  if (dd) {
    const start = new Date(dd);
    const end = df ? new Date(df) : new Date(); // Utilise la date du jour si df est null
    const timeDifference = end - start;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }
  return 0; // Si la date de début est absente ou incorrecte, la durée est de 0 jours.
},

        /**
      * Formate la date en utilisant les options de format.
      * @return {string} La date formatée en français.
      */
        formatDate(date) {
            if (date) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(date).toLocaleDateString('fr-FR', options);
            }
            return '';
        },

        /**
        * Formate le texte pour l'affichage de la suspension.
        * @param {string} dd - La date de début.
        * @param {string} df - La date de fin.
        * @return {string} Le texte formaté.
        */
        formatSuspensionText(dd, df) {
            if (df) {
                const formattedDD = this.formatDate(dd);

                return `Suspendu du ${formattedDD} au`;
            } else {
                return 'Suspendu le ' + this.formatDate(dd);
            }
        },
    },

    mounted() {
        this.loadSuspensionData(this.$route.params.idSuspension);
    }
}
</script>

<style scoped>
.text-right-align {
    text-align: right;
}

.bg-custom {
    background-color: #f78c6b;
}

.btn-white-custom {
    background-color: #FFFFFF;
    color: #f78c6b;
    border-color: #f78c6b;
}

.btn-white-custom:hover {
    background-color: #f78c6b;
    color: #FFFFFF;
    border-color: #fb835e;
}
</style>