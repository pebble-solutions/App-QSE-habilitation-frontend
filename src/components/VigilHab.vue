<template>
    <spinner v-if="pending.load"></spinner>
    <template v-else-if="listHab">
        <div class="card m-2 p-2 custom-color" >
            <h4 class="my-3 text-white text-center">Liste des personnels habilités :</h4>
            <div class="list-group-item mb-2" v-for="hab in listHabJoin" :key="hab.id">
                <div>
                    <span> {{ returnName(hab.personnel_id) }} </span>
                    <span v-if="hab.personnel.dsortie">
                        <span class="ms-2">Fin de contrat le </span>{{ changeFormatDateLit(hab.personnel.dsortie) }}
                    </span>
                </div>
                <progress-bar :dd="new Date(hab.dd)" :df="new Date(hab.df)"></progress-bar>
                <!-- <hab-monitor :habId="hab.id" :displayAgent="true" :displayHab="false"></hab-monitor> -->
                <!-- <progress-bar v-if="lastControl.date_last" :dd="new Date(lastControl.date_last)" :df="delay(lastControl.date_last)"></progress-bar> -->
                
            </div>
        </div>
    </template>
    <div class="text-warning text-center" v-else>Il n'y a pas de personnel habilité</div>
   
</template>
<script>
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';
import Spinner from '../components/pebble-ui/Spinner.vue';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import ProgressBar from './ProgressBar.vue';


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

components: { Spinner, ProgressBar,  }, //RouterLink, ProgressBar, 

computed: {
    ...mapState(['habilitationType','habilitationsPersonnels', 'personnels'])
},

data() {
    return {
        pending: {
            load: false,
        },
        listHab: null,
        listControl: [],
        listHabJoin: null,
        lastControl: null,
        noLastControl: null,
        listControlToDo: null,
        list: [],

    }

},
watch: {
    idVeille() {
        this.findHabilitationPersonnel(this.idVeille);
    }
},

methods: {
    
    /**
     * retourne la liste des habilitations personnelles en fonction de l'id veille fourni
     * et récupère le nom des personnels par jointure avec la collection personnels
     * @param {*} id 
     * @returns {Array} liste des personnels habilités
     */

    async findHabilitationPersonnel(id) {
        this.pending.load = true;
        let listHabilitationPersonnels = this.habilitationsPersonnels.filter(e => e.characteristic_id == id);
        this.listHab = listHabilitationPersonnels;
        let assemblerPersonnel = new AssetsAssembler(listHabilitationPersonnels);
        await assemblerPersonnel.joinAsset(this.$assets.getCollection("personnels"), 'personnel_id', 'personnel');
        let joinedListHab = assemblerPersonnel.getResult();
        this.listHabJoin = joinedListHab;
        
        this.pending.load = false;
        return joinedListHab
    },
    

     /**
     * Modifie le format de la date entrée en paramètre et la retourne 
     * sous le format 01 févr. 2021
     * @param {date} date 
     * @returns {date} date formatée
     */

    changeFormatDateLit(el) {
        return dateFormat(el);
    },
    /**
     * retourne le nom du personnel en fonction de l'id fourni
     * 
     * @param {number}  id du personnel
     * 
     * @returns {string} nom du personnel si trouvé
     * @returns {number} id du personnel si le nom n'est pas trouvé
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
}

</script>

<style scoped>
/* .custom-color{
    background-color: #F78C6B;
} */
</style>
```