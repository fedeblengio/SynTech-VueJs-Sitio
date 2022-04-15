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
                Tareas Entregadas
              </button>
            </h5>
          </div>

          <div
            id="collapseOne"
            class="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div class="list-group"   v-if="hayEntregas(listadoEntregasGrupo.entregas_totalesNoCorregidas)">
              <router-link
                :to="{
                  name: 'calificar-alumnos',
                  params: {
                    idAlumnos: entregas.idAlumnos,
                    idTareas: entregas.idTarea,
                    re_entrega: false,
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="entregas in listadoEntregasGrupo
                  .entregas_totalesNoCorregidas.entregas_tareas_no_corregidas"
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
              <router-link
                :to="{
                  name: 'calificar-alumnos',
                  params: {
                    idAlumnos: re_entregas.idAlumnos,
                    idTareas: re_entregas.idTarea,
                    re_entrega: true,
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="re_entregas in listadoEntregasGrupo
                  .entregas_totalesNoCorregidas.re_hacer_no_corregidas"
                :key="re_entregas.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted"
                    >Titulo : {{ re_entregas.titulo }}
                  </small>
                  <small class="text-muted">
                    Nota :
                    <b> {{ calificacion(re_entregas.calificacion) }}</b></small
                  >
                </div>

                <p class="mb-1">
                  {{ re_entregas.idGrupo }} - {{ re_entregas.usuario }}
                </p>
              </router-link>
            </div>
            <div class="list-group" v-else>
              <p class="list-group-item list-group-item-action"> No hay tareas entregadas.</p>
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
                Tareas Corregidas
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
              v-if="hayCorregidas(listadoEntregasGrupo.entregas_totalesCorregidas)"
            >
               <router-link
                :to="{
                  name: 'visualizar-tareas',
                  params: {
                    idAlumnos: corregidas.idAlumnos,
                    idTareas: corregidas.idTarea,
                
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="corregidas in listadoEntregasGrupo
                  .entregas_totalesCorregidas.entregas_tareas_corregidas"
                :key="corregidas.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted"
                    >Titulo : {{ corregidas.titulo }}
                  </small>
                  <small class="text-muted">
                    Nota :
                    <b> {{ calificacion(corregidas.calificacion) }}</b></small
                  >
                </div>

                <p class="mb-1">
                  {{ corregidas.idGrupo }} - {{ corregidas.usuario }}
                </p>
              </router-link>
                  <router-link
                :to="{
                  name: 'visualizar-tareas',
                  params: {
                    idAlumnos: re_corregidas.idAlumnos,
                    idTareas: re_corregidas.idTarea,
                  },
                }"
                class="list-group-item list-group-item-action"
                v-for="re_corregidas in listadoEntregasGrupo
                  .entregas_totalesCorregidas.re_hacer_corregidas"
                :key="re_corregidas.id"
              >
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted"
                    >Titulo : {{ re_corregidas.titulo }}
                  </small>
                  <small class="text-muted">
                    Nota :
                    <b>
                      {{ calificacion(re_corregidas.calificacion) }}</b
                    ></small
                  >
                </div>

                <p class="mb-1">
                  {{ re_corregidas.idGrupo }} - {{ re_corregidas.usuario }}
                </p>
              </router-link>
            </div>
            <div class="list-group" v-else>
              <p class="list-group-item list-group-item-action">No hay tareas corregidas.</p>
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
      listadoEntregasGrupo: {
        entregas_totalesNoCorregidas: {
          entregas_tareas_no_corregidas: [],
          re_hacer_no_corregidas: [],
        },
        entregas_totalesCorregidas: {
          entregas_tareas_corregidas: [],
          re_hacer_corregidas: [],
        },
      },
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
        if(entregas.entregas_tareas_no_corregidas.length > 0 || entregas.re_hacer_no_corregidas.length >0  ){
           return true;
        }else{
          return false;
        }
    },
      hayCorregidas(corregidas) {
        if(corregidas.entregas_tareas_corregidas.length > 0 || corregidas.re_hacer_corregidas.length >0  ){
           return true;
        }else{
          return false;
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
            this.listadoEntregasGrupo.entregas_totalesNoCorregidas.entregas_tareas_no_corregidas =
              res.data.entregas_totalesNoCorregidas.entregas_tareas_no_corregidas;
            this.listadoEntregasGrupo.entregas_totalesNoCorregidas.re_hacer_no_corregidas =
              res.data.entregas_totalesNoCorregidas.re_hacer_no_corregidas;
            this.listadoEntregasGrupo.entregas_totalesCorregidas.entregas_tareas_corregidas =
              res.data.entregas_totalesCorregidas.entregas_tareas_corregidas;
            this.listadoEntregasGrupo.entregas_totalesCorregidas.re_hacer_corregidas =
              res.data.entregas_totalesCorregidas.re_hacer_corregidas;
          }
        });
    },
  },
};
</script>