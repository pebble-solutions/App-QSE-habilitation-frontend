<template>
    <div class="container px-3">
        <div class="row bg-light rounded-3 p-1 d-flex align-items-center border border-dark border-5">
            <div class="row">
                <div class="col-6 sm-3 align-items-center">
                    <img src="https://media.istockphoto.com/id/1126458614/fr/photo/la-technologie-%C3%A9volue-architecture.jpg?s=612x612&w=0&k=20&c=Qt_GnfTQS-LWX8D4jOAQThOumTBvzkgt2OA6nLJjdV8="
                        class=img-fluid alt="photo d'illustration" w="100" vspace="10" hspace="5">
                </div>
                <div class="col-6 sm-6 d-flex align-items-center">
                    <h1 class="text-center">{personne_physique_Nom}{personne_physique_Prénom}</h1>
                </div>
            </div>
            <div class="col-md-6">
                <ul style="list-style-type:none;">
                    <li>{dn} </li>
                    <li>{structure_personnel_Matricule} : </li>
                    <li>{structure_personnel_Téléphone} : </li>
                    <li>{structure_personnel_Verres correcteurs true:false} : </li>
                </ul>
            </div>
        </div>
    </div>
</template>