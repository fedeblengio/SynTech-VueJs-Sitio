<template>
  <div class="contenedorDiv">
    <vue-headful :title="language.title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.title }}</h2>
      </div>

      <div
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
        v-if="camposVacios"
      >
        {{ language.inputVacio1 }}
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
              maxlength="250"
            ></textarea>
            <span class="float-right mt-2 text-muted ml-3 mr-2">
              {{ mensaje.length }} / 250</span
            >
          </div>
          <div class="addArchivos">
            <div class="select_materia">
              <select
                v-on:change="traerIdForo()"
                class="form-control"
                v-model="selectedGroup"
                required
              >
                <option value="" disabled selected hidden>
                  {{ language.seleccioneGrupo }}
                </option>

                <option
                  v-for="todo in traerMaterias"
                  :key="todo.ids"
                  v-bind:value="[todo.idGrupo, todo.idMateria, todo.Materia]"
                >
                  {{ todo.idGrupo }} - {{ todo.Materia }}
                </option>
              </select>
            </div>
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
              <div
                class="form-check form-switch"
                v-if="usuario.ou == 'Profesor'"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  v-model="publico"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault">
                  {{ language.publico }}</label
                >
              </div>
              <div class="image-upload">
                <label for="file-input">
                  <i class="fas fa-upload"></i>
                </label>

                <input
                  @change="getFile"
                  id="file-input"
                  type="file"
                  accept=".jpg, .png, .jpeg,.pdf"
                  v-on:onchange="previewFile(this)"
                  style="display: none"
                />
              </div>
            </div>
            <button
              class="boxText_btn"
              style="background-color: grey"
              v-if="loading"
            >
              {{ language.enviar }}
            </button>
            <button v-else class="boxText_btn" v-on:click="enviarArchivos()">
              {{ language.enviar }}
            </button>
          </div>
        </div>
      </div>

      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div v-else-if="traerArchivos.length == 0" class="post">
        <p class="text-muted ml-auto mr-auto mt-4">{{ language.noPosts }}</p>
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
            loading="lazy"
            :src="returnImgB64()"
            v-if="post.data.idUsuario === usuario.username"
          />

          <img
            :src="returnImgProfile(post.data.profile_picture)"
            loading="lazy"
            v-else
          />
        </div>

        <div class="post_body">
          <i
            v-if="post.data.idUsuario == usuario.username"
            class="far fa-ellipsis-h menu-card-home ellipsis-home"
          >
            <div class="notiPostBody" :id="post.data.id">
              <p
                class="btn_postBody red"
                v-on:click="comprobarOpcionEliminar(post.data.id)"
                style="color: red"
              >
                {{ language.eliminar }}
              </p>
            </div>
          </i>
          <i v-else class="far menu-card-home btn"> &nbsp; </i>
          <div class="post_title">
            <span>
              <b>{{ post.data.nombreAutor }}</b> {{ language.publicoPara }}
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
                  loading="lazy"
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
                  <i class="fal fa-file-pdf file"></i>
                  <span>{{ simplificarNombre(archivo) }}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <center v-if="cargandoMasPublicaciones">
        <div class="spinerCont">
          <img :src="spinner" class="spinnerCSS" />
        </div>
      </center>
      <center v-else class="mt-2 mb-2">
        <p
          @click="cargarMasPost()"
          style="color: skyblue; cursor: pointer"
          v-if="!loading && traerArchivos.length !== 0"
        >
          {{ language.cargarMas }}
        </p>
      </center>
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
import language from "../assets/lang/home.json";

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
      selectedGroup: "",
      file: [],
      traerArchivos: "",
      mensaje: "",
      foro: "",
      value: 1,
      traerMaterias: "",
      index: null,
      aux: 1,
      limit: 10,
      camposVacios: false,
      lang: localStorage.getItem("lang"),
      language: "",
      cargandoMasPublicaciones: false,
      publico: false,
      grupoTemporaly:""    
      };
  },
  mounted() {
    this.selectLanguage();
    this.loading = true;
    this.verificarLogueo();
    this.traerMateriasUser();
    this.traerGrupo()

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
    comprobarCamposVacios(input1, input2) {
      if (input1.length == 0 && this.publico) {
        return input2.length == 0;
      }
      return input1.length == 0 || input2.length == 0;
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    returnImgB64() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
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
         
        }
      }
    },

    cargarImagenSweetAlert(img) {
      this.$swal.fire({
        imageUrl: this.returnImgProfile(img),
        showCloseButton: true,
        showConfirmButton: false,
        confirmButtonText: false,
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
            "grupo/"+localStorage.getItem("idGrupo") +"/materia"
            +"?idUsuario="+this.usuario.username+"&ou="+this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
        });

        
    },
    cargarImg(imagen) {
      let arrayImg = [];
      for (let i = 0; i < imagen.length; i++) {
        arrayImg.push("data:image/png;base64," + imagen[i]);
      }
      return arrayImg;
    },
    cargarMasPost() {
      this.cargandoMasPublicaciones = true;
      this.limit += 5;
      
      
    },
      traerGrupo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
    
      axios
        .get(
          Global.urlSitio + "traerGrupos?idUsuario="+this.usuario.username+"&ou="+this.usuario.ou,
          config
        )
        .then((res) => {
           
          if (res.status == 200) {
            if(!localStorage.getItem("idGrupo")){
              localStorage.setItem('idGrupo',res.data[0].idGrupo)
            }
            
            this.traerPostarchivos()
          
          }

        });
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
            "&limit=" +
            this.limit+"&idGrupo="+localStorage.getItem('idGrupo'),
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerArchivos = res.data;
          }
          this.cargandoMasPublicaciones = false;
          this.loading = false;
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
            this.selectedGroup[1] +
            "&idGrupo=" +
            this.selectedGroup[0],
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.foro = res.data;
          }
        });
    },
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.file.length <= 2) {
        if (res <= 50) {
          this.file.push(event.target.files[0]);
        } else {
          this.$swal.fire(this.language.archivoMayor50, "", "info");
        }
      } else {
        this.$swal.fire(this.language.maximo3Archivos, "", "info");
      }
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

    enviarArchivos() {
      this.camposVacios = this.comprobarCamposVacios(
        this.selectedGroup,
        this.mensaje
      );
      if (!this.camposVacios) {
        this.$swal.fire({
          title: this.language.enviando,
          html: this.language.enviandoTuPublicacion,
          allowOutsideClick: false,
          timerProgressBar: true,
          allowEscapeKey: false,
          didOpen: () => {
            this.$swal.showLoading();
            if (this.publico) {
              this.publicarNoticia();
            } else {
              this.enviarPost();
            }
          },
          willClose: () => {
            clearInterval(5);
          },
        });
      }
    },

    publicarNoticia() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      let formData = new FormData();
      formData.append("idUsuario", this.usuario.username);
      formData.append(
        "titulo",
        "Profesor " + this.usuario.nombre + this.language.usernamePublico
      );
      formData.append("mensaje", this.mensaje);

      for (let archivo of this.file) {
        formData.append("archivos[]", archivo);
      }
      for (let archivo of this.file) {
        formData.append("nombresArchivo[]", archivo.name);
      }

      axios
        .post(Global.urlSitio + "noticia", formData, config)
        .then((res) => {
          if (res.status == 200) {
            this.$swal.fire({
              icon: "success",
              title: this.language.NoticiaPublicada,
            });
            setTimeout(() => {
              location.reload();
            }, "3000");
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.error,
          });
        });
    },
    enviarPost() {
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
      for (let archivo of this.file) {
        formData.append("archivos[]", archivo);
      }
      for (let archivo of this.file) {
        formData.append("nombresArchivo[]", archivo.name);
      }
      axios
        .post(Global.urlSitio + "foro", formData, config)
        .then((response) => {
          if (response.status == 200) {
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
          confirmButtonText: "Eliminar",
          denyButtonText: `Cancelar`,
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
            text: this.language.algoSalioMal,
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
        .catch(console.error);
    },
  },
};
</script>
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
