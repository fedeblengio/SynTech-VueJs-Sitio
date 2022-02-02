<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Calendario de Clases</h2>
      </div>
      <div></div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
/* import { Global } from "../Global";
import axios from "axios"; */
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
window.$ = JQuery;
export default {
  name: "ProfileComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Profile",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.calendarioProfesor();
    } else {
      this.calendarioAlumno();
    }
  },
  methods: {
    calendarioAlumno() {
      alert("ES ALUMNO");
    },
    calendarioProfesor() {
      alert("ES PROFESOR");
    },

  },
};
</script>