<template>
  <div class="events">
    <div class="events_header">
      <div class="events_icon" v-if="tareasPendientes">
        <i
          id="notificacion"
          class="fal fa-bell"
          @click="mostrarNoticacion('campana')"
        >
          <span class="icon_noti" id="noti">
            <p>Tareas Pendientes</p>
          </span></i
        >
      </div>
      <div class="events_icon" v-else @click="mostrarNoticacion('campana')">
        <i class="far fa-bell-slash noticont">
          <span class="icon_noti" id="campana">
            <p>Sin notificaciones</p>
          </span>
        </i>
      </div>
      <div class="events_icon" @click="mostrarNoticacion('configuracion')">
        <i class="fal fa-cog noticont" style="color: black">
          <span class="icon_noti" id="configuracion">
            <p>
              <router-link
                to="/profile"
                style="text-decoration: none !important"
              >
                Mi Perfil</router-link
              >
            </p>
            <p>
              <router-link
                to="/cambioPwd"
                style="text-decoration: none !important"
              >
                Cambiar Contraseña
              </router-link>
            </p>
          </span>
        </i>
      </div>
      <div class="events_icon">
        <a href="" v-on:click="cerrarSesion()">
          <i class="fal fa-door-open" style="color: black"></i>
        </a>
      </div>
    </div>

    <div class="calendarioElement" v-if="profesor">
     <v-date-picker mode="date" v-model="date"   :valid-hours="{ min: 4, max: 17 }" is24hr />
    </div>
    <div class="currentEvent" v-else>
      <div class="currentEvent_contenedor">
        <h3 class="pendientes_titulo">Pendientes</h3>
        <div class="contenedor_scroll_pendientes">
          <div class="d-flex align-items-center" v-if=loading>
  <strong>Loading...</strong>
  <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
</div>
          <div
          v-else
            v-on:click="refresh()"
            class="pendientes sidebarElement"
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
          <div
            v-on:click="refresh()"
            class="pendientes sidebarElement"
            v-for="tareas in cargarTareas.re_hacer"
            :key="tareas.id"
          >
            <router-link
              :to="{
                name: 'tarea-seleccionada',
                params: {
                  materia: tareas.Materia,
                  idTarea: tareas.idTarea,
                  re_hacer: true,
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
      <div class="sidebarElement" v-if=loading>
          <span class="clases text-center">
            <span class="sidebarDot_event"></span>  . . .
          </span>
        </div>
        <div class="sidebarElement" v-for="todo in eventos" :key="todo.id" v-else>
          <span class="clases">
            <span class="sidebarDot_event"></span> {{ evento(todo) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
import moment from "moment";
export default {
  name: "SectionRight",
  components: {

  },
  data() {
    return {
      loading:true,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      eventos: "",
      cargarTareas: "",
      tareasPendientes: false,
      profesor: false,
      aux: 1,
     date: new Date()
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
      this.profesor = true;
      this.cargarEventos();
    } else {
      this.cargarTareasCreadas();
      this.cargarEventos();
    }
  },
  methods: {
    evento(event) {
      return (
        event.idGrupo +
        " - " +
        event.materia.substr(0, 3) +
        " | " +
        moment(event.fecha_inicio).format("HH:mm") +
        " - " +
        moment(event.fecha_fin).format("HH:mm")
      );
    },
    refresh() {
      location.reload();
    },
    notificacion() {
      let cantTareas =
        this.cargarTareas.tareas.length + this.cargarTareas.re_hacer.length;
      alert("Tienes " + cantTareas + " pendientes");
    },
    mostrarNoticacion(id) {
      let noti = document.getElementById(id);
      let campana = document.getElementById("campana");
      let configuracion = document.getElementById("configuracion");

      if (this.aux == 0) {
        noti.style.display = "none";
        this.aux = 1;
      } else {
        if (noti.id == campana.id) {
          campana.style.display = "block";
          configuracion.style.display = "none";
        } else {
          configuracion.style.display = "block";
          campana.style.display = "none";
        }
        this.aux = 0;
      }
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
    cargarEventos() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "agenda-clase-eventos?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.eventos = res.data;
          }
          this.loading = false;
        });
    },
  },
};
</script>