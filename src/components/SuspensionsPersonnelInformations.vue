<template>
    <div class="row row px-3 mt-4" v-if="allHabilitations.length > 0">
        <div class="card col-md-12 mb-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Habilitations en cours</h3>
                <ul class="custom-ul">
                    <li class="d-flex justify-content-between align-items-center bg-primary rounded text-white px-3 py-2 mb-2"
                        v-for="hab in currentHabilitations" :key="hab.id">
                        {{ hab.habilitationType.nom }}
                    </li>
                </ul>
                <p v-if="currentHabilitations.length === 0" class="text-center text-secondary">Aucune habilitation en
                    cours</p>
            </div>
        </div>
        <div class="card col-md-6 mb-4 mr-md-3">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Habilitations suspendues</h3>
                <ul class="custom-ul">
                    <li class="d-flex justify-content-between align-items-center bg-danger rounded text-white px-3 py-2 mb-2"
                        v-for="hab in suspendedHabilitations" :key="hab.id">
                        {{ hab.habilitationType.nom }}
                    </li>
                </ul>
                <p v-if="suspendedHabilitations.length === 0" class="text-center text-secondary">Aucune habilitation
                    suspendue</p>
            </div>
        </div>
        <div class="card col-md-6 mb-4 ml-md-3">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">Habilitations expirées</h3>
                <ul class="custom-ul">
                    <li class="d-flex justify-content-between align-items-center bg-dark rounded text-white px-3 py-2 mb-2"
                        v-for="hab in expiredHabilitations" :key="hab.id">
                        {{ hab.habilitationType.nom }}
                    </li>
                </ul>
                <p v-if="expiredHabilitations.length === 0" class="text-center text-secondary">Aucune habilitation
                    expirée</p>
            </div>
        </div>
    </div>
    <div v-else class="text-center text-secondary">
        <Spinner v-if="loading" />
        <p v-else>Aucune habilitation disponible</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getDisplayFormatedDate } from '../js/date';
import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components: {
        Spinner
    },

    props: {
        habilitationsByAgent: Array
    },

    data() {
        return {
            loading: false,
            pending: {
                agent: false,
            },
            suspensions: null
        };
    },

    watch: {
        $route() {
            this.loadSuspensions();
        }
    },

    computed: {
        ...mapState(['habilitationType', 'personnelsFiltered', 'personnels', 'habilitations', 'types']),

        personnel() {
            return this.personnels.find(el => el.id == this.$route.params.id);
        },

        allHabilitations() {
            return this.habilitationsByAgent;
        },

        suspendedHabilitations() {
            const today = new Date();
            if (!this.suspensions) return [];
            return this.allHabilitations.filter(hab =>
                this.suspensions.some(sus =>
                    sus.habilitation_id === hab.id && (sus.df === null || new Date(sus.df) > today)
                )
            );
        },

        expiredHabilitations() {
            const today = new Date();
            return this.allHabilitations.filter(hab => {
                const endDate = new Date(hab.df);
                return endDate < today;
            });
        },

        currentHabilitations() {
            const today = new Date();
            return this.allHabilitations.filter(hab => {
                const endDate = new Date(hab.df);
                const isCurrentlySuspended = this.suspensions.some(sus =>
                    sus.habilitation_id === hab.id && (sus.df === null || new Date(sus.df) > today)
                );
                return endDate >= today && !isCurrentlySuspended;
            });
        }
    },

    methods: {
        changeFormatDateLit(date) {
            return getDisplayFormatedDate(date);
        },

        getHabilitationTypeName(habilitationTypeId) {
            const habilitationType = this.habilitationType.find(type => type.id === habilitationTypeId);
            return habilitationType ? habilitationType.nom : '';
        },

        getSuspensionDate(habilitationId) {
            const suspension = this.suspensions.find(sus => sus.habilitation_id === habilitationId);
            return suspension ? suspension.dd : '';
        },

        loadSuspensions() {
            this.loading = true;
            const suspensionCollection = this.$assets.getCollection('suspensions');
            suspensionCollection.load();
            this.suspensions = suspensionCollection.getCollection();
            this.loading = false;
        }
    },

    mounted() {
        this.loadSuspensions();
    }
};
</script>

<style scoped>
.custom-ul {
    padding-left: 0;
    list-style: none;
}

.bg-custom {
    background-color: #f78c6b9a;
}
</style>
