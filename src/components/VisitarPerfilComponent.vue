<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed" v-if="loading">
      <div class="feed_header linea_border_bottom">
        <h2>{{language.informacionPersonal}}</h2>
      </div>
      <div class="spinerCont">
        <img :src="spinner" class="spinnerCSS" />
      </div>
    </div>
    <div class="feed" v-else>
      <div class="feed_header linea_border_bottom">
       <h2>{{language.informacionPersonal}}</h2>
      </div>

      <div class="boxText" style="border-bottom: none">
        <div class="imgProfile">
          <div class="imgContenedorProfile">
            <img :src="returnImgProfile(usuarioPerfil.imagen_perfil)" />
            <div class="textImg">
              <h3>{{ usuarioPerfil.nombre }}</h3>
            </div>
          </div>
        </div>

        <div class="contenedorPerfil">
          <h5>{{language.tipoDeUsuario}}:</h5>
          <div class="tipoDeUser">
            <div :class="usuarioProfesor(usuarioPerfil.ou)" id="profesor">
              <h4>{{language.profesor}}</h4>
              <i class="fal fa-chalkboard-teacher"></i>
            </div>
            <div :class="usuarioAlumno(usuarioPerfil.ou)" id="alumno">
              <h4>{{language.alumno}}</h4>
              <i class="fal fa-users-class"></i>
            </div>
          </div>

          <div class="infoUserContenedor">
            <div class="infoUser">
              <span>{{language.ci}}:</span>
              <input
                type="text"
                class="form-control"
                :value="usuarioPerfil.username"
                disabled
              />
            </div>
            <div class="infoUser">
              <span>{{language.grupo}}:</span>
              <input
                type="text"
                class="form-control"
                :value="nombreGrupo"
                disabled
              />
            </div>
            <div class="infoUser">
              <span>{{language.email}}:</span>
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  :value="usuarioPerfil.email"
                  disabled
                />
              </div>
            </div>
            <div class="infoUser">
              <span>{{language.genero}}:</span>
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  :value="usuarioPerfil.genero"
                  disabled
                />
              </div>
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
import language from "../assets/lang/visitarPerfil.json";
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
      title: "",
      usuarioPerfil: "",
      nombreGrupo: "",
      loading: true,
      spinner: Global.spinnerUrl,
      profesor: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
    this.cargarInfoUser();
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },
    comprobarUsuario() {
      if (this.usuarioPerfil.ou == "Profesor") {
        this.profesor = true;
        this.traerGrupoProfesor();
      } else {
        this.traerMateriasUser();
      }
    },
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },

    usuarioProfesor(ou) {
      if (ou == "Profesor") {
        return "contenidoUser background-profile-active";
      } else {
        return "contenidoUser";
      }
    },
    usuarioAlumno(ou) {
      if (ou == "Profesor") {
        return "contenidoUser";
      } else {
        return "contenidoUser background-profile-active";
      }
    },
    traerGrupoProfesor() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "profesor-grupo?idProfesor=" +
            this.$route.params.idUsuario,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.nombreGrupo = res.data[0].nombreCompleto;
            this.loading = false;
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    traerMateriasUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "listarMaterias?idUsuario=" +
            this.$route.params.idUsuario,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.nombreGrupo = res.data[0].nombreCompleto;
            this.loading = false;
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    cargarInfoUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "usuario?idUsuario=" + this.$route.params.idUsuario,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.usuarioPerfil = res.data;
          }
          this.comprobarUsuario();
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
  },
};
</script>

<style scoped>
.background-profile-active {
  background: #d7e3ef;
}
</style>