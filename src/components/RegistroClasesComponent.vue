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
        <label>Filtrar :</label>

        <select
          class="form-control"
          v-model="idMateria"
          name="grupos"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option value="" disabled selected hidden>Seleccione un grupo</option>
          <option
            v-for="todo in traerMaterias"
            :key="todo.id"
            v-bind:value="todo.idMateria"
          >
            {{ todo.idGrupo }} -
            {{ todo.Materia }}
          </option>
        </select>

        <label for="Dia">Dia</label>
        <input
          type="text"
          class="form-control"
          id="Dia"
          placeholder="28 /"
          v-model="dia"
        />
        <label for="mes">Mes</label>
        <input
          type="text"
          class="form-control"
          id="mes"
          placeholder="01 /"
          v-model="mes"
        />
        <label for="anio">Año</label>
        <input
          type="text"
          class="form-control"
          id="anio"
          placeholder="2002"
          v-model="anio"
        />

        <input
          type="button"
          class="boxText_btn"
          value="Filtrar"
          v-on:click="filtrar()"
        />
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
                  materia: lista.materia,
                  fecha: lista.created_at,
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
      idMateria: "",
      dia: "",
      mes: "",
      anio: "",
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
    /*     filtrarPorMaterias(idMateria) {
      let arrayRegistroMaterias = [];
      this.traerListas();

      this.registroListas.forEach(function (registro) {
        if (registro.idMateria === idMateria) {
          arrayRegistroMaterias.push(registro);
        }
      });

      this.registroListas = arrayRegistroMaterias;
    }, */

    filtrar() {
      let arrayRegistroMaterias = [];
      let idMateria = this.idMateria;
      let dia = this.dia;
      let mes = this.mes;
      let anio = this.anio;
      console.log(this.momentAnio(this.registroListas[0].created_at));

      this.registroListas.forEach(function (registro) {
        if (registro.idMateria === idMateria) {
          arrayRegistroMaterias.push(registro);
        }
      });
      arrayRegistroMaterias.forEach(function (registro) {
        if (this.momentDia(registro.created_at) === dia) {
          arrayRegistroMaterias.push(registro);
        }
      });
      arrayRegistroMaterias.forEach(function (registro) {
        if (this.momentMes(registro.created_at) === mes) {
          arrayRegistroMaterias.push(registro);
        }
      });
      arrayRegistroMaterias.forEach(function (registro) {
        if (this.momentAnio(registro.created_at) === anio) {
          arrayRegistroMaterias.push(registro);
        }
      });

      this.registroListas = arrayRegistroMaterias;
    },

    momentDia(fecha) {
      return moment(fecha).format("DD");
    },
    momentMes(fecha) {
      return moment(fecha).format("MM");
    },
    momentAnio(fecha) {
      return moment(fecha).format("YYYY");
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
            text: "Parece que algo salio mal ...",
          });
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
            this.usuario.username,
          config
        )
        .then((res) => {
          this.registroListas = res.data;

          this.loading = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
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
