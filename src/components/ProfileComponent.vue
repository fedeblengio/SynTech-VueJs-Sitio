<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed" v-if="loading">
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.informacionPersonal }}</h2>
      </div>
      <div class="spinerCont">
        <img :src="spinner" class="spinnerCSS" />
      </div>
    </div>
    <div class="feed" v-else>
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.informacionPersonal }}</h2>
      </div>

      <div class="boxText" style="border-bottom: none">
        <div class="imgProfile">
          <div class="imgContenedorProfile">
            <img :src="returnImgProfile()" />
            <div class="textImg">
              <h3>{{ usuario.nombre }}</h3>

              <div class="image-upload">
                <label for="file-input">
                  <h4>{{ language.cambiarFoto }}</h4>
                </label>

                <input
                  @change="getFile"
                  accept=".jpg, .png, .jpeg,"
                  id="file-input"
                  type="file"
                  style="display: none"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="contenedorPerfil">
          <h5>{{ language.tipoDeUsuario }}:</h5>
          <div class="tipoDeUser">
            <div class="contenidoUser" id="profesor">
              <h4>{{ language.profesor }}</h4>
              <i class="fal fa-chalkboard-teacher"></i>
            </div>
            <div class="contenidoUser" id="alumno">
              <h4>{{ language.alumno }}</h4>
              <i class="fal fa-users-class"></i>
            </div>
          </div>

          <div class="infoUserContenedor">
            <div class="infoUser">
              <span>{{ language.ci }}:</span>
              <input
                type="text"
                class="form-control"
                :value="usuario.username"
                disabled
              />
            </div>

            <div class="infoUser">
              <span>{{ language.grupo }}:</span>
              <input
                type="text"
                class="form-control"
                :value="nombreGrupo"
                disabled
              />
            </div>

            <div class="infoUser">
              <span>{{ language.nombreCompleto }}:</span>
              <div class="input-group mb-3" v-if="!modficarN">
                <input
                  type="text"
                  class="form-control"
                  :value="usuario.nombre"
                  disabled
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarN = true"
                  >
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
              </div>
              <div class="input-group mb-3" v-else>
                <input
                  type="text"
                  class="form-control"
                  :placeholder="language.placeholderNuevoNombre"
                  v-model="newName"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button pr-3"
                    @click="modificarN(usuario)"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarN = false"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="infoUser">
              <span>{{ language.email }}:</span>
              <div class="input-group mb-3" v-if="!modficarE">
                <input
                  type="text"
                  class="form-control"
                  v-if="usuario.email == null"
                  :value="defaultEmail"
                  disabled
                />
                <input
                  type="text"
                  class="form-control"
                  v-else
                  :value="usuario.email"
                  disabled
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarE = true"
                  >
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
              </div>
              <div class="input-group mb-3" v-else>
                <input
                  type="text"
                  class="form-control"
                  :placeholder="language.placeholderNuevoEmail"
                  v-model="newEmail"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button pr-3"
                    @click="modificarE(usuario)"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarE = false"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="infoUser">
              <span>{{ language.genero }}:</span>
              <div class="input-group mb-3" v-if="!modficarG">
                <input
                  type="text"
                  class="form-control"
                  v-if="usuario.genero == null"
                  :value="defaultGenero"
                  disabled
                />
                <input
                  type="text"
                  class="form-control"
                  v-else
                  :value="usuario.genero"
                  disabled
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarG = true"
                  >
                    <i class="fas fa-pencil"></i>
                  </button>
                </div>
              </div>
              <div class="input-group mb-3" v-else>
                <input
                  type="text"
                  class="form-control"
                  :placeholder="language.placeholderNuevoGenero"
                  v-model="newGenero"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button pr-3"
                    @click="modificarG(usuario)"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="modficarG = false"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <router-link to="/cambioPwd">
            {{ language.cambiarContrasenia }}
          </router-link>
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
import language from "../assets/lang/profile.json";
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
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      nombreGrupo: "",
      loading: true,
      spinner: Global.spinnerUrl,
      modficarE: false,
      modficarG: false,
      modficarN: false,
      newName: "",
      newEmail: "",
      newGenero: "",
      defaultGenero: "",
      defaultEmail: "",
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
      this.defaultGenero = this.language.defaultGenero;
      this.defaultEmail = this.language.defaultEmail;
    },
    comprobarInputVacio(input1, datoActuallizar) {
      if (input1.length == 0) {
        this.$swal.fire({
          icon: "error",
          title: "ERROR",
          html:
            this.language.noPuedeIngresar +
            " <b>" +
            datoActuallizar +
            "</b>" 
        });
        return true;
      } else {
        return false;
      }
    },
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;
      if (res <= 50) {
        this.cambiarFoto(event.target.files[0]);
      } else {
        this.$swal.fire(this.language.archivoMayor50, "", "info");
      }
    },
    cargarFoto() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio + "imagen-perfil?username=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            let url_imagen = res.data;
            localStorage.setItem("perfil_img", url_imagen);
          }
        });
    },
    actualizarJSON(newToken) {
      localStorage.setItem("auth_token", newToken);
      this.usuario = JSON.parse(window.atob(newToken));
      Global.token = newToken;
    },
    modificarE(usuario) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let data = {
        username: usuario.username,
        genero: "",
        nuevoNombre: "",
        nuevoEmail: this.newEmail,
      };
      if (!this.comprobarInputVacio(this.newEmail, this.language.email)) {
        axios
          .put(Global.urlSitio + "usuario-db", data, config)
          .then((response) => {
            if (response.status == 200) {
              this.actualizarJSON(response.data.token);
              this.$swal.fire({
                icon: "success",
                title: this.language.perfilActualizado,
                footer:
                  '<a href="">' +
                  this.language.tusDatosSeranActualizados +
                  "</a>",
              });

              this.modficarE = false;
            }
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: this.language.algoSalioMal,
            });
          });
      }
    },
    modificarN(usuario) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let data = {
        username: usuario.username,
        genero: "",
        nuevoEmail: "",
        nuevoNombre: this.newName,
      };
      if (!this.comprobarInputVacio(this.newName, this.language.nombreCompleto)) {
        axios
          .put(Global.urlSitio + "usuario-db", data, config)
          .then((response) => {
            if (response.status == 200) {
              this.actualizarJSON(response.data.token);
              this.$swal.fire({
                icon: "success",
                title: this.language.perfilActualizado,
                footer:
                  '<a href="">' +
                  this.language.tusDatosSeranActualizados +
                  "</a>",
              });

              this.modficarN = false;
            }
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: this.language.algoSalioMal,
            });
          });
      }
    },

    modificarG(usuario) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let data = {
        username: usuario.username,
        genero: this.newGenero,
        nuevoEmail: "",
        nuevoNombre: "",
      };
      if (!this.comprobarInputVacio(this.newGenero,this.language.genero)) {
        axios
          .put(Global.urlSitio + "usuario-db", data, config)
          .then((response) => {
            if (response.status == 200) {
              this.actualizarJSON(response.data.token);
              this.$swal.fire({
                icon: "success",
                title: this.language.perfilActualizado,
                footer:
                  '<a href="">' +
                  this.language.tusDatosSeranActualizados +
                  "</a>",
              });

              this.modficarG = false;
            }
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: this.language.algoSalioMal,
            });
          });
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
            this.cargarFoto();
            this.$swal.fire({
              icon: "success",
              title: this.language.perfilActualizado,
              footer:
                '<a href="">' +
                this.language.tusDatosSeranActualizados +
                "</a>",
            });
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

          setTimeout(() => {
            this.tipoDeUser();
          }, 100);
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

          setTimeout(() => {
            this.tipoDeUser();
          }, 100);
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