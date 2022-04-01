<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto navbar-materias">
            <li class="nav-item">
              <a class="nav-link" href="#"
                >Inicio <span class="sr-only">(current)</span></a
              >
            </li>
            <li class="nav-item">
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'listado-tareas',
                  params: {
                    materia: this.$route.params.materia,
                    idGrupo: this.$route.params.idGrupo,
                    idMateria: this.$route.params.idMateria,
                    tareas_vencidas: false,
                  },
                }"
                class="nav-link"
              >
                Tareas
              </router-link>
            </li>
            <li class="nav-item active">
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'listado-usuarios',
                  params: {
                    materia: this.$route.params.materia,
                    idGrupo: this.$route.params.idGrupo,
                    idMateria: this.$route.params.idMateria,
                  },
                }"
                class="nav-link"
              >
                Usuarios
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'listado-tareas-vencidas',
                  params: {
                    materia: this.$route.params.materia,
                    idGrupo: this.$route.params.idGrupo,
                    idMateria: this.$route.params.idMateria,
                    tareas_vencidas: true,
                  },
                }"
                class="nav-link"
              >
                Registro
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
      <div class="" v-if="loading">
        <center>
          <img class="spinnerCSS" :src="spinner" />
        </center>
      </div>
      <div class="boxText" v-else>
        {{ listadoUsuarios.Profesor.nombre }}
        {{ listadoUsuarios.Profesor.idGrupo }}
        {{ listadoUsuarios.Profesor.idProfesor }}
        <div class="post_avatar">
          <img
            :src="returnImgProfile(listadoUsuarios.Profesor.imagen_perfil)"
            alt=""
          />
        </div>
        <div
          class=""
          aria-current="true"
          v-for="alumno in listadoUsuarios.Alumnos"
          :key="alumno.id"
        >
          {{ alumno.nombre }}
          {{ alumno.idGrupo }}
          {{ alumno.idAlumnos }}
          <div class="post_avatar">
            <img :src="returnImgProfile(alumno.imagen_perfil)" alt="" />
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

window.$ = JQuery;

export default {
  name: "App",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      title: "Usuarios",
      loading: true,
      spinner: Global.spinnerUrl,
      listadoUsuarios: {
        Profesor: "",
        Alumnos: "",
      },
    };
  },
  mounted() {
    this.traerUsuarios();
  },
  methods: {
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
    traerUsuarios() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "listar-alumnos?idGrupo=" +
            this.$route.params.idGrupo +
            "&idMateria=" +
            this.$route.params.idMateria,
          config
        )
        .then((res) => {
          this.listadoUsuarios.Alumnos = res.data.Alumnos;
          this.listadoUsuarios.Profesor = res.data.Profesor;
          this.loading = false;
        });
    },
  },
};
</script>
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
