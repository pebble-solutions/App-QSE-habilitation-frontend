<template>
  <div class="card bg-light" v-if="!pending.control">
    <div class="card-body">
      <!-- Titre -->
      <div class="text-center mb-1">
        <strong v-if="displayAgent" class="me-2">{{returnName(hab.personnel_id)}}</strong>
        <strong v-if="displayHab">{{getCharacteristicName(hab.habilitation_type_id)}}</strong>
      </div>
      <div class="row">
        <!-- Colonne 1 : Validité de l'habilitation -->
        <div class="col-lg-4 col-12">
          <div class="px-2 mb-3 mb-lg-0">
            <div class="fw-bold col-12">Validité : 3 ans <span class="fw-lighter">#{{ hab.id }}</span></div>
            <div class="col-12" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }}
              au {{ changeFormatDateLit(hab.df) }}
            </div>
            <!-- Composant ProgressBar -->
            <ProgressBar v-for="hab in habilitationPerso" :key="hab.id" :dd="new Date(hab.dd)  " :df="new Date(hab.df)"></ProgressBar>
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
      <div class="col-lg-4 col-12 px-2">
        <template v-if="listControlToDo?.length">
          <div class="">
            <div>Dernier contrôle : {{ changeFormatDateLit(lastControl) }}</div>
            <!-- <div>{{ lastControl }} {{ noLastControl }}</div> -->
            <div class="fw-bold col-12">Veille : 180 jours</div>
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
    displayHab: Boolean
  },
  computed: {
    ...mapState(['habilitationType', 'listActifs', 'veilleConfig','personnels']),
    
    
    
    
    
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
      infosHab: '',
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
      else return id
    },
    
    
    filterhabilitationType(id) {
      let habilitationType = this.habilitationType.find((e) => e.id == id);
      // let nom = habilitationType.nom
      return habilitationType
    },
    
    /**
    * Retourne le nom d'une caractéristique (habilitation) par son ID
    * 
    * @param {number} id L'ID de la characteristic à chercher
    * 
    * @return {string}
    */
    getCharacteristicName(id) {
      const characteristic = this.filterhabilitationType(id);
      return characteristic?.nom;
    },
    
    findVeilleConfig(id) {
      let veilleConfig = this.veilleConfig.find((v) => v.objet_id == id);
      this.veille = veilleConfig
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
        console.log(data, 'listcontrolDone')
        this.listControlDone = data;
      })
      .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },
    
    loadinfosHabMonitor(id) {
      this.pending.control = true
      this.$app.apiGet('v2/collecte', {
        habilitation_id: id,
        // kn2kn_info: 'OUI',
        // retard_info: 'OUI',
        type: 'KN'
      })
      .then((data) => {
        console.log(data, 'infosHab')
        this.infosHab = data
      })
      .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },
    
    loadHabilitation(id) {
      this.pending.control = true;
      this.$app.apiGet('v2/controle/habilitation', {
        id: id,
      })
      .then((data) => {
        this.habilitationPerso = data;
        this.hab = data[0]
        console.log(data, 'hab')
        // this.$app.apiGet('v2/controle/veille/' + veilleId + '/todo', { CSP_min: 0, CSP_max: 600 })
        // .then((data) => {
        //   console.log(this.listControlToDo, 'listcontroltodo')
        //   this.listControlToDo = data;
        //   if(this.listControlToDo){
        //     let veille = this.listControlToDo.find((e) => e.personnel_id == this.hab.personnel_id)
        //     console.log(veille , 'veille')
        //     if (veille) {
        //       this.lastControl = veille.date_last
        //     }
        //     else this.noLastControl = 'La veille est à jour'
        //   }
        // })
        // .catch(this.$app.catchError).finally(() => this.pending.control = false);
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
    this.loadCollecte(this.habId);
    this.loadHabilitation(this.habId)
    this.loadinfosHabMonitor(this.habId)
    
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


