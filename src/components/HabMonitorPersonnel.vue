<template>
    <div class="card bg-light" v-if="!pending.control">
      <div class="card-body">
        
        <!-- Titre -->
        <div class="text-center mb-1">
          <strong v-if="displayAgent" class="me-2">{{returnName(persHab.personnel_id)}}</strong>
          <strong v-if="displayHab">{{persHab.habilitation_type_id}}</strong>
        </div>
        <div class="row">
          <!-- Colonne 1 : Validité de l'habilitation -->
          <div class="col-lg-4 col-12">
            <div class="px-2 mb-3 mb-lg-0">
              <div class="fw-bold col-12">Validité : 3 ans <span class="fw-lighter">#{{ persHab.id }}</span></div>
              <div class="col-12">{{ changeFormatDateLit(persHab.dd) }}
                au {{ changeFormatDateLit(persHab.df) }}
              </div>
              <!-- Composant ProgressBar -->
              <ProgressBar :dd="new Date(persHab.dd)  " :df="new Date(persHab.df)"></ProgressBar>
            </div>
          </div>
          <!-- Colonne 2 : Résultat des contrôles -->
          <div class="col">
            <div class="d-flex flex-row-reverse flex-wrap align-items-center justify-content-end px-2">
              <button class="mb-2" v-for="kn in listControlDone" :key="kn.id"
              :class="['btn', 'btn-sm', classNameFromSAMI(kn.result_var), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
              :data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="'#' + kn.id">
              {{ kn.result_var }}
            </button>
          </div>
        </div>
        
        <!-- Colonne 3 : caractéristique veille-->
        <div class="col-lg-4 col-12 px-2" >
          <template v-if="persHab.veille">
            <span>Veille <span class="fw-lighter"> #{{ persHab.veille.id }} </span> </span>
            <div class="">
              <div>Dernier contrôle : {{ changeFormatDateLit(lastControl) }}</div>
              <!-- <div>{{ lastControl }} {{ noLastControl }}</div> -->
              <div class="col-12">tous les {{ persHab.veille.control_step }} jours</div>
            </div>
            <!-- Composant ProgressBar -->
            <ProgressBar v-if="lastControl" :dd="new Date(lastControl)" :df="delay(lastControl)"></ProgressBar>
            <div class="text-success" v-else> {{ noLastControl }}<i class="bi bi-check text-success"></i></div>
          </template>
          <div class="text-secondary d-flex align-items-center" v-else>
            <i class="bi bi-calendar2-x me-2"></i>
            <em>Pas de veille configurée</em>
          </div>
        </div>
        
      </div>
    </div>
    <!-- info KN{{ info }} -->
  </div>
  </template>
  <script>
  import { Tooltip } from 'bootstrap';
  import ProgressBar from '../components/ProgressBar.vue';
  import { dateFormat, classNameFromSAMI } from '../js/collecte';
  import { mapState } from 'vuex';
  export default {
    components: { ProgressBar},
    props: {
      habId: Number,
      veilleConfig: Object,
      collecte: Object,
      info: Object,
      displayAgent: Boolean,
      displayHab: Boolean,
      persHab: Object,
    },
    computed: {
      ...mapState(['type', 'listActifs','personnels']),
      
      
      
      
      
    },
    data() {
      return {
        pending: {
          control: false
        },
        listControlDone: [],
        habilitationPerso: [],
        hab: '',
        resultat: '',
        lastControlDate: '',
        listControlToDo: [],
        infosHab: [],
        lastControl:'',
        noLastControl: '',
      };
    },
    methods: {
      /**
      * retourne le nom du personnel
      * 
      * @param {number}  id du personnel
      * 
      * @return {string}
      */
      returnName(id){
        let personnel = this.personnels.find (e => e.id == id);
        if(personnel) {
          return personnel.cache_nom
        }
        else return 'personnel non trouvé'
      },
      
      
      
      
     
      
      
      
      /**
      * return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
      * @param {date} date la date du dernier contôle réalise
      */
      delay(date){
        let dd = new Date(date);
        
        dd.setDate(dd.getDate()+180);
        
        return dd
        
        
      },
      loadCollecte(id) {
        this.pending.control = true;
        this.$app.apiGet('data/GET/collecte', {
          tli: id,
          locked: 1
        })
        .then((data) => {
          this.listControlDone = data;
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
      },
     
     
      changeFormatDateLit(el) {
        return dateFormat(el);
      },
      classNameFromSAMI(reponse) {
        return classNameFromSAMI(reponse);
      },
    },
    mounted() {
      this.loadCollecte(this.persHab.id);
      // this.loadinfosHabMonitor(this.persHab.id)
      
      // Initialisation des tooltips Bootstrap après le rendu du composant
      this.$nextTick(function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
          return new Tooltip(tooltipTriggerEl)
        })
      })
    }
  }
  </script>
  <style  scoped>
  .btn-square {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  .btn:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  </style>
  
  
  