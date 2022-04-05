<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>Registro de Listas pasadas</h2>
      </div>
      <ul class="nav nav-tabs justify-content-center text-decoration-none">
        <li class="nav-item">
          <router-link
            to="/agenda-virtual"
            class="nav-link"
            style="text-decoration: none"
          >
            Agendar Clase</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/registro-clases"
            class="nav-link active"
            style="text-decoration: none"
          >
            Registro de Clases
          </router-link>
        </li>
      </ul>
      <div class="spinerCont" v-if="loading">
        <img class="spinnerCSS" :src="spinner" />
      </div>
      <div class="select" v-else>
        <label>Filtrar por grupo :</label>
        <select
          class="form-control"
          v-model="materiaFiltro"
          name="grupos"
          required
          placeholder="Seleccione Grupo y Asignatura"
          v-on:change="traerListas()"
        >
          <option v-bind:value="emptyValue">-- TODOS --</option>
          <option
            v-for="todo in traerMaterias"
            :key="todo.id"
            v-bind:value="todo.idMateria"
          >
            {{ todo.idGrupo }} -
            {{ todo.Materia }}
          </option>
        </select>
      </div>

      <div class="list-group">
        <div
          class="list-group-item list-group-item-action"
          aria-current="true"
          v-for="lista in registroListas"
          :key="lista.id"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ lista.idGrupo }} {{ lista.materia }}</h5>
            <small class="text-muted"
              >Fecha: {{ moment(lista.created_at) }}</small
            >
          </div>
          <p>
            <router-link
              :to="{
                name: 'PDF',
                params: {
                  idClase: lista.idClase,
                },
              }"
              class="router-link"
            >
              <i class="fas fa-eye" v-on:click="descargarLista(lista.idClase)">
              </i>
              Visualizar
            </router-link>
          </p>
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
import moment from "moment";
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
      title: "Registro Listas",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      registroListas: "",
      traerMaterias: "",
      materiaFiltro: "",
      emptyValue: "",
    };
  },
  mounted() {
    this.traerListas();
    this.traerGrupoProfesor();
  },
  methods: {
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
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
    traerListas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "registro-listas?idProfesor=" +
            this.usuario.username +
            "&idMateria=" +
            this.materiaFiltro,
          config
        )
        .then((res) => {
          this.registroListas = res.data;

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
