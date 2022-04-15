<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tarea Corregida</h2>
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
          <h1>ADSAD</h1>
          <div class="post_avatar">
            <img :src="returnIMGB64(imagen_alumno)" alt="" />
          </div>
          <!-- ALUMNO ENTREGA 1er -->
          <div class="entregaAlumno">
            idTarea
            {{ primera_entrega.entrega[0].idTareas }}
            idAlumno
            {{ primera_entrega.entrega[0].idAlumnos }}
            nombreAlumno
            {{ primera_entrega.entrega[0].nombreAlumno }}
              mensaje Alumno
            {{ primera_entrega.entrega[0].mensajeAlumno }}
            fecha de entrega
            {{ primera_entrega.entrega[0].fecha }}
    
          </div>
         
          <div class="archivos_primer_entrega">
            <p v-for="archivo in primera_entrega.archivosAlumno" :key="archivo.id">{{archivo}}</p>
          </div>
 -----------------
             <div class="profesorCorrec">
                  calificacion
            {{ primera_entrega.entrega[0].calificacion }}
         
          
              mensaje Profesor
            {{ primera_entrega.entrega[0].mensajeProfesor }}
          </div>
           -----------------
              <!-- ALUMNO ENTREGA 2da -->
          <div class="entregaAlumno">
            idTarea
            {{ segunda_entrega.entrega[0].idTareas }}
            idAlumno
            {{ segunda_entrega.entrega[0].idAlumnos }}
            nombreAlumno
            {{ segunda_entrega.entrega[0].nombreAlumno }}
               mensaje Alumno
              {{ segunda_entrega.entrega[0].mensajeAlumno }}
            fecha de entrega
             {{ segunda_entrega.entrega[0].fecha }}
          </div>
           <div class="archivos_primer_entrega">
            <p v-for="archivo in segunda_entrega.archivosAlumno" :key="archivo.id">{{archivo}}</p>
          </div>
           -----------------
          <div class="profesorCorrec">
             calificacion
            {{ segunda_entrega.entrega[0].calificacion }}
         
          
            mensaje Profesor
            {{ segunda_entrega.entrega[0].mensajeProfesor }}
          </div>
            -----------------
           
         
        </div>
      </div>

      <div class="alumnoEntregaTareaContenedor text-center">
        <small class="text-muted"
          >Solo apta para visualizar <i class="fas fa-eye"></i
        ></small>
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

      primera_entrega: {
        entrega: "",
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
          Global.urlSitio + "tarea?idTarea=" + this.$route.params.idTareas,
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
            this.cargarHisorialDeEntregas();
          }
          this.loading = false;
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
        .get(
          Global.urlSitio +
            "visualizar-entrega?idAlumnos=" +
            this.$route.params.idAlumnos +
            "&idTareas=" +
            this.$route.params.idTareas,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.primera_entrega.entrega = res.data.primera_entrega.entrega;
            this.segunda_entrega.entrega = res.data.segunda_entrega.entrega;

            this.primera_entrega.archivosAlumno =
              res.data.primera_entrega.archivosAlumno;
            this.segunda_entrega.archivosAlumno =
              res.data.segunda_entrega.archivosAlumno;
            this.imagen_alumno = res.data.imagen_perfil_alumno;
          }
          this.loading = false;
        });
    },
  },
};
</script>