<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Mis Materias</h2>
      </div>
      <div class="card">
        <div class="card-header">TB1 - Matematica</div>
        <div class="card-body">
           <h6>Profesor/a: Rin Tohsaka</h6>
          <p class="card-text">
           Tecnicatura Nocturna
          </p>
          <a href="#" class="btn btn-primary">Material del curso</a>
        </div>
      </div>
         <div class="card">
        <div class="card-header">TB1 - Matematica</div>
        <div class="card-body">
          <h6>Profesor/a: Rin Tohsaka</h6>
          <p class="card-text">
           Tecnicatura Nocturna
          </p>
          <a href="#" class="btn btn-primary">Material del curso</a>
        </div>
      </div>
         <div class="card">
        <div class="card-header">TB1 - Matematica</div>
        <div class="card-body">
          <h6>Profesor/a: Rin Tohsaka</h6>
          <p class="card-text">
           Tecnicatura Nocturna
          </p>
          <a href="#" class="btn btn-primary">Material del curso</a>
        </div>
      </div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
/* import { Global } from "../Global";
import axios from "axios";
import JQuery from "jquery"; */
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
export default {
  name: "materias-component",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      title: "Mis Materias",
    };
  },
};
</script>