<template>
    <spinner v-if="pending.load"></spinner>
    <template v-else-if="listHab">
        <div class="list-group" >
            <h5 class="my-3">Liste des personnels habilités:</h5>

            <div class="list-group-item" v-for="hab in listHab" :key="hab.id">
                <div class="row align-items-center">
                    <div class="col-3">
                        {{returnName(hab.personnel_id)}}
                    </div>
                    
                    <div class="col">
                        <progress-bar :dd="new Date(hab.dd)" :df="new Date(hab.df)" label="contrôle"></progress-bar>
        
                    </div>
                    
                </div>
            </div>
        </div>
{{ listHab }}
    </template>
    <alert-message v-else>Il n'y a pas de personnel habilité</alert-message>


</template>
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import ProgressBar from './ProgressBar.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';


export default{
props: {
    idVeille:{
        type: Number,
        required: true
    },
    idForm: {
        type:Number,
        required: true
    },
},

components: {ProgressBar, Spinner, AlertMessage}, //RouterLink

computed: {
    ...mapState(['habilitationType','habilitationsPersonnels', 'personnels'])
},

data() {
    return {
        pending: {
            load: false,
        },
        listHab: null,
        listControl: null
    }

},
watch: {
    idVeille() {
        this.findHabilitationPersonnel(this.idVeille);
    }
},

methods: {
    /**
     * retourne la liste des personnels habilités en fonction de l'id veille fourni
     * @param {*} id 
     */

    async findHabilitationPersonnel(id) {
        this.pending.load = true;
        let listHabilitationPersonnels = this.habilitationsPersonnels.filter(e => e.characteristic_id == id);
        this.listHab = listHabilitationPersonnels;

        let assembler = new AssetsAssembler(listHabilitationPersonnels);
        await assembler.joinAsset(this.$assets.getCollection("personnels"), 'personnel_id', 'personnel');
        let joinedListHab = assembler.getResult();
        console.log(joinedListHab, 'assembler')

           
        this.pending.load = false;
        return listHabilitationPersonnels
    },
    

     /**
     * Modifie le format de la date entrée en paramètre et la retourne 
     * sous le format 01 févr. 2021
     * @param {string} date 
     */

    changeFormatDateLit(el) {
        return dateFormat(el);
    },
    /**
     * retourne le nom du personnel
     * 
     * @param {number}  id du personnel
     * 
     * @return {string}
     */
    returnName(id){
        let personnel = this.personnels.find (e => e.id == id);
        if(personnel) {
            return personnel.cache_nom
        }
        else return id
    },
    

    
    /**
     * return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
     * @param {date} date la date du dernier contôle réalise
     */
    delay(date){
        let dd = new Date(date);

        dd.setDate(dd.getDate()+180);
        
        return dd
        

    }

},

mounted(){
}
}

</script>