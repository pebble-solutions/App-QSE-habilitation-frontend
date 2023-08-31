<template>
    <div class="pb-3 bg-white">
			<img src="@/assets/Habilitations.png" alt="Pebble Dev" class="logo w-100">
        <div class="card custom-app-color text-white">
            <h1>Type d'habilitations</h1>
            <h3>Retrouver ici toutes les informations regroupées par type d'habilitations. Vous pouvez classer, filtrer et affiner vos recherches grâce aux outils présents en haut de la liste !</h3>
        </div>
        <div class="bg-white text-center mt-5">
        <button class="btn btn-custom-primary btn-lg" @click.prevent="$router.push($route.path + '/new')">Créer un nouveau type d'habilitation</button>
    </div>
    </div>

    
    
    <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
    components: { RouterView }
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
    background-color: #F78C6B;
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
