<template>
    <div class="container bg-white">
			<img src="@/assets/Habilitations.png" alt="Pebble Dev" class="logo w-100">
        <div class="card custom-app-color text-white">
            <h1>Type d'habilitations</h1>
            <h3>Retrouver ici toutes les informations regroupées par type d'habilitations. Vous pouvez classer, filtrer et affiner vos recherches grâce aux outils présents en haut de la liste !</h3>
        </div>
        <div class="bg-white text-center my-4">
            <button class="btn btn-custom-primary btn-lg" @click.prevent="$router.push($route.path + '/new')">Créer un nouveau type d'habilitation</button>
        </div>
        <div class="card  text-white text-center custom-app-color">
            <h4>Les veilles</h4>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                <div class="col" v-for="veille in  veilles" :key="veille.id">
                    <div class="card" >
                        <div># {{ veille.id }} {{ veille.nom }}</div>
                        <div>sur {{ veille.type }} #{{ veille.objet_id }}</div>
                        <div>formulaire {{ veille.formulaire_id }}</div>
                        <div>pas de veille:{{ veille.control_step }} jours</div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    
    
    <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router';
import { mapState } from 'vuex';

export default {

    data(){
        return{
            veilleConfig : null,
            pending: {
                load:false
            },

        }
    },
    components: { RouterView },

    computed: {
        ...mapState(['habilitationsPersonnels','veilles', 'types'])
    },

    methods: {

        
        
        
    }
}
</script>

<style scoped>
.logo {
	max-width: 800px;
	display: block;
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
    background-color: #f78c6bb0;
}

.btn-custom-primary {
    color: #F78C6B;
    background-color: #fff;
    border: 1px solid #F78C6B;
    width: 300px; /* Ajuster la largeur selon vos besoins */
}

.btn-custom-primary:hover {
    color: #fff;
    background-color: #F78C6B;
    border: 1px solid #F78C6B;
}

.btn-lg {
    padding: 10px 20px; /* Ajuster le rembourrage selon vos besoins */
    font-size: 18px; /* Ajuster la taille de la police selon vos besoins */
}
</style>
