<template>
    <div>
        <div>
            <button class="btn btn-outline-primary" @click.prevent="$router.push($route.path + '/new')" >Créer une nouvelle configuration</button>
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