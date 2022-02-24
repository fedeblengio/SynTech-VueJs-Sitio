<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tareas Entregadas</h2>
      </div>
      
      <div class="list-group">
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
            <small class="text-muted">Titulo : {{ entregas.titulo }} </small>
            <small class="text-muted">
              Nota : <b> {{ calificacion(entregas.calificacion) }}</b></small
            >
          </div>

          <p class="mb-1">{{ entregas.idGrupo }} - {{ entregas.usuario }}</p>
        </router-link>
      </div>
      {{listadoEntregasGrupo}}
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
      routerValues:{
          idGrupo: "",
          idMateria: "",
          idTareas:"",
      },
      listadoEntregasGrupo:'',
    };
  },
  mounted() {
    this.routerValues.idGrupo = this.$route.params.idGrupo;
    this.routerValues.idMateria = this.$route.params.idMateria;
    this.routerValues.idTareas = this.$route.params.idTareas;
    this.verificarRol();
  },
  methods: {
      calificacion(nota){
          if(nota!=undefined){
              return nota+" / 12";
          }else{
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