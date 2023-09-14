<template>
    <div class="center-container">
        <img src="../assets/enconstruction.png" alt="En construction" class="center-image" />
    </div>
</template>

<style scoped>
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Cela assure que le container prend toute la hauteur de la vue */
}

.center-image {
    max-width: 100%; /* Assurez-vous que l'image ne dépasse pas la largeur du conteneur */
    max-height: 100%; /* Assurez-vous que l'image ne dépasse pas la hauteur du conteneur */
}
</style>