<template>

    <input type="text" class="form-control px-2" placeholder="Rechercher..." v-model="displaySearch">
    
    <template v-for="hab in listTypeFiltred()" :key="hab.id">
        <app-menu-item :href="'/habilitationHab/' + hab.id">
            {{ hab.nom }}
        </app-menu-item>
    </template>

    <div class="alert alert-info m-2" v-if="!listTypeFiltred()?.length">
        Il n'y a pas de type d'habilitation enregistré avec cette recherche
    </div>

    <div class="alert alert-info m-2" v-if="!types?.length">
        Il n'y a pas de type d'habilitation enregistré
    </div>

</template>

<script>
import { mapState } from 'vuex'
import AppMenuItem from '../pebble-ui/AppMenuItem.vue'

export default {
    data() {
        return {
            displaySearch: ''
        }
    },
    components: { AppMenuItem },
    computed: {
        ...mapState(['types'])
    },

    methods:{
        listTypeFiltred(){
            const typestoFiltred = this.types;
            if (this.displaySearch == '') {
                return typestoFiltred;
            } else {
                const searchInput = this.displaySearch.trim();
                if (/^\d+$/.test(searchInput)) {
                    return typestoFiltred.filter(item => searchInput.includes(item.id));
                } else {
                    const searchPattern = new RegExp(searchInput, 'i');
                    return typestoFiltred.filter(item => item.nom?.toUpperCase().match(searchPattern));
                }
            }
        }
    }
}

</script>
