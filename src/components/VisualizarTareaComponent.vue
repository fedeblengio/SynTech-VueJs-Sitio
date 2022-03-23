<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tarea Corregida</h2>
      </div>
       <div class="div" v-if="loading">
        <center>
        <img  style='margin-top:20px' width="200px" height="200px" :src="spinner" alt="">
        </center>
      </div>
      <div class="post" v-else>
        <div class="post_avatar">
          <img :src="returnIMGB64(tarea.profile_picture)" alt="" />

          <p>{{ tarea.nombreUsuario }}</p>
        </div>
        <div class="post_body">
          <div class="post_title">
            <span> {{ tarea.mensaje }} </span>
            <p>{{ tarea.fecha }}</p>
          </div>
          <div class="post_body_text">
            {{ tarea.descripcion }}
          </div>

          <div class="post_footer" v-for="img in tarea.imagenes" :key="img.id">
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(img)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ img }}</span>
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
                <h3 v-on:click="descargarPDF(archivo)">
                  <i class="fal fa-file-alt file"></i>
                  <span>{{ archivo }}</span>
                </h3>
              </div>
            </div>
          </div>

       
          <div class="alumnoEntregaTarea_puntaje">
              Nota :
            <label for="nota"> {{calificacion}} / 12 </label>
          </div>
        </div>
      </div>

      <div class="alumnoEntregaTareaContenedor text-center">
        <small class="text-muted ">Solo apta para visualizar</small>
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
  name: "VizualizarTareaComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Vizualizar Tarea",
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
      calificacion: this.$route.params.calificacion
    };
  },
  mounted() {
    this.cargarTareaSeleccionada();
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
  },
  methods: {


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

    cargarTareaSeleccionada() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "entregas-alumno?idAlumnos=" +
            this.$route.params.idAlumnos +
            "&idTareas=" +
            this.$route.params.idTareas,
          config
        )
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
        });
    },
  },
};
</script>