<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Mis Cursos</h2>
      </div>

      <div class="list-group">
        <router-link
          :to="{
            name: 'listado-tareas',
            params: {
              materia: grupo.Materia,
              idGrupo: grupo.idGrupo,
              idMateria: grupo.idMateria,
            },
          }"
          class="list-group-item list-group-item-action"
          v-for="grupo in traerGruposMateria"
          :key="grupo.id"
        >
          <div class="d-flex w-100 justify-content-between">
            <small class="text-muted">Profesor : {{ grupo.Profesor }} </small>
            <small class="text-muted">
              Turno : <b> {{ grupo.nombreCompleto }} </b></small
            >
          </div>

          <p class="mb-1">{{ grupo.idGrupo }} - {{ grupo.Materia }}</p>
        </router-link>
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
  name: "TareasComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tareas",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      alumno: true,
      traerGruposMateria: "",
    };
  },
  mounted() {
    this.verificarRol();
  },
  methods: {
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.alumno = false;
        this.traerGrupoProfesor();
      } else {
        this.alumno = true;
      }
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
            this.traerGruposMateria = res.data;
          }
        });
    },
  },
};
</script>