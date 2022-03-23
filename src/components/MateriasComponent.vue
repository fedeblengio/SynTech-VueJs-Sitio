<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Mis Materias</h2>
      </div>
     
      <div class="div" v-if="loading">
        <center>
          <img
            style="margin-top: 20px"
            width="200px"
            height="200px"
            :src="spinner"
            alt=""
          />
        </center>
      </div>
      <div class="card" v-for="clase in traerMaterias" :key="clase.id" v-else>
        <div class="card-header">{{ clase.idGrupo }} - {{ clase.Materia }}</div>
        <div class="card-body">
          <h6>
            <em>Profesor/a: {{ clase.Profesor }}</em>
          </h6>
          <p class="card-text">{{ clase.nombreCompleto }}</p>
          <router-link
            class="btn btn-primary float-right"
            style="margin-top: -60px"
            :to="{
              name: 'materia-seleccionada',
              params: {
                idGrupo: clase.idGrupo,
                idMateria: clase.idMateria,
                materia: clase.Materia,
              },
            }"
            >Material del curso</router-link
          >
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
/* import JQuery from "jquery"; */
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
export default {
  name: "materias-component",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      title: "Mis Materias",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      alumno: false,
      traerMaterias: "",
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
        this.traerMateriasUser();
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
            this.traerMaterias = res.data;
          }
          this.loading = false;
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
          this.loading = false;
        });
    },
  },
};
</script>