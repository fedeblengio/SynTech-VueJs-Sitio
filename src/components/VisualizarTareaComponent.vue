<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div
        class="feed_header"
        style="border-bottom: 1px solid var(--background)"
      >
        <h2>{{ language.tareaCorregida }}</h2>
      </div>

      <div class="alumnoEntregaTareaContenedor text-center">
        <small class="text-muted"
          >{{ language.sapv }}<i class="fas fa-eye"></i
        ></small>
      </div>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div v-else>
        <div class="post">
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

            <div
              class="post_footer"
              v-for="img in tarea.imagenes"
              :key="img.id"
            >
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
                    <span>{{ simplificarNombre(archivo.archivo) }}</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 22222222 -->
        <div class="post" v-if="primeraEntrega">
          <div class="post_avatar">
            <img :src="returnIMGB64(imagen_alumno)" alt="" />
          </div>
          <div class="post_body">
            <div class="post_title">
              <span> {{ primera_entrega.entrega[0].nombreAlumno }} </span>
              <p>{{ primera_entrega.entrega[0].fecha }}</p>
            </div>
            <div class="post_body_text">
              {{ primera_entrega.entrega[0].mensajeAlumno }}
            </div>

            <div
              class="post_footer"
              v-for="archivo in primera_entrega.archivosAlumno"
              :key="archivo.id"
            >
              <div class="contenedor_pdf">
                <div class="previw_archivosPost">
                  <h3 v-on:click="descargarPDF(archivo)">
                    <i class="fal fa-file-alt file"></i>
                    <span> {{ simplificarNombre(archivo) }}</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--   profesor nota primera tarea -->
        <div class="post" v-if="primeraEntrega">
          <div class="post_avatar">
            <img :src="returnIMGB64(tarea.profile_picture)" alt="" />
          </div>
          <div class="post_body">
            <div class="post_title">
              <div class="profeCalificacion">
                <span>{{ language.correccionTarea}}</span>
                <input
                  type="text"
                  disabled
                  :value="devolverNota(primera_entrega.entrega[0].calificacion)"
                />
              </div>
            </div>
            <div class="post_body_text">
              <div class="visualizarTareacomponentCorrecionProfe">
                <span>{{language.juicio}}:</span>

                <p>{{ primera_entrega.entrega[0].mensajeProfesor }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="segundaEntrega"
          class="feed_header"
          style="border-bottom: 1px solid var(--background)"
        >
          <h2>{{language.segundoIntento}}</h2>
        </div>
        <!--     segundo intento alumno -->
        <div class="post" v-if="segundaEntrega">
          <div class="post_avatar">
            <img :src="returnIMGB64(imagen_alumno)" alt="" />
          </div>
          <div class="post_body">
            <div class="post_title">
              <span> {{ segunda_entrega.entrega[0].nombreAlumno }} </span>
              <p>{{ segunda_entrega.entrega[0].fecha }}</p>
            </div>
            <div class="post_body_text">
              {{ segunda_entrega.entrega[0].mensajeAlumno }}
            </div>

            <div
              class="post_footer"
              v-for="archivo in segunda_entrega.archivosAlumno"
              :key="archivo.id"
            >
              <div class="contenedor_pdf">
                <div class="previw_archivosPost">
                  <h3 v-on:click="descargarPDF(archivo)">
                    <i class="fal fa-file-alt file"></i>
                    <span> {{ simplificarNombre(archivo) }}</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="post" v-if="segundaEntrega">
          <div class="post_avatar">
            <img :src="returnIMGB64(tarea.profile_picture)" alt="" />
          </div>
          <div class="post_body">
            <div class="post_title">
              <div class="profeCalificacion">
                <span>{{language.correccionTarea}}</span>
                <input
                  type="text"
                  disabled
                  class="nota"
                  :value="devolverNota(segunda_entrega.entrega[0].calificacion)"
                />
              </div>
            </div>
            <div class="post_body_text">
              <div class="visualizarTareacomponentCorrecionProfe">
                <span>{{language.juicio}}:</span>

                <p>{{ segunda_entrega.entrega[0].mensajeProfesor }}</p>
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
import $ from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import language from "../assets/lang/visualizarTarea.json";
export default {
  name: "VizualizarTareaComponent",
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

      primera_entrega: {
        entrega: [
          {
            nombreAlumno: "",
            fecha: "",
            mensajeAlumno: "",
            calificacion: "",
            mensajeProfesor: "",
          },
        ],
        archivosAlumno: "",
      },
      segunda_entrega: {
        entrega: "",
        archivosAlumno: "",
      },

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
      imagen_alumno: "",
      segundaEntrega: false,
      primeraEntrega: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.cargarTareaSeleccionada(this.$route.params.idTareas);
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
    devolverNota(nota) {
      return nota == null ? this.language.sinCalificar : this.language.nota + nota + " / 12";
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
    cargarTareaSeleccionada(idTarea) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(Global.urlSitio + "tarea/" + idTarea, config)
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
            this.cargarHisorialDeEntregas();
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
    cargarHisorialDeEntregas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
      .get(Global.urlSitio+ "tarea/"+this.$route.params.idTareas+"/alumno/"+this.$route.params.idAlumnos+"/registro", config)
        .then((res) => {
          if (res.status == 200) {
            if (!$.isEmptyObject(res.data.primera_entrega.entrega)) {
              this.primeraEntrega = true;
              this.primera_entrega.entrega = res.data.primera_entrega.entrega;
              this.primera_entrega.archivosAlumno =
                res.data.primera_entrega.archivosAlumno;
            }

            if (!$.isEmptyObject(res.data.segunda_entrega.entrega)) {
              this.segundaEntrega = true;
              this.segunda_entrega.entrega = res.data.segunda_entrega.entrega;
              this.segunda_entrega.archivosAlumno =
                res.data.segunda_entrega.archivosAlumno;
            }

            this.imagen_alumno = res.data.imagen_perfil_alumno;
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