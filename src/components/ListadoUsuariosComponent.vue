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
            >Inicio</router-link
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
            Miembros
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
            Tareas
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
            Tareas
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
            Registro
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
            Registro
          </router-link>
        </li>
      </ul>
      <div class="second_feed" style="border: none">
        <div class="listadousuarioComponentBuscador">
          <h3 class="">Miembros</h3>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar Usuario"
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
            <div class="post_avatar">
              <img
                :src="returnImgProfile(listadoUsuarios.Profesor.imagen_perfil)"
                alt=""
              />
            </div>
            <div class="textUser">
              Profesor/a - {{ listadoUsuarios.Profesor.nombre }}
            </div>
          </div>
          <div class="usuariosComponentSeparacion">
            <p>Alumnos</p>
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
              style="text-decoration: none"
              class="router-link usuariosComponentlistado"
            >
              <div class="post_avatar">
                <img :src="returnImgProfile(alumno.imagen_perfil)" alt="" />
              </div>
              <div class="textUser">
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
/* import $ from "jquery"; */
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";

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
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
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
