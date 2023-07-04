<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.tareaEntregada }}</h2>
      </div>
      <div
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
        v-if="camposVacios"
      >
        {{ language.camposVaciosAlert }}
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
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>

      <div class="post contPostAlu" v-else style="border-bottom: 0px">
        <div class="post_avatar">
          <img :src="returnIMGB64(tarea.profile_picture)" alt="" />
        </div>

        <div class="post_body">
          <div class="post_title">
            <div>
              <span>{{ tarea.nombreUsuario }}</span>
              <p>{{ tarea.fecha }}</p>
            </div>
            <div>
              <div class="alumnoEntregaTarea_puntaje">
                <input
                  type="number"
                  id="nota"
                  name="nota"
                  v-model="calificar.nota"
                  v-on:keyup="validarNota"
                  max="2"
                />
                <label for="nota"> / 12 </label>
              </div>
            </div>
          </div>
          <div class="post_body_text">{{ tarea.mensaje }}</div>

          <div class="post_footer" v-for="img in tarea.imagenes" :key="img.id">
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(img)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ simplificarNombre(img) }}</span>
                </h3>
              </div>
            </div>
          </div>
            <div class="post_footer" v-for="archivo in tarea.archivos" :key="archivo.id">
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
      <!-- <div
        class="clificarTareaCss"
        v-for="archivo in tarea.archivos"
        :key="archivo.id"
      >
        <div class="contenedor_pdf">
          <div class="previw_archivosPost archivoTarea">
            <h3 v-on:click="descargarPDF(archivo)">
              <i class="fal fa-file-alt file"></i>
              <span>{{ simplificarNombre(archivo) }} </span>
            </h3>
          </div>
        </div>
      </div> -->
      <div class="alumnoEntregaTareaContenedor">
        <div class="alumnoEntregaTarea_checkbox" v-if="!re_entrega">
          <input
            type="checkbox"
            id="re_hacer"
            name="re_hacer"
            v-model="calificar.re_hacer"
          />
          <label for="re_hacer"> {{ language.solicitarReEntrega }}</label>
        </div>
        <div class="entregaTareaCont">
          <h2>{{ language.juicio }} :</h2>
          <div class="">
            <textarea
              id="textarea"
              :placeholder="language.escribeAlgo"
              required
              v-model="calificar.mensaje"
            ></textarea>
          </div>
          <button
            class="boxText_btn alumnoEntregaTareaBtn"
            v-on:click="calificarEntrega()"
          >
            <p>{{ language.calificarEntrega }}</p>
          </button>
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
import language from "../assets/lang/calificarAlumno.json";
import SectionRight from "./SectionRight.vue";
window.$ = JQuery;
export default {
  name: "CalificarAlumnoComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "",
      usuario: "",
      loading: true,
      spinner: Global.spinnerUrl,
      tarea: {
        mensaje: "",
        calicacion: "",
        profile_picture: "",
        nombreUsuario: "",
        fecha: "",
        archivos: "",
        imagenes: "",
        idTareas: "",
        idAlumnos: "",
      },
      calificar: {
        nota: "",
        mensaje: "",
        re_hacer: "",
      },
      re_entrega: this.$route.params.re_entrega,
      camposVacios: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    if (this.usuario.ou == "Alumno") {
      this.$router.push("/home");
    }
    this.cargarTareaSeleccionada();
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    let textarea = document.getElementById("textarea");

    textarea.oninput = function () {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    };
    this.selectLanguage();
  },
  methods: {
    validarNota(e) {
      if (!/^[1-9]$|^1[0-2]$/.test(e.target.value)) {
        e.target.value = "";
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
    comprobarCamposVacios(input1, input2) {
      return input1 == "" || input2 == 0;
    },
    calificarEntrega() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let re_hacer = 0;
      if (this.calificar.re_hacer) {
        re_hacer = 1;
      }
      let data = {
        calificacion: this.calificar.nota,
        mensaje: this.calificar.mensaje,
        re_hacer: re_hacer,
        re_entrega: this.re_entrega,
      };

      this.camposVacios = this.comprobarCamposVacios(
        this.calificar.mensaje,
        this.calificar.calificacion
      );

      if (!this.camposVacios) {
        axios
          .put(
            Global.urlSitio +
              "tarea/" +
              this.$route.params.idTareas +
              "/alumno/" +
              this.$route.params.idAlumnos +
              "/correccion",
            data,
            config
          )
          .then((res) => {
            if (res.status == 200) {
              this.$swal.fire(this.language.tareaCalificada, "", "success");
              this.$router.back();
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

    cargarTareaSeleccionada() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let url =
        Global.urlSitio +
        "tarea/" +
        this.$route.params.idTareas +
        "/alumno/" +
        this.$route.params.idAlumnos +
        "/entrega";
      if (this.$route.params.re_entrega) {
        url =
          Global.urlSitio +
          "tarea/" +
          this.$route.params.idTareas +
          "/alumno/" +
          this.$route.params.idAlumnos +
          "/re-entrega";
      }
      axios
        .get(url, config)
        .then((res) => {
          if (res.status == 200) {
            this.prueba = res.data[0].data.mensaje;
            this.tarea.mensaje = res.data[0].data.mensaje;
            this.tarea.calicacion = res.data[0].data.calicacion;
            this.tarea.profile_picture = res.data[0].data.profile_picture;
            this.tarea.nombreUsuario = res.data[0].data.nombreUsuario;
            this.tarea.idTareas = res.data[0].data.idTareas;
            this.tarea.idAlumnos = res.data[0].data.idAlumnos;
            this.tarea.fecha = res.data[0].data.fecha;
            this.tarea.archivos = res.data[0].archivos;
            this.tarea.imagenes = res.data[0].imagenes;
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
  },
};
</script>