<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tareas Entregadas</h2>
      </div>
      <div class="second_feed" style="border: none">
        <div class="listadousuarioComponentBuscador">
          <h3 class="">Buscar tarea</h3>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar Usuario"
              aria-label="Buscar Usuario"
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
        <div class="list-group-item">
          <router-link
            :to="{
              name: 'visualizar-tareas',
              params: {
                idAlumnos: tareas.idAlumnos,
                idTareas: tareas.idTarea,
              },
            }"
            class="list-group-item-action mt-2"
            v-for="tareas in listadoTareas.entregas_tareas"
            :key="tareas.id"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tareas.titulo }}</h5>
              <small class="text-muted"
                >Vence: {{ moment(tareas.fecha_vencimiento) }}</small
              >
            </div>
            <p class="mb-1">{{ tareas.descripcion }}</p>
            <small class="text-muted">
              <b>Haga click para visualizar tu entrega</b></small
            >
          </router-link>

          <router-link
            :to="{
              name: 'visualizar-tareas',
              params: {
                idAlumnos: tareas.idAlumnos,
                idTareas: tareas.idTarea,
              },
            }"
            class="list-group-item-action mt-2"
            v-for="tareas in listadoTareas.re_hacer"
            :key="tareas.id"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tareas.titulo }} {{ tareas.idTarea }}</h5>
              <small class="text-muted"
                >Vence: {{ moment(tareas.fecha_vencimiento) }}</small
              >
            </div>
            <p class="mb-1">{{ tareas.descripcion }}</p>
            <small class="text-muted">
              <b>Haga click para visualizar tu entrega</b></small
            >
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
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
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
      title: "Historial de Entregas",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listadoTareas: "",
    };
  },
  mounted() {
    this.cargarTareasEntregadas();
  },
  methods: {
    
    filtrarPorNombre() {
      alert("filtro");
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
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
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