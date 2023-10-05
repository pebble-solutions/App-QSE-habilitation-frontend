<template>
    <AppModal title="Créer une suspension" @modal-hide="routeToParent()">
        <div class="row text-center pb-0">
            <!-- Colonne pour le nom de l'habilitation -->
            <div class="col-12 px-2">
                <span class="fw-bold">{{ habilitationName }}</span>
            </div>
            <!-- Colonne pour le nom du personnel -->
            <div class="col-12 px-2">
                <p>{{ personnelName }}</p>

            </div>
            <!-- Colonne pour les dates, la durée et les commentaires -->
            <div class="col-md-12 p-2">
                <div class="card bg-ligh text-secondary">
                    <div class="card-body p-1">
                        <div class="row px-3 align-items-center">
                            <div class="col-12 mt-2">
                                <span class="fw-bold">Dates:</span>
                            </div>
                            <div class="mb-3 col-6">
                                <span class="fw-bold">Date de début:</span>
                                <input type="date" v-model="suspension.dd" class="form-control border-0 px-2" required>
                            </div>
                            <div class="mb-3 col-6">
                                <span class="fw-bold">Date de fin:</span>
                                <input type="date" v-model="suspension.df" class="form-control border-0 px-2" required>
                            </div>
                            <div class="col-12 mt-3 mb-3">
                                <span class="fw-bold">Commentaire:</span>
                                <div class="form-floating mt-1">
                                    <textarea class="form-control" placeholder="Laissez un commentaire ici..." id="floatingTextareaCommentaireSuspension" style="height: 100px;" v-model="suspension.commentaire"></textarea>
                                    <label for="floatingTextareaCommentaireSuspension">Commentaire</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bouton "Modifier la date de fin de suspension" -->
            <div class="col-12 px-2 mb-1">
                <button class="btn btn-white-custom w-100" :class="{ 'btn-white': isHovered }" @click="modifyDate()">
                    <div v-if="pending.buttonModif" class="spinner-border text-primary" role="status">
                        <span>Loading...</span>
                    </div>
                    <span v-else>Ajouter la suspension</span>
                </button>
            </div>

        </div>
    </AppModal>
</template>

<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
import { mapState } from 'vuex';

export default {
    components: { AppModal},

    data() {
        return {
            suspension: {
                characteristic__personnel_id : null,
                dd : null,
                df: null,
                commentaire :null
            }, // Initialisation la valeur de l'objet de la suspension

            isHovered: false, // Initialisation l'état de survol
        
            dateDeFin : null,

            pending : {
                buttonModif : false, // Initialisation de l'etat de chargement du bouton 
            }
        };
    },

    computed:{

        ...mapState(['personnels', 'suspensions', 'habilitationsPersonnels']),

        personnelName(){
            return this.personnels.find(e => e.id == this.$route.params.id).cache_nom
        },

        habilitationName(){
            let habilitation = this.$assets.getCollection('habilitationsPersonnels').getCollection().find(e => e.id == this.$route.params.idHabilitation);
            return this.$assets.getCollection('types').getCollection().find(e => e.id == habilitation.characteristic_id).nom;
        }
    },

    methods: {

        modifyDate(){
            this.pending.buttonModif = true 
            if (!this.suspension.dd && !this.suspension.df) {
                alert("Vous devez entrer une nouvelle date de début et une nouvelle date de fin pour envoyer la création.")
            } else {
                this.suspension.characteristic__personnel_id = this.$route.params.idHabilitation;
                console.log(this.suspension)
                if (confirm("Etes vous sur de vouloir créer cette suspension?")){  
                    this.$app.api.post('/v2/habilitation/suspension',
                        this.suspension
                    )
                    .then(() => {
                        alert('La suspension à bien été créé');
                        this.$assets.getCollection("suspensions").load();
                    })
                    .catch(this.$app.catchError)
                    .finally(() => {
                        this.routeToParent();
                    });
                }
            }
            this.pending.buttonModif = false
        },

        /**
        * Retourne à la vue précédente
        */
        routeToParent() {
            this.$router.go(-1);
        },
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