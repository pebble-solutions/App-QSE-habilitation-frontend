<template>
    <AppModal class="modal-lg" title="détails" close-btn="true">
        <!--ajouter nom habilitation--><h1></h1>
        <p>date de début : _ / _ / _ </p>
        <P>date de fin : _ / _ / _ </P>
        <p>habilité par : </p>
        <p>Date du dernier contrôle : _ / _ / _</p>
        <p>Note obtenue dernier contrôle : </p>
        <p>Pas de veille : </p>
        <p>historique des contrôles : </p>
        <p>information sur la procédure d'habilitation : </p>


    </AppModal>

</template>

<script>

import AppModal from '../components/pebble-ui/AppModal.vue';

export default {

data() {
    return {
    }
},

components:{
    AppModal
}

}

</script>