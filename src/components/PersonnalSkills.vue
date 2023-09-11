<template>
    <div class="container px-1">
        <div class="bg-light rounded-3 p-1 border border-dark border-5">
            <h2>APTITUDES</h2>
            <div class="col-12">
                    <div class="col-12 card"><PhysicalSkills></PhysicalSkills></div>
                    <div class="col-12 card"><PsychoSkills></PsychoSkills></div>
            </div>

        </div>
    </div>
</template>
<script>
import PhysicalSkills from '../components/PhysicalSkills';
import PsychoSkills from '../components/PsychoSkills';
export default {
    components: { PhysicalSkills, PsychoSkills },

}
</script>