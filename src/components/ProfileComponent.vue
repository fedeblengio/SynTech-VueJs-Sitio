<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Informacion Personal</h2>
      </div>
      <div class="boxText" style="border-bottom: none;">
        <div class="imgProfile">
          <div class="imgContenedorProfile">
            <img
              src="https://pbs.twimg.com/profile_images/1366466342354751491/JyhZpbtu_400x400.jpg"
            />
            <div class="textImg">
              <h3>Federico Blengio</h3>
              <h4>Cambiar foto</h4>
            </div>
          </div>
        </div>

        <div class="contenedorPerfil">
          <h4>Tipo de Usuario:</h4>
          <div class="tipoDeUser">
            <div class="contenidoUser">
              <h4>Profesor</h4>
             <i class="fal fa-chalkboard-teacher"></i>
            </div>
            <div class="contenidoUser">
              <h4>Alumno</h4>
              <i class="fal fa-users-class"></i>
            </div>
          </div>
         
          <div class="infoUserContenedor">
            <div class="infoUser">
              <span>Ci:</span>
              <h4>49895208</h4>
            </div>

            <div class="infoUser">
              <span>Grupo:</span>
              <h4>TB1</h4>
            </div>
          </div>
        </div>
      </div>
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
    };
  },
};
</script>