<template>
    <div class="container px-3">
            <div class="row bg-light rounded-3 p-1 border border-dark border-5">
                <div class="col-12 md-6 py-6 d-flex align-items-center">
                    <h2>DETAILS DU CONTRAT</h2>
                </div>
                <div>
                    <ul style="list-style-type:none;">
                        <li>Poste :{structure_personnel_nom du poste}</li>
                        <li>CDD/CDI : {structure_personnel_type de contrat}</li>
                        <li>Date de début  {dd} (Date de fin éventuelle {df})</li>
                    </ul>
                </div>
            </div>
        </div>
</template>