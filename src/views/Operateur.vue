<template>
    <div class="container py-2 px-2">
        <Spinner v-if="pending.veille"></Spinner>
        <template v-else>
            <div class="bg-white">
                    <h1 class="text-center text-custom">Fiches individuelles de suivi</h1>
            </div>
        </template>
    </div>
</template>

<style scoped>

.container {
    display: flex;
    flex-direction: column; /* Alignement vertical */
    justify-content: center; /* Centre verticalement */
    align-items: center; /* Centre horizontalement */
    height: 100vh; /* Prend toute la hauteur de la vue */
    padding: 20px; /* Ajoute un padding si nécessaire */
}

.logo {
	max-width: 800px;
	display:block;
	margin: 100px auto;
	margin-left: 20px auto;
	margin-right: 20px auto;
}
.card {
    background-color: #f7f7f7;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px;
    
}

.card h1 {
    margin-bottom: 10px;
}

.card h3 {
    margin-top: 10px;
}
.custom-app-color {
    background-color: #F78C6B;
}
.text-custom {
    color: #F78C6B;
}
</style>

<script>
import {mapState} from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
// import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import {dateFormat} from '../js/collecte';


export default {
    components: {Spinner,},//AlertMessage

    data(){
        return {
            pending: {
                veille: false,
                listControlTodo :false
            },
            listControl: true,
            listControlTodo : []
        }
    },
    computed: {
        ...mapState(['habilitationType','listActifs','veilleConfig']),

        
        
    },
    
    methods:{
        /**
         * charge les veilles à réaliser en fonction d'un id de veille
         * 
         * @param {Number} id id de la veille
         * 
         */
        loadVeille(id){
            this.pending.listControlTodo = true
            // let veille = this.veilleConfig;
            this.$app.apiGet('v2/controle/veille/'+id+'/todo', {
                CSP_min : 50,
                CSP_max :100,
            })
            .then((data) =>{
                if(data.length){
                    this.listControlTodo = this.listControlTodo.concat(data)
                }
                else {
                    confirm('veille à jour')
                }
                // this.listControlTodo.push(data);
            })
            .catch(this.$app.catchError).finally(() => this.pending.listControlTodo = false);
        },
        
        /**
         * parcourt la list des types d'habilitation en fonction de l'id entré en paramètre
         * et retourne le nom de l'habilitation
         */
        filterhabilitationType(id) {
           let habilitationType = this.habilitationType.find((type) => type.id  == id);
           return habilitationType.nom
       },
        /**
         * Modifie le format de la date entrée en paramètre et la retourne 
         * sous le format 01 févr. 2021
         * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},
       
    },
    
}
</script>