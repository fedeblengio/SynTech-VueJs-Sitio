<template>
  <div class="contenedorDiv">
    <vue-headful :title="language.title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.misMaterias }}</h2>
      </div>

      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div class="card" v-for="clase in traerMaterias" :key="clase.id" v-else>
        <div class="card-header">{{ clase.idGrupo }} - {{ clase.Materia }}</div>
        <div class="card-body">
          <h6>
            <i>{{language.profesor}}: {{ clase.Profesor }}</i>
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
            >{{language.materialDelCurso}}</router-link
          >
          <a class="generarPromedio" v-if="usuario.ou == 'Profesor'">
            <router-link
            :to="{
              name: 'materia-generarPromedio',
              params: {
                idGrupo: clase.idGrupo,
                idMateria: clase.idMateria,
                Materia: clase.Materia,   
              },
            }"
            >{{language.generarPromedio}}
            </router-link>
          </a>
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

import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import language from "../assets/lang/materias.json";
export default {
  name: "materias-component",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      title: "",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      alumno: false,
      traerMaterias: "",
         lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.verificarRol();
    this.selectLanguage()
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
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
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
          Global.urlSitio +
            "grupo/"+localStorage.getItem("idGrupo") +"/materia",
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
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