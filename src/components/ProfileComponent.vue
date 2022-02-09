<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Informacion Personal</h2>
      </div>
      <div class="boxText" style="border-bottom: none">
        <div class="imgProfile">
          <div class="imgContenedorProfile">
            <img :src="returnImgProfile()" />
            <div class="textImg">
              <h3>{{ usuario.nombre }}</h3>

              <div class="image-upload">
                <label for="file-input">
                  <h4>Cambiar foto</h4>
                </label>

                <input
                  @change="getFile"
                  id="file-input"
                  type="file"
                  style="display: none"
                />
              </div>
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
              <h4>{{ usuario.username }}</h4>
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
import { Global } from "../Global";
import axios from "axios";
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
     /*    cargarFoto() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
      axios
        .get(
          Global.urlSitio +
            "imagen-perfil?imagen_perfil=" +
            usuario.imagen_perfil,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            let url_imagen = res.data;
            localStorage.removeItem("perfil_img");
            localStorage.setItem("perfil_img", url_imagen);
          }
        });
    }, */
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;
      if (res <= 50) {
        this.cambiarFoto(event.target.files[0]);
      } else {
        alert("El tamaño del archivo excede el límite máximo permitido");
      }
    },

    cambiarFoto(foto) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();

      formData.append("idUsuario", this.usuario.username);
      formData.append("archivo", foto);

      axios
        .post(Global.urlSitio + "imagen-perfil", formData, config)
        .then((res) => {
          if (res.status == 200) {
            /* this.cargarFoto() */
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Foto cambiada correctamente",
            });
          }
        });
    },
    returnImgProfile() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    tipoDeUser() {
      let profesor = document.getElementById("profesor");
      let alumno = document.getElementById("alumno");

      if (this.usuario.ou == "Profesor") {
        profesor.classList.add("background-profile-active");
        alumno.classList.add("background-profile-disable");
      } else {
        alumno.classList.add("background-profile-active");
        profesor.classList.add("background-profile-disable");
      }
    },
  },
};
</script>

<style scoped>
.background-profile-active {
  background: #50b6f521;
}
.background-profile-disable {
  opacity: 0.9;
}
</style>>