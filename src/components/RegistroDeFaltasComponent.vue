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
            class="nav-link"
            style="text-decoration: none"
          >
            Registro de Clases
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/historial-faltas"
            class="nav-link active"
            style="text-decoration: none"
          >
            Historial de Faltas
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
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            @click="traerFaltasTotales(materia.idGrupo, materia.idMateria)"
          >
            {{ materia.idGrupo }} - {{ materia.Materia }}
          </button>
          <p></p>
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
              <table class="table">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">Cedula</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Cantidad Faltas</th>
                    <th scope="col">Cantidad Clases</th>
                    <th scope="col">Fechas de Ausencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="alumno in tablaData" :key="alumno.id">
                    <th scope="row">{{ alumno.idAlumno }}</th>
                    <td>{{ alumno.nombreAlumno }}</td>
                    <td>{{ alumno.cantidad_faltas }}</td>
                    <td>{{ alumno.total_clases }}</td>
                    <td>
                      <p
                        v-for="fecha in alumno.fechas_ausencia"
                        :key="fecha.id"
                      > 
                        {{ fechaAusencia(fecha) }}
                     
                      </p>
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
                  Cerrar
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

export default {
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Historial de Entregas",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      tablaData: "",
    };
  },
  mounted() {
    this.traerGrupoProfesor();
  },
  methods: {
    fechaAusencia(fecha) {
       
            
        return $.isEmptyObject(fecha)? "No hay fecha": moment(fecha.fecha_clase).format("DD/MM/YYYY HH:mm a");
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
            text: "Parece que algo salio mal ...",
          });
        });
    },
    filtrarPorNombre() {
      alert("filtro");
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
  },
};
</script>