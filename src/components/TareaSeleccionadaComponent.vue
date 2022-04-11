<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header text-center" v-if="loading">Cargando..</div>
      <div class="feed_header" v-else>
        <h2>{{ tarea.titulo }} {{ tarea.materia }}</h2>
      </div>
      <div class="spinerCont" v-if="loading">
        <img
          style="margin-top: 20px"
          width="200px"
          height="200px"
          :src="spinner"
          alt=""
        />
      </div>
      <div class="post" v-else>
        <div class="post_avatar">
          <img :src="returnIMGB64(tarea.profile_picture)" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span> {{ tarea.titulo }} </span>
            <p>{{ tarea.fechaVencimiento }}</p>
          </div>
          <div class="post_body_text">
            {{ tarea.descripcion }}
          </div>

          <div class="post_footer" v-for="img in tarea.imagenes" :key="img.id">
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(img.archivo)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ img.archivo }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div
            class="post_footer"
            v-for="archivo in tarea.archivos"
            :key="archivo.id"
          >
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(archivo.archivo)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ archivo.archivo }}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="feed_header">
        <h2>Entregar Tarea</h2>

        <div class="form">
          <div class="boxText_input">
            <img :src='returnImgLocalStorage()' />
            <textarea
              id="textarea"
              placeholder="Escribe algo!"
              required
              v-model="entregarTarea.mensaje"
            ></textarea>
          </div>

          <div
            class="preview_contenedor"
            v-for="file in entregarTarea.file"
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
              Enviar Tarea
            </button>
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
  name: "TareaSeleccionadaComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tarea",
      usuario: "",
      loading: true,
      spinner: Global.spinnerUrl,
      tarea: {
        idTarea: "",
        titulo: "",
        idProfesor: "",
        profile_picture: "",
        nombreProfesor: "",
        idMateria: "",
        materia: "",
        descripcion: "",
        fechaVencimiento: "",
        archivos: "",
        imagenes: "",
      },
      entregarTarea: {
        mensaje: "",
        file: [],
      },
    };
  },
  mounted() {
    this.cargarTareaSeleccionada();

    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    let textarea = document.getElementById("textarea");

    textarea.oninput = function () {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    };
  },
  methods: {
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.entregarTarea.file.length <= 4) {
        if (res <= 50) {
          this.entregarTarea.file.push(event.target.files[0]);
        } else {
          alert("El tamaño del archivo excede el límite máximo permitido");
        }
      } else {
        alert("5 archivos por post");
      }
    },
    cargarTareaSeleccionada() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio + "tarea?idTarea=" + this.$route.params.idTarea,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.tarea.idTarea = res.data.datos.idTarea;
            this.tarea.titulo = res.data.datos.titulo;
            this.tarea.idProfesor = res.data.datos.idProfesor;
            this.tarea.profile_picture = res.data.datos.profile_picture;
            this.tarea.nombreProfesor = res.data.datos.nombreProfesor;
            this.tarea.idMateria = res.data.datos.idMateria;
            this.tarea.materia = this.$route.params.materia;
            this.tarea.descripcion = res.data.datos.descripcion;
            this.tarea.fechaVencimiento = res.data.datos.fechaVencimiento;
            this.tarea.archivos = res.data.archivos;
            this.tarea.imagenes = res.data.imagenes;
          }
          this.loading = false;
        });
    },
     returnImgLocalStorage() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
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
      for (let i = 0; i < this.entregarTarea.file.length; i++) {
        nombres.push(fecha + this.entregarTarea.file[i].name);
        let formData = new FormData();

        formData.append("archivo", this.entregarTarea.file[i]);
        formData.append("nombre", fecha + this.entregarTarea.file[i].name);

        axios
          .post(Global.urlSitio + "FTP", formData, config)
          .then((response) => {
            if (response.status == 200) {
            this.enviarPost(nombres);
            }
          })
          .catch(() => {});
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

      formData.append("idTareas", this.tarea.idTarea);
      formData.append("idAlumnos", this.usuario.username);
      formData.append("mensaje", this.entregarTarea.mensaje);
      formData.append("nombre_archivos", nombres);
      if (this.$route.params.re_hacer) {
        formData.append("re_hacer", 1);
      } else {
        formData.append("re_hacer", 0);
      }

      axios
        .post(Global.urlSitio + "entregas-alumno", formData, config)
        .then((response) => {
          if (response.status == 200) {
            /* REDIRECCIONAR AL MENU DE TAREAS , SACARLO DE LA TAREA ACTUAL */
            this.$router.back();
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
  },
};
</script>