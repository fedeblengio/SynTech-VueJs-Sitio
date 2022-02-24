<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tareas Entregadas</h2>
      </div>

      <div class="accordion" id="accordionExample">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h5 class="mb-0">
              <button
                class="btn btn-link"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Tareas entregadas por primera vez
              </button>
            </h5>
          </div>

          <div
            id="collapseOne"
            class="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div
              class="list-group"
              v-if="hayEntregas(listadoEntregasGrupo.entregas_tareas)"
            >
              <router-link
                :to="{
                  name: 'listado-tareas',
                  params: {
                    materia: entregas.Materia,
                    idGrupo: entregas.idGrupo,
                    idMateria: entregas.idMateria,
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="entregas in listadoEntregasGrupo.entregas_tareas"
                :key="entregas.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted"
                    >Titulo : {{ entregas.titulo }}
                  </small>
                  <small class="text-muted">
                    Nota :
                    <b> {{ calificacion(entregas.calificacion) }}</b></small
                  >
                </div>

                <p class="mb-1">
                  {{ entregas.idGrupo }} - {{ entregas.usuario }}
                </p>
              </router-link>
            </div>
            <div class="card-body" v-else>
              No hay entregas realizadas para esta tarea.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" id="headingTwo">
            <h5 class="mb-0">
              <button
                class="btn btn-link collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Tareas entregadas por segunda vez
              </button>
            </h5>
          </div>
          <div
            id="collapseTwo"
            class="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionExample"
          >
            <div
              class="list-group"
              v-if="hayEntregas(listadoEntregasGrupo.re_hacer)"
            >
              <router-link
                :to="{
                  name: 'listado-tareas',
                  params: {
                    materia: entregas.Materia,
                    idGrupo: entregas.idGrupo,
                    idMateria: entregas.idMateria,
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="entregas in listadoEntregasGrupo.re_hacer"
                :key="entregas.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted"
                    >Titulo : {{ entregas.titulo }}
                  </small>
                  <small class="text-muted">
                    Nota :
                    <b> {{ calificacion(entregas.calificacion) }}</b></small
                  >
                </div>

                <p class="mb-1">
                  {{ entregas.idGrupo }} - {{ entregas.usuario }}
                </p>
              </router-link>
            </div>
            <div class="card-body" v-else>
              No hay entregas realizadas para esta tarea.
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
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
window.$ = JQuery;
export default {
  name: "TareasComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tareas",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      alumno: true,
      routerValues: {
        idGrupo: "",
        idMateria: "",
        idTareas: "",
      },
      listadoEntregasGrupo: "",
    };
  },
  mounted() {
    this.routerValues.idGrupo = this.$route.params.idGrupo;
    this.routerValues.idMateria = this.$route.params.idMateria;
    this.routerValues.idTareas = this.$route.params.idTareas;
    this.verificarRol();
  },
  methods: {
    hayEntregas(entregas) {
      if (entregas == null || entregas == "") {
        return false;
      } else {
        return true;
      }
    },
    calificacion(nota) {
      if (nota != undefined) {
        return nota + " / 12";
      } else {
        return "S / C";
      }
    },
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.alumno = false;
        this.listarEntregasGrupo();
      } else {
        this.alumno = true;
      }
    },
    listarEntregasGrupo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "entregas-grupo?idGrupo=" +
            this.routerValues.idGrupo +
            "&idMateria=" +
            this.routerValues.idMateria +
            "&idTareas=" +
            this.routerValues.idTareas,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listadoEntregasGrupo = res.data;
          }
        });
    },
  },
};
</script>