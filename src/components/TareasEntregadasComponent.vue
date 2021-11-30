<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tareas Entregadas</h2>
      </div>

      <div class="feed">
      <p>Entregas</p>

      <div
        v-for="tarea in entregas.entregas_tareas"
        :key="tarea.id"
        class="post"
      >
        <router-link
          :to="{
            name: 'calificar-alumnos',
            params: {
              idTareas: tarea.idTarea,
              idAlumnos: tarea.idAlumnos,
            },
          }"
          style="text-decoration: none"
        >
        <div class="post_body">
          {{ tarea.idAlumnos }}
          <!-- {{tarea.idProfesor}} -->
          <!--      {{tarea.nombreUsuario}} -->
          {{ tarea.usuario }}
          <!--  {{tarea.idMateria}} -->
          <p v-if="tarea.calificacion">{{ tarea.calificacion }}</p>
          <p v-else>TAREA NO CALIFICADA</p>
          <!-- {{tarea.turnoGrupo}} -->
          <!--  {{tarea.fecha_vencimiento}} -->
        </div>
       </router-link> 
      </div>
      <br />
      <p>RE Entregas</p>

      <div v-for="tarea in entregas.re_hacer" :key="tarea.id" class="post">
        <router-link
          :to="{
            name: 'calificar-alumnos',
            params: {
              idTareas: tarea.idTarea,
              idAlumnos: tarea.idAlumnos,
            },
          }"
          style="text-decoration: none"
        >
        
          <div class="post_body">
            {{ tarea.idAlumnos }}
            <!-- {{tarea.idProfesor}} -->
            <!--      {{tarea.nombreUsuario}} -->
            {{ tarea.usuario }}
            <!--  {{tarea.idMateria}} -->
            <p v-if="tarea.calificacion">{{ tarea.calificacion }}</p>
            <p v-else>TAREA NO CALIFICADA</p>
            <!-- {{tarea.turnoGrupo}} -->
            <!--  {{tarea.fecha_vencimiento}} -->
          </div>
        </router-link>
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
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tareas Entregadas",
      usuario: "",
      entregas: "",
    };
  },
  mounted() {
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.cargarTareasEntregadas();
  },
  methods: {
    cargarTareasEntregadas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio + "entregas-alumnos?idAlumnos=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.entregas = res.data;

            
          }
        });
    },
  },
};
</script>