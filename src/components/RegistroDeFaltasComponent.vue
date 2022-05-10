<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{ language.registroListasPasadas }}</h2>
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
            class="nav-link"
            style="text-decoration: none"
          >
            {{ language.registroClases }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/historial-faltas"
            class="nav-link active"
            style="text-decoration: none"
          >
            {{ language.historialFaltas }}
          </router-link>
        </li>
      </ul>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>

      <div v-else>
        <div
          class="list-group-item-action item-registro"
          aria-current="true"
          v-for="materia in traerMaterias"
          :key="materia.id"
          style="border-bottom: 1px solid var(--background)"
        >
          <div
            style="cursor: pointer"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            @click="traerFaltasTotales(materia.idGrupo, materia.idMateria)"
          >
            <h5>{{ materia.idGrupo }} {{ materia.Materia }}</h5>
          </div>
        </div>
        <!-- MODAL FALTAS GRUPO  -->

        <div
          class="modal fade bd-example-modal-lg"
          tabindex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <table class="table tableFalta">
                <thead class="thead-dark">
                  <tr class="text-center">
                    <th scope="col">{{language.cedula}}</th>
                    <th scope="col">{{language.nombre}}</th>
                    <th scope="col">{{language.cantFaltas}}</th>
                    <th scope="col">{{language.cantClases}}</th>
                    <th scope="col">{{language.fechasAusencia}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="alumno in tablaData"
                    :key="alumno.id"
                    class="text-center"
                  >
                    <th scope="row">{{ alumno.idAlumno }}</th>
                    <td>{{ alumno.nombreAlumno }}</td>
                    <td>{{ alumno.cantidad_faltas }}</td>
                    <td>{{ alumno.total_clases }}</td>
                    <td>
                      <div class="tooltip2">
                        {{language.ver}} <i class="far fa-eye"></i>
                        <span class="tooltiptext">
                          <p
                            v-for="fecha in alumno.fechas_ausencia"
                            :key="fecha.id"
                          >
                            {{ fechaAusencia(fecha) }}
                          </p>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  {{ language.cerrar}}
                </button>
              </div>
            </div>
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
import $ from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
import language from "../assets/lang/registroDeFaltas.json";
export default {
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      tablaData: "",
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
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
    fechaAusencia(fecha) {
      return $.isEmptyObject(fecha)
        ? this.language.noHayFecha
        : moment(fecha.fecha_clase).format("DD/MM/YYYY HH:mm a");
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
    traerFaltasTotales(idGrupo, idMateria) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "lista-clase?idGrupo=" +
            idGrupo +
            "&idMateria=" +
            idMateria,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.tablaData = res.data;
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

    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
  },
};
</script>