<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header text-center" v-if="loading">Cargando..</div>
      <div class="feed_header" v-else>
        <h2>{{ tarea.materia }}</h2>
      </div>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div class="post" v-else style="border-top: 1px solid var(--background)">
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
                  <span>{{ simplificarNombre(img.archivo) }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div class="post_footer" v-for="archivo in tarea.archivos" :key="archivo.id">
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(archivo.archivo)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ simplificarNombre(archivo.archivo) }}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tareaSeleccionadaCont" style="border-bottom: 1px solid var(--background)">
        <h3>{{ language.publicarTarea }}</h3>
        <div class="form">
          <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="camposVacios">
            {{ language.inputVacio1 }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" v-on:click="camposVacios = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="boxText_input">
            <img :src="returnImgLocalStorage()" />
            <textarea id="textarea" :placeholder="language.placeholderEntregaAlumno" required
              v-model="entregarTarea.mensaje"></textarea>
          </div>

          <div class="preview_contenedor" v-for="file in entregarTarea.file" :key="file.id" :value="file.name"
            style="width: 410px;margin-right: 10px;">
            <i class="fal fa-file-alt file"></i>

            <h3 class="preview" style="text-decoration: none;margin-left: 3px;font-weight: 500;">
              {{ file.name }}
            </h3>
            <i class="fas fa-times equis" v-on:click="delateFile(file.name)"></i>
          </div>
          <div class="footer_post">
            <div class="select_file">
              <div class="image-upload">
                <label for="file-input">
                  <i class="fas fa-upload"></i>
                </label>

                <input @change="getFile" accept=".jpg, .png, .jpeg,  .pdf" id="file-input" type="file"
                  v-on:onchange="previewFile(this)" style="display: none" />
              </div>
            </div>
            <button class="boxText_btn" v-on:click="enviarArchivos()">
              {{ language.enviar }}
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
import language from "../assets/lang/tareaSeleccionada.json";
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
      lang: localStorage.getItem("lang"),
      language: "",
      title: "",
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
      camposVacios: false,
    };
  },
  mounted() {
    this.selectLanguage();
    this.cargarTareaSeleccionada();

    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    let textarea = document.getElementById("textarea");

    textarea.oninput = function () {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    };
  },
  methods: {
    delateFile(nombre) {
      let i;

      for (i = 0; i < this.entregarTarea.file.length; i++) {
        if (this.entregarTarea.file[i].name === nombre) {
          this.entregarTarea.file.splice(i, 1);
        }
      }
    },
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
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;
      if (this.entregarTarea.file.length <= 2) {
        if (res <= 50) {
          this.entregarTarea.file.push(event.target.files[0]);
        } else {
          this.$swal.fire(this.language.archivoMayor50, "", "info");
        }
      } else {
        this.$swal.fire(this.language.maximo3Archivos, "", "info");
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
          Global.urlSitio + "tarea/" + this.$route.params.idTarea,
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
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    returnImgLocalStorage() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
    descargarPDF(label) {
      let url = Global.urlSitio + "archivo/" + label;

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
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    enviarArchivos() {
      this.camposVacios = this.comprobarCamposVacios(
        this.entregarTarea.mensaje
      );
      if (!this.camposVacios) {
        this.$swal.fire({
          title: this.language.cargando,
          html: this.language.estamosEnviando,
          allowOutsideClick: false,
          timerProgressBar: true,
          allowEscapeKey: false,
          didOpen: () => {
            this.$swal.showLoading();
            this.enviarPost();
          },
          willClose: () => {
            clearInterval(5);
          },
        });
      }
    },
    enviarPost() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();


      formData.append("mensaje", this.entregarTarea.mensaje);

      if (this.$route.params.re_hacer) {
        formData.append("re_hacer", 1);
      } else {
        formData.append("re_hacer", 0);
      }
      for (let archivo of this.entregarTarea.file) {
        formData.append("archivos[]", archivo);
      }
      for (let archivo of this.entregarTarea.file) {
        formData.append("nombresArchivo[]", archivo.name);
      }

      axios
        .post(Global.urlSitio + "tarea/" + this.tarea.idTarea + "/alumno/" + this.usuario.username + "/entrega", formData, config)
        .then((response) => {
          if (response.status == 200) {

            this.$router.back();
            this.$swal.fire(this.language.tareaEntregada, "", "success");
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
  },
};
</script>