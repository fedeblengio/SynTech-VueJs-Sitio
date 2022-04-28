<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>Home</h2>
      </div>

      <div class="boxText">
        <div class="form">
          <div class="boxText_input">
            <img :src="returnImgB64()" />
            <textarea
              id="textarea"
              placeholder="Escribe algo!"
              required
              v-model="mensaje"
            ></textarea>
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
                  Seleccione un grupo
                </option>
                <option
                  v-for="todo in traerMaterias"
                  :key="todo.id"
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
            <button class="boxText_btn" v-on:click="enviarArchivos()">
              Enviar
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
                Eliminar
              </p>
            </div>
          </i>
          <i v-else class="far menu-card-home btn"> &nbsp; </i>
          <div class="post_title">
            <span>
              <b>{{ post.data.nombreAutor }}</b> publicó para
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
                  <i class="fal fa-file-pdf file"></i>
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
      title: "Home",
      selectedGroup: "",
      file: [],
      traerArchivos: "",
      mensaje: "",
      foro: "",
      value: 1,
      traerMaterias: "",
      index: null,
      aux: 1,
    };
  },
  mounted() {
    this.loading = true;
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
          this.traerGrupoProfesor();
        }
      }
    },
    cargarImagenSweetAlert(img) {
      this.$swal.fire({
        imageUrl: this.returnImgProfile(img),
        imageHeight: 500,
      });
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
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerArchivos = res.data;
          }
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
          this.$swal.fire(
            "El tamamaño del archivo es mayor a 50 mb",
            "",
            "info"
          );
        }
      } else {
        this.$swal.fire(
          "Solo se permite 3 archivos por publicacion",
          "",
          "info"
        );
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
      let nombres = [];
      let timerInterval;
      this.$swal.fire({
        title: "Enviando...",
        html: "Estamos publicando tus archivos !",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          this.$swal.showLoading();
          const b = this.$swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = this.$swal.getTimerLeft();
          }, 100);
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
              });
          }
        }, 2000);
      } else {
        setTimeout(() => {
          this.enviarPost(nombres);
        }, 2000);
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
            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
    },

    comprobarOpcionEliminar(idPublicacion) {
      this.$swal
        .fire({
          title: "¿ Estas seguro que quieres eliminar ?",
          showDenyButton: true,
          confirmButtonText: "Eliminar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
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
            this.$swal.fire("Publicacion eliminada", "", "success");
            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
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
