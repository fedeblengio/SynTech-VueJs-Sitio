<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
      </div>
      <ul class="nav nav-tabs justify-content-center">
        <li class="nav-item">
          <router-link
            style="text-decoration: none"
            :to="{
              name: 'materia-seleccionada',
              params: {
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                materia: this.$route.params.materia,
              },
            }"
            class="nav-link active"
            >{{language.navInicio}}
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            style="text-decoration: none"
            :to="{
              name: 'listado-usuarios',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
              },
            }"
            class="nav-link"
          >
            {{language.navMiembros}}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="!this.$route.params.tareas_vencidas"
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: false,
              },
            }"
            class="nav-link"
          >
            {{language.navTareas}}
          </router-link>
          <router-link
            v-else
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: false,
              },
            }"
            class="nav-link"
          >
              {{language.navTareas}}
          </router-link>
        </li>
        <li class="nav-item" v-if="usuario.ou == 'Profesor'">
          <router-link
            v-if="this.$route.params.tareas_vencidas"
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas-vencidas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: true,
              },
            }"
            class="nav-link"
          >
            {{language.navRegistro}}
          </router-link>

          <router-link
            v-else
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas-vencidas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: true,
              },
            }"
            class="nav-link"
          >
             {{language.navRegistro}}
          </router-link>
        </li>
      </ul>
      <div
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
        v-if="camposVacios"
      >
       {{language.inputVacio1}}
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
          v-on:click="camposVacios = false"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="boxText">
        <div class="form">
          <div class="boxText_input">
            <img :src="returnImgB64()" />
            <textarea
              id="textarea"
              :placeholder="language.escribeAlgo"
              required
              v-model="mensaje"
            ></textarea>
          </div>
          <div
            class="preview_contenedor"
            v-for="file in file"
            :key="file.id"
            :value="file.name"
          >
            <i class="fal fa-file-alt file"></i>

            <h3 class="preview">
              {{ file.name }}
            </h3>
            <i
              class="fas fa-times equis"
              v-on:click="delateFile(file.name)"
            ></i>
          </div>
          <div class="footer_post">
            <div class="select_file">
              <div class="image-upload">
                <label for="file-input">
                  <i class="fas fa-upload"></i>
                </label>

                <input
                  @change="getFile"
                  accept=".jpg, .png, .jpeg,  .pdf"
                  id="file-input"
                  type="file"
                  v-on:onchange="previewFile(this)"
                  style="display: none"
                />
              </div>
            </div>
            <button class="boxText_btn" v-on:click="enviarArchivos()">
              {{language.enviar}}
            </button>
          </div>
        </div>
      </div>

      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>

      <div
        v-else
        class="post"
        v-for="post in traerArchivos"
        :key="post.id"
        :id="post.id"
      >
        <div class="post_avatar">
          <img
            :src="returnImgB64()"
            v-if="post.data.idUsuario === usuario.username"
          />

          <img :src="returnImgProfile(post.data.profile_picture)" v-else />
        </div>

        <div class="post_body">
          <i
            v-if="post.data.idUsuario === usuario.username"
            class="far fa-ellipsis-h menu-card-home"
            v-on:click="showOptionBody(post.data.id)"
          >
            <div class="notiPostBody" :id="post.data.id">
              <p
                class="btn_postBody red"
                v-on:click="comprobarOpcionEliminar(post.data.id)"
                style="color: red"
              >
                 {{language.eliminar}}
              </p>
            </div>
          </i>
          <i v-else class="far menu-card-home btn"> &nbsp; </i>
          <div class="post_title">
            <span>
              <b>{{ post.data.nombreAutor }}</b> {{language.publicoPara}}
              <b>{{ post.data.idGrupo }} - {{ post.data.materia }}</b>
            </span>
            <p>{{ moment(post.data.fecha) }}</p>
          </div>
          <div class="post_body_text">
            {{ post.data.mensaje }}
          </div>
          <div :id="post.data.id" class="cont">
            <div class="contenedorImg">
              <div class="imgPost" v-for="img in post.imagenes" :key="img.id">
                 <img
                  :src="returnImgProfile(img)"
                  v-on:click="cargarImagenSweetAlert(img)"
                />
              </div>
            </div>
          </div>

          <div
            class="post_footer"
            v-for="archivo in post.archivos"
            :key="archivo.id"
          >
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(archivo)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ simplificarNombre(archivo) }}</span>
                </h3>
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
import moment from "moment";
import language from "../assets/lang/materiaSeleccionada.json";
window.$ = JQuery;

export default {
  name: "App",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: "",
      profesor: false,
      title: "Materias",
      selectedGroup: "",
      file: [],
      traerArchivos: "",
      mensaje: "",
      foro: "",
      value: 1,
      traerMaterias: "",
      index: null,
      camposVacios: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
      this.selectLanguage();
    this.verificarLogueo();
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }

    this.traerPostarchivos();

    let textarea = document.getElementById("textarea");

    textarea.oninput = function () {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    };
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
    comprobarCamposVacios(input1) {
      return input1.length == 0;
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
    },
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;

        this.usuario = JSON.parse(
          window.atob(localStorage.getItem("auth_token"))
        );

        if (this.usuario.ou == "Profesor") {
          this.profesor = true;
          this.traerGrupoProfesor();
        }
      }
    },

    traerPost() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(Global.urlSitio + "foro?id=" + this.usuario.username, config)
        .then((res) => {
          if (res.status == 200) {
            this.grupoProfesor = res.data;
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text:this.language.algoSalioMal,
          });
        });
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
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.languages.algoSalioMal,
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
          Global.urlSitio + "listarMaterias?idUsuario=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
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
    cargarImg(imagen) {
      let arrayImg = [];
      for (let i = 0; i < imagen.length; i++) {
        arrayImg.push("data:image/png;base64," + imagen[i]);
      }
      return arrayImg;
    },
    traerPostarchivos() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "foro?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou +
            "&idMateria=" +
            this.$route.params.idMateria,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerArchivos = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },

    traerIdForo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "foros?idMateria=" +
            this.$route.params.idMateria +
            "&idGrupo=" +
            this.$route.params.idGrupo,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.foro = res.data;
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
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.file.length <= 2) {
        if (res <= 50) {
          this.file.push(event.target.files[0]);
        } else {
          this.$swal.fire(
           this.language.archivoMayor50,
            "",
            "info"
          );
        }
      } else {
        this.$swal.fire(
          this.language.maximo3Archivos,
          "",
          "info"
        );
      }
    },

    returnImgB64() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    delateFile(nombre) {
      let i;

      for (i = 0; i < this.file.length; i++) {
        if (this.file[i].name === nombre) {
          this.file.splice(i, 1);
        }
      }
    },

    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
      
                
    cargarImagenSweetAlert(img) {
      this.$swal.fire({
        imageUrl: this.returnImgProfile(img),
        showCloseButton: true,
        showConfirmButton:false,
        confirmButtonText: false,
      });
    },
    enviarArchivos() {
      this.traerIdForo();
      var hoy = new Date();
      var fecha =
        hoy.getDate() +
        hoy.getMonth() +
        hoy.getFullYear() +
        hoy.getHours() +
        hoy.getMinutes() +
        hoy.getSeconds() +
        "_";

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      this.camposVacios = this.comprobarCamposVacios(this.mensaje);
      if (!this.camposVacios) {
        let nombres = [];
        let timerInterval;
        this.$swal.fire({
          title:this.language.enviando,
          html: this.language.enviandoTuPublicacion,
          allowOutsideClick: false,
          timerProgressBar: true,
          didOpen: () => {
            this.$swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
        if (this.file.length > 0) {
          setTimeout(() => {
            for (let i = 0; i < this.file.length; i++) {
              nombres.push(fecha + this.file[i].name);
              let formData = new FormData();

              formData.append("archivo", this.file[i]);
              formData.append("nombre", fecha + this.file[i].name);

              axios
                .post(Global.urlSitio + "FTP", formData, config)
                .then((response) => {
                  if (response.status == 200) {
                    this.enviarPost(nombres);
                  }
                })
                .catch(() => {});
            }
          }, 2000);
        } else {
          setTimeout(() => {
            this.enviarPost(nombres);
          }, 2000);
        }
      }
    },

    enviarPost(nombres) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();

      formData.append("idForo", this.foro.idForo);
      formData.append("idUsuario", this.usuario.username);
      formData.append("mensaje", this.mensaje);

      formData.append("nombre_archivos", nombres);

      axios
        .post(Global.urlSitio + "foro", formData, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.publicadoCorrectamente, "", "success");
            location.reload();
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
    comprobarOpcionEliminar(idPublicacion) {
      this.$swal
        .fire({
          title: this.language.confirmarEliminacion,
          showDenyButton: true,
          confirmButtonText: this.language.btnEliminar,
          denyButtonText: this.language.btnCancelar,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.borrarPublicacion(idPublicacion);
          }
        });
    },
    borrarPublicacion(idPublicacion) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .delete(Global.urlSitio + "foro?id=" + idPublicacion, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.publicacionEliminada, "", "success");
            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text:this.language.algoSalioMal,
          });
        });
    },
    descargarPDF(label) {
      let url = Global.urlSitio + "traerArchivo?archivo=" + label;

      axios
        .get(url, {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
            token: Global.token,
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = this.simplificarNombre(label);
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    showOptionBody(id) {
      let elipsis = document.getElementById(id);
      if (this.aux == 0) {
        elipsis.style.display = "none";
        this.aux = 1;
      } else {
        elipsis.style.display = "block";
        this.aux = 0;
      }
    },
  },
};
</script>
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
