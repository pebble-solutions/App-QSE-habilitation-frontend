<template>
    <div>
        <div v-if="!pending.type">
            <div class="row mb-2">
                    <label for="intitule" class="form-label">Intitulé</label>
                    <input class="form-control" name="intitule" id="intitule" type="text" v-model="type.nom">
            </div>
            <div class="row  mb-2">
                    <div class="col-6">
                        <label for="dd" class="form-label">Date de début</label>
                        <input type="date" format="YYYY-MM-DD" class="form-control" id="dd" v-model="type.dd">
                    </div>
                    <div class="col-6">
                        <label for="df" class="form-label">date de fin</label>
                        <input type="date" class="form-control" id="df" v-model="type.df">
                    </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <label for="expiration" class="form-label">Durée de validité des habilitations (jours)</label>
                    <input class="form-control" id ="expiration" type="number" v-model="type.duree">
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default{

    props: {
        configType: Object,
    },

    data(){
        return {
            pending: {
                type: false
            },
            type: {
                nom: '',
                dd: '',
                df: '',
                duree: '',
            }
        }
    },

    methods: {

        /**
         * charge le type de configuration à afficher
         * 
         */
        displayType() {
            if (this.configType.nom) {
                this.type.nom = this.configType.nom}
            if (this.configType.dd) {
                this.type.dd = this.configType.dd.slice(0,10)}
            if (this.configType.df) {
                this.type.df = this.configType.df.slice(0,10)}
            if (this.configType.expiration) {
                this.type.duree = this.configType.expiration}
        }
        
    },

    emits: ['update-type'],

    watch: {
        type: {
            handler(newVal) {
                this.$emit('update-type' , newVal)
            },
            deep: true
        }

    },


    mounted() {
        this.displayType()
    },
   
}
</script>