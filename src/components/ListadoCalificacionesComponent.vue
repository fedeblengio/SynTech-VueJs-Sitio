<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>{{ language.tareasEntregadas }}</h2>
      </div>
      <div class="second_feed" style="border: none">
        <div class="listadoUsuarioComponentBuscador">
          <h3 class="">{{ language.buscarTarea }}</h3>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              :placeholder="language.buscarTareaInput"
              :aria-label="language.buscarTareaInput"
              id="filtro"
              aria-describedby="basic-addon2"
              v-on:keyup="filtrarPorNombre"
            />
            <div class="input-group-append">
              <span class="input-group-text border-0" id="search-addon">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="spinerCont" v-if="loading">
          <img :src="spinner" class="spinnerCSS" />
        </div>
        <div
          class="noResultadoRegistroComp"
          v-else-if="comprobarArrayVacio(listadoTareas)"
        >
          <p>{{ language.noSeEncontroTarea }}</p>
        </div>
        <div class="contLisCalif" v-else>
          <router-link
            :to="{
              name: 'visualizar-tarea',
              params: {
                idTareas: tareas.idTareas,
                idAlumnos: tareas.idAlumnos,
              },
            }"
            class="list-group-item-action listadoStyle"
            v-for="tareas in listadoTareas"
            :key="tareas.id"
          >
            <div class="contLisCalif">
              <div class="calificacionesCont">
                <h5 class="calititulo">{{ tareas.titulo }}</h5>
                <p class="calfecha">
                  {{ language.vence }}: {{ moment(tareas.fecha_vencimiento) }}
                </p>
              </div>
              <div class="calificacionesCont" style="margin-top: 10px">
                <h5 style="font-size: 14px" class="calititulo">
                  {{ tareas.descripcion }}
                </h5>
                <i class="far fa-eye eyeListado"></i>
              </div>
            </div>
          </router-link>
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
import $ from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
import language from "../assets/lang/listadoCalificaciones.json";

window.$ = JQuery;
export default {
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listadoTareas: "",
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
    this.cargarTareasEntregadas();
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
    filtrarPorNombre() {
      var input = document.getElementById("filtro").value.toLowerCase();
      var listaTarea = [];

      if (input == "") {
        this.loading = true;
        this.cargarTareasEntregadas();
      }

      this.listadoTareas.forEach(function (tarea) {
        if (tarea.titulo.toLowerCase().indexOf(input) !== -1)
          listaTarea.push(tarea);
      });

      this.listadoTareas = listaTarea;
    },
    comprobarArrayVacio(array) {
      return $.isEmptyObject(array);
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
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

    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
    },
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.alumno = false;
      } else {
        this.alumno = true;
      }
    },

    cargarTareasEntregadas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "entregas-alumnos?idAlumnos=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listadoTareas = res.data;
            this.loading = false;
          }
        });
    },
  },
};
</script>