<template>

    <div class="row">
        <div class="col-3">
            <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'veille'}" @click.prevent="tab = 'veille'"><i class="bi bi-stopwatch"></i> Veille</a>
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'proc'}" @click.prevent="tab = 'proc'"><i class="bi bi-clock"></i> Procedure</a>
                <!--<a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'solidarite'}" @click.prevent="tab = 'solidarite'"><i class="bi bi-calendar-heart"></i> Journée solidarité</a> -->
            </div>
        </div>
        <div class="col border-left ms-2">
            <config-veille v-if="tab == 'veille'"></config-veille>
            <config-procedure v-else-if="tab == 'proc'"></config-procedure>
        </div>
    </div>
    
    
</template>

<script>
import ConfigProcedure from './ConfigProcedure.vue'
import ConfigVeille from './ConfigVeille.vue'

export default {
    data() {
        return {
            tab: 'veille'
        }
    },

    components: { ConfigProcedure, ConfigVeille },
}
</script>
