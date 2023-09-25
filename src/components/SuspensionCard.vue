<template>
    <div class="card border-0 d-flex rounded px-3 py-2 mb-3" :class="{ 'card-hover': !noHover }">
      <div class="row text-center">
        <!-- Colonne pour le nom de l'habilitation -->
        <div class="col-md-6 text-md-end px-2">
          <span class="fw-bold">{{ habilitationTypeName }}</span>
        </div>
        <!-- Colonne pour le nom du personnel -->
        <div class="col-md-4 text-md-start px-2">
          <p>{{ personnelName }}</p>
        </div>
        <!-- Colonne pour les dates, la durée et les commentaires -->
        <div class="col-md-12 p-2">
          <div class="card border-0 bg-light">
            <div class="card-body p-1">
              <div class="row">
                <div class="col-md-4">
                  <span class="fw-bold">Dates:</span>
                  <p>{{ formattedDates }}</p>
                </div>
                <div class="col-md-4">
                  <span class="fw-bold">Durée:</span>
                  <p>{{ suspensionDuration }} jours</p>
                </div>
                <div class="col-md-4">
                  <span class="fw-bold">Commentaire:</span>
                  <p>{{ commentaire }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
export default {
props: {
    habilitationTypeName: String,
    personnelName: String,
    formattedDates: String,
    suspensionDuration: Number,
    commentaire: String,
    'no-hover': { 
      type: Boolean,
      default: false,
    },
},
};
</script>
  
<style scoped>
/* Effet d'agrandissement et d'ombre au survol */
.card-hover:hover {
    transform: translate3D(0, -1px, 0) scale(1.02);
    /* Zoom in */
    box-shadow: 8px 10px 70px rgba(45, 39, 37, 0.173), 1px 6px 12px rgba(46, 37, 36, 0.184);
    transition: all .15s ease;
    cursor: pointer;
    background-color: #fceae4;
    border: #f78c6b51 solid 4px;
}

.no-underline {
    text-decoration: none;
}
</style>