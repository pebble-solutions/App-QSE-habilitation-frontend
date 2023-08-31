<template>
    <div>
        <div v-if="!pending.veille">
            {{ configVeille }}
            <div class="row mb-2">
                    <label for="intitule" class="form-label">Nom</label>
                    <input class="form-control" name="intitule" id="intitule" type="text" v-model="veille.nom">
            </div>
            <div class="row  mb-2">
                    <div class="col-6">
                        <label for="dd" class="form-label">Date de début</label>
                        <input type="date" format="YYYY-MM-DD" class="form-control" id="dd" v-model="veille.dd">
                    </div>
                    <div class="col-6">
                        <label for="df" class="form-label">date de fin</label>
                        <input type="date" class="form-control" id="df" v-model="veille.df">
                    </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <label for="formulaire" class="form-label">Formulaire associé</label>
                    <input class="form-control" id ="formulaire_id" v-model="veille.formulaire_id">
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <label for="pasDeVeille" class="form-label">Pas de veille (jours)</label>
                    <input class="form-control" id ="pasDeVeille" type="number" v-model="veille.control_step">
                </div>
            </div>
        </div>
    </div>
</template>
<script>


export default{

    props: {
        configVeille: Object,
    },

    data(){
        return {
            pending: {
                type: false
            },
            veille: {
                nom: '',
                dd: '',
                df: '',
                formulaire_id: '',
                control_step:'',
            }
        }
    },

    methods: {

        /**
         * charge le type de configuration à afficher
         * 
         */
        displayVeille() {
            if (this.configVeille.nom) {
                this.veille.nom = this.configVeille.nom}
            if (this.configVeille.dd) {
                this.veille.dd = this.configVeille.dd.slice(0,10)}
            if (this.configVeille.df) {
                this.veille.df = this.configVeille.df.slice(0,10)}
            if (this.configVeille.formulaire_id) {
                this.veille.formulaire_id = this.configVeille.formulaire_id}
            if (this.configVeille.control_step) {
                this.veille.control_step = this.configVeille.control_step}
        }
        
    },

    emits: ['update-veille'],

    watch: {
        veille: {
            handler(newVal) {
                this.$emit('update-veille' , newVal)
            },
            deep: true
        }

    },


    mounted() {
        this.displayVeille()
    },
   
}
</script>