<template>
    <div class="container px-3">
        <div class="row bg-light rounded-3 px-3 d-flex align-items-center border border-success border-5">
            <h2> {characteristic_label}</h2>
            <ul style="list-style-type:none;">
                <li>du {characteristic_personnel_dd} au {characteristic_personnel_df} </li>
                <li>Habilité par : Arnaud Weber</li>
                <li>Fonction : Directeur d'exploitation</li>
            </ul>
            <div class="mb-1 p-1 secondary">
                <div class="row align-items-center">
                    <div class="col-5 col-sm-4 col-lg-3 col-xl-2">
                    </div>
                </div>
                <div class="col">
                    <div class="progress">
                        <div class="progress-bar bg-success w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>