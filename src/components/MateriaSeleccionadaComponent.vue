<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>Foro {{this.$route.params.nombreMateria}}</h2>
      </div>

      <div class="boxText">
        <div class="form">
          <div class="boxText_input">
            <img id="post_img" />
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
      <div
        class="post"
        v-for="post in traerArchivos"
        :key="post.id"
        :id="post.id"
      >
        <div class="post_avatar">
          <img :src="returnImgProfile(post.data.profile_picture)" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span> {{ post.data.titulo }} </span>
            <p>{{ moment(post.data.fecha) }}</p>
          </div>
          <div class="post_body_text">
            {{ post.data.mensaje }}
          </div>
          <div :id="post.data.id" class="cont">
            <div class="contenedorImg">
              <div
                class="imgPost"
                v-for="img in cargarImg(post.imagenes)"
                :key="img.id"
              >
                <img :src="img" alt="" />
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
                  <span>{{ archivo }}</span>
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
    };
  },
  mounted() {
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
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
    },
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;

        this.usuario = JSON.parse(
          window.atob(localStorage.getItem("auth_token"))
        );
        this.cargarFoto();
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
            this.usuario.ou +
            "&idMateria=" +
            this.$route.params.idMateria,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerArchivos = res.data;
          }
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
          alert("El tamaño del archivo excede el límite máximo permitido");
        }
      } else {
        alert("3 archivos por post");
      }
    },
    cargarFoto() {
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
            localStorage.setItem("perfil_img", url_imagen);

            document.getElementById("profile_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");

            document.getElementById("post_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");
          }
        });
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
      for (let i = 0; i < this.file.length; i++) {
        nombres.push(fecha + this.file[i].name);
        let formData = new FormData();

        formData.append("archivo", this.file[i]);
        formData.append("nombre", fecha + this.file[i].name);

        axios
          .post(Global.urlSitio + "FTP", formData, config)
          .then((response) => {
            if (response.status == 200) {
              location.reload();
            }
          })
          .catch(() => {});
      }
      this.enviarPost(nombres);
    },
    enviarPost(nombres) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();
      let tituloForo =
        this.usuario.nombre +
        " publico para " +
        this.selectedGroup[0] +
        " - " +
        this.selectedGroup[2];

      formData.append("idForo", this.foro.idForo);
      formData.append("idUsuario", this.usuario.username);
      formData.append("mensaje", this.mensaje);
      formData.append("titulo", tituloForo);
      formData.append("nombre_archivos", nombres);

      axios
        .post(Global.urlSitio + "foro", formData, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Post publicado correctamente",
            });
          }
        })
        .catch(() => {
          this.flashMessage.show({
            status: "error",
            title: Global.tituloSitio,
            message: "Error al publicar el post",
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
          link.download = label;
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
