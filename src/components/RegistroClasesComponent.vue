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

      <div class="select">
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
        <input
          type="button"
          class="ml-2 boxText_btn"
          value="Limpiar"
          v-on:click="limpiarFiltro()"
        />
      </div>
      <div class="list-group" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div class="list-group" v-else-if="comprobarArrayVacio(registroListas)">
        <p>No se ha encontrado ninguna lista segun los datos ingresados.</p>
      </div>
      <div class="list-group" v-else>
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
import $ from "jquery";
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
      opt: false,
      resultadoVacio: false,
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
      this.loading = true;
      if (this.idMateria > 0) {
        this.filtarPorMateria(this.registroListas, this.idMateria);
        this.opt = true;
      }
      if (this.dia.length !== 0) {
        this.filtrarPorDia(this.registroListas, this.dia);
        this.opt = true;
      }
      if (this.mes.length !== 0) {
        this.filtrarPorMes(this.registroListas, this.mes);
        this.opt = true;
      }
      if (this.anio.length !== 0) {
        this.filtrarPorAnio(this.registroListas, this.anio);
        this.opt = true;
      }
      if (!this.opt) {
        this.$swal.fire(
          "Debes ingresar algun dato antes de filtrar",
          "",
          "info"
        );
        this.loading = false;
      }
    },

    limpiarFiltro() {
      this.traerListas();
      this.idMateria = "";
      this.dia = "";
      this.mes = "";
      this.anio = "";
    },

    comprobarArrayVacio(array) {
      return $.isEmptyObject(array);
    },
    filtarPorMateria(array, idMateria) {
      let arrayRegistroMaterias = [];
      array.forEach(function (registro) {
        if (registro.idMateria === idMateria) {
          arrayRegistroMaterias.push(registro);
        }
      });
      this.registroListas = arrayRegistroMaterias;
      this.loading = false;
    },

    filtrarPorDia(array, dia) {
      let arrayRegistroMaterias = [];
      array.forEach(function (registro) {
        if (moment(registro.created_at).format("DD") === dia) {
          arrayRegistroMaterias.push(registro);
        }
      });
      this.registroListas = arrayRegistroMaterias;
      this.loading = false;
    },

    filtrarPorMes(array, mes) {
      let arrayRegistroMaterias = [];
      array.forEach(function (registro) {
        if (moment(registro.created_at).format("MM") === mes) {
          arrayRegistroMaterias.push(registro);
        }
      });
      this.registroListas = arrayRegistroMaterias;
      this.loading = false;
    },

    filtrarPorAnio(array, anio) {
      let arrayRegistroMaterias = [];
      array.forEach(function (registro) {
        if (moment(registro.created_at).format("YYYY") === anio) {
          arrayRegistroMaterias.push(registro);
        }
      });
      this.registroListas = arrayRegistroMaterias;
      this.loading = false;
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
      this.loading = true;
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
