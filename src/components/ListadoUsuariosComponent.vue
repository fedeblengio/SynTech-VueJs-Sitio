<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
      </div>

      <ul class="nav nav-tabs justify-content-center text-decoration-none">
        <li class="nav-item">
          <router-link
            style="text-decoration: none"
            :to="{
              name: 'materia-seleccionada',
              params: {
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                materia: this.$route.params.materia,
              },
            }"
            class="nav-link"
            >{{ language.navInicio }}</router-link
          >
        </li>

        <li class="nav-item">
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
            class="nav-link active"
          >
            {{ language.navMiembros }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="!this.$route.params.tareas_vencidas"
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
            {{ language.navTareas }}
          </router-link>
          <router-link
            v-else
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
            {{ language.navTareas }}
          </router-link>
        </li>
        <li class="nav-item" v-if="usuario.ou == 'Profesor'">
          <router-link
            v-if="this.$route.params.tareas_vencidas"
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
            {{ language.navRegistro }}
          </router-link>

          <router-link
            v-else
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
            {{ language.navRegistro }}
          </router-link>
        </li>
      </ul>
      <div class="second_feed" style="border: none">
        <div class="listadoUsuarioComponentBuscador">
          <h3 class="">{{ language.title }}</h3>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              :placeholder="language.placeholderBuscar"
              aria-label="Buscar Usuario"
              id="filtro"
              aria-describedby="basic-addon2"
              v-on:keyup="filtrarNombre"
            />
            <div class="input-group-append">
              <span class="input-group-text border-0" id="search-addon">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="spinerCont" v-if="loading">
          <img class="spinnerCSS" :src="spinner" />
        </div>

        <div v-else>
          <div class="usuariosComponentlistado usuarioComponentProfesor">
            <router-link
              :to="{
                name: 'visitar-perfil',
                params: {
                  idUsuario: listadoUsuarios.Profesor.idProfesor,
                },
              }"
              style="text-decoration: none"
              class="router-link usuariosComponentlistado"
            >
              <div class="post_avatar">
                <img
                  :src="
                    returnImgProfile(listadoUsuarios.Profesor.imagen_perfil)
                  "
                  alt=""
                />
              </div>
              <div class="textUser" style="color:black !important">
                {{ language.profesor }} - {{ listadoUsuarios.Profesor.nombre }}
              </div>
            </router-link>
          </div>
          <div class="usuariosComponentSeparacion " style="color:black !important"> 
            <p>{{ language.alumnos }}</p>
          </div>
          <div
            class="usuariosComponentContedor"
            aria-current="true"
            v-for="alumno in listadoUsuarios.Alumnos"
            :key="alumno.id"
          >
            <router-link
              :to="{
                name: 'visitar-perfil',
                params: {
                  idUsuario: alumno.idAlumnos,
                },
              }"
              style="text-decoration: none;"
              class="router-link usuariosComponentlistado"
            >
              <div class="post_avatar">
                <img :src="returnImgProfile(alumno.imagen_perfil)" alt="" />
              </div>
              <div class="textUser" style="color:black !important">
                {{ alumno.nombre }}
              </div>
            </router-link>
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

import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import language from "../assets/lang/listadoDeUsuarios.json";
export default {
  name: "App",
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
      listadoUsuarios: {
        Profesor: "",
        Alumnos: "",
      },
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.traerUsuarios();
    this.selectLanguage();
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
    filtrarNombre() {
      var input = document.getElementById("filtro").value.toLowerCase();
      var listaUsuario = [];

      if (input == "") {
        this.loading = true;
        this.traerUsuarios();
      }

      this.listadoUsuarios.Alumnos.forEach(function (usuario) {
        if (usuario.nombre.toLowerCase().indexOf(input) !== -1)
          listaUsuario.push(usuario);
      });

      this.listadoUsuarios.Alumnos = listaUsuario;
    },
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
        Global.urlSitio+"grupo/"+this.$route.params.idGrupo+"/materia/"+this.$route.params.idMateria+"/usuarios", config
      )
        .then((res) => {
          this.listadoUsuarios.Alumnos = res.data.Alumnos;
          this.listadoUsuarios.Profesor = res.data.Profesor;
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
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
