<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{ language.registroClasesPasadas }}</h2>
      </div>
      <ul class="nav nav-tabs justify-content-center text-decoration-none">
        <li class="nav-item">
          <router-link
            to="/agenda-virtual"
            class="nav-link"
            style="text-decoration: none"
          >
            {{ language.agendarClase }}</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/registro-clases"
            class="nav-link active"
            style="text-decoration: none"
          >
            {{ language.registroClases }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/historial-faltas"
            class="nav-link"
            style="text-decoration: none"
          >
            {{ language.historialFaltas }}
          </router-link>
        </li>
      </ul>

      <div class="registroContFiltro">
        <select
          class="form-control inputFiltrogrande"
          v-model="idMateria"
          name="grupos"
          required
          :placeholder="language.placeholderSeleccioneGrupoYMateria"
        >
          <option value="" disabled selected hidden>
            {{ language.seleccioneGrupo }}
          </option>
          <option
            v-for="todo in traerMaterias"
            :key="todo.id"
            v-bind:value="todo.idMateria"
          >
            {{ todo.idGrupo }} -
            {{ todo.Materia }}
          </option>
        </select>

        <input
          type="text"
          class="form-control inpuntRegistro"
          id="Dia"
          placeholder="04"
          v-model="dia"
        />

        <input
          type="text"
          class="form-control inpuntRegistro"
          id="mes"
          placeholder="08"
          v-model="mes"
        />

        <input
          type="text"
          class="form-control inpuntRegistro"
          id="anio"
          placeholder="2022"
          v-model="anio"
        />
        <div>
          <i
            class="fas fa-search btn-lupa-registro"
            type="button"
            value="Filtrar"
            v-on:click="filtrar()"
          ></i>
        </div>
        <div>
          <i
            class="fas fa-sync btn-lupa-registro"
            style="background-color: green"
            v-on:click="limpiarFiltro()"
          ></i>
        </div>
      </div>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <div
        class="noResultadoRegistroComp"
        v-else-if="comprobarArrayVacio(registroListas)"
      >
        <p>{{ language.noEncontroDatos }}</p>
      </div>
      <div v-else>
        <div
          class="list-group-item-action item-registro"
          aria-current="true"
          v-for="lista in registroListas"
          :key="lista.id"
          style="border-bottom: 1px solid var(--background)"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ lista.idGrupo }} {{ lista.materia }}</h5>
            <small class="text-muted ojoRegistro">
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
                >{{ language.ver
                }}<i
                  class="fas fa-eye"
                  v-on:click="descargarLista(lista.idClase)"
                >
                </i>
              </router-link>
            </small>
          </div>
          <p class="fechaRegistroComponent">
            {{ language.fecha }}: {{ moment(lista.created_at) }}
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
import language from "../assets/lang/registroClases.json";
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
      registroListas: "",
      traerMaterias: "",
      idMateria: "",
      dia: "",
      mes: "",
      anio: "",
      opt: false,
      resultadoVacio: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    if (this.usuario.ou == "Alumno") {
      this.$router.push("/home");
    }
    this.selectLanguage();
    this.traerListas();
    this.traerGrupoProfesor();
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
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
    },

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
        this.$swal.fire(this.language.inputVacio1, "", "info");
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
            text: this.language.algoSalioMal,
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
