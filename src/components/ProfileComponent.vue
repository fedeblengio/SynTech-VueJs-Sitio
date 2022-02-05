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
              :src="returnImgProfile()"
            />
            <div class="textImg">
              <h3>{{usuario.nombre}}</h3>
              <h4>Cambiar foto</h4>
            </div>
          </div>
        </div>

        <div class="contenedorPerfil">
          <h4>Tipo de Usuario:</h4>
          <div class="tipoDeUser">
            <div class="contenidoUser" id="profesor">
              <h4>Profesor</h4>
             <i class="fal fa-chalkboard-teacher"></i>
            </div>
            <div class="contenidoUser" id="alumno">
              <h4>Alumno</h4>
              <i class="fal fa-users-class"></i>
            </div>
          </div>
         
          <div class="infoUserContenedor">
            <div class="infoUser">
              <span>CI:</span>
              <h4>{{usuario.username}}</h4>
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
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
    };
  },
  mounted() {
    this.tipoDeUser();
  },
  methods: {
     returnImgProfile() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    tipoDeUser(){
      let profesor = document.getElementById("profesor")
      let alumno = document.getElementById("alumno")

      if(this.usuario.ou == "Profesor"){
        profesor.classList.add("background-profile");
      }else{
        alumno.classList.add("background-profile");
      }
    }
  }
};
</script>

<style scoped>
.background-profile{
  background-image: url("https://pbs.twimg.com/profile_images/1222169378717753345/1hkxb_VE_400x400.jpg")
}
</style>>