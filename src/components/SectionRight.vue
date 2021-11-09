<template>
  <div class="events">
    <div class="events_header">
      <div class="events_icon">
        <i class="fas fa-bell sombra coloricono"></i>
      </div>
      <div class="events_icon">
       <router-link to="/profile"> <i class="fas fa-cog sombra coloricono"></i></router-link> 
      </div>
      <div class="events_icon">
        <a href="" v-on:click="cerrarSesion()">
          <i class="fas fa-door-open sombra coloricono"></i>
        </a>
      </div>
    </div>

    <div class="event">
      <div class="calendarioElement">
        <Calendar></Calendar>
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
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
import Calendar from "v-calendar/lib/components/calendar.umd";
export default {
  name: "SectionRight",
  components: {
    Calendar,
  },
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }
  },
  methods: {
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