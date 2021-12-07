<template>
  <div class="events">
    <div class="events_header">
      <div class="events_icon" v-if="tareasPendientes">
        <i
          id="notificacion"
          class="fal fa-bell"
          v-on:click="notificacion()"
        ></i>
      </div>
      <div class="events_icon" v-else>
        <i class="far fa-bell-slash"></i>
      </div>
      <div class="events_icon">
        <router-link to="/profile">
          <i class="fal fa-cog" style="color: black"></i>
        </router-link>
      </div>
      <div class="events_icon">
        <a href="" v-on:click="cerrarSesion()">
          <i class="fal fa-door-open" style="color: black"></i>
        </a>
      </div>
    </div>

    <!-- 
    <div class="event">
      <div class="calendarioElement">
        <Calendar></Calendar>
      </div> -->
    <div class="currentEvent">
      <div class="currentEvent_contenedor">
        <h3 class="pendientes_titulo">Pendientes</h3>
        <div class="contenedor_scroll_pendientes">
          <div
           v-on:click="refresh()"
            class="pendientes sidebarElement "
            v-for="tareas in cargarTareas.tareas"
            :key="tareas.id"
          >
            <router-link
               
                :to="{
                  name: 'tarea-seleccionada',
                  params: {
                    materia: tareas.Materia,
                    idTarea: tareas.idTarea,
                    re_hacer: false,
                  },
                }"
                class="router-link"
              >
            <span class="pendientes_tarea">
              {{ tareas.titulo }} - {{ tareas.Materia }}</span
            >
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="currentEvent">
      <div class="currentEvent_contenedor">
        <h3>Mis Eventos</h3>
        <div
          class="sidebarElement"
          v-for="todo in traerMaterias"
          :key="todo.id"
        >
          <span class="clases">
            <span class="sidebarDot_event"></span> {{ todo.idGrupo }} -
            {{ todo.Materia }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
/* import Calendar from "v-calendar/lib/components/calendar.umd"; */

export default {
  name: "SectionRight",
  components: {
    /* Calendar, */
   
  },
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      cargarTareas: "",
      tareasPendientes: false,
     
    };
  },
  mounted() {
    
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
      this.cargarTareasCreadas();
    }
  },
  methods: {
    refresh(){
      location.reload();
    },
    notificacion() {
      let cantTareas =
        this.cargarTareas.tareas.length + this.cargarTareas.re_hacer.length;
      alert("Tienes " + cantTareas + " pendientes");
    },
    cargarTareasCreadas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "tareas?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.cargarTareas = res.data;
            if (this.cargarTareas) {
              this.tareasPendientes = true;
            }
          }
        });
    },
    cerrarSesion() {
      localStorage.clear();
      location.reload();
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
        });
    },
    traerMateriasUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "listarMaterias?idUsuario=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
        });
    },
   
  },
};
</script>