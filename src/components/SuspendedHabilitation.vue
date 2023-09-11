<template>
    <div class="container px-3">
            <div class="row bg-dark text-white rounded-3 px-3 d-flex align-items-center border border-warning border-5">
                <h2> {Characteristic_label}</h2>
                <ul style="list-style-type:none;">
                    <li> du {characteristic_personnel_dd} au {characteristic_personnel_df}</li>
                    <li>Habilité par : Arnaud Weber</li>
                    <li>Fonction : Directeur d'exploitation</li>
                    <li>suspension : {characteristic_suspension_personnel_true/false}</li>
                    <li>suspension du {characteristic_suspension_personnel_dd} au {characteristic_suspension_personnel_df}</li>
                    <li>motif :{characteristic_suspension_personnel_motif} </li>_ 
                </ul>
                <div class="mb-3 p-1 secondary">
                    <div class="row align-items-center">
                        <div class="col-5 col-sm-4 col-lg-3 col-xl-2">

                        </div>
                    </div>
                    <div class="col">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                role="progressbar" style="width: 55%" aria-valuenow="55" aria-valuemin="0"
                                aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>