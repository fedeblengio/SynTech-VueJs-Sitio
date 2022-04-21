<template>
  <div class="events">
    <div class="events_header">
      <div
        class="events_icon"
        v-if="tareasPendientes && usuario.ou=='Alumno'"
        @click="mostrarNoticacion('campana')"
      >
        <i class="far fa-bell noticont" style="color: red">
          <span class="icon_noti" id="campana">
            <router-link
              style="text-decoration: none"
              :to="{
                name: 'listado-tareas',
                params: {
                  materia: tarea.Materia,
                  idGrupo: tarea.idGrupo,
                  idMateria: tarea.idMateria,
                  tareas_vencidas: false,
                }, 
              }"
              class="nav-link strippedRow"
              v-for="tarea in tareaMateriasArray()"
              :key="tarea.id"
            >
              <p>{{ tarea.Materia }}</p>
            </router-link>
          </span>
        </i>
      </div>
      <div class="events_icon" v-else @click="mostrarNoticacion('campana')">
        <i class="far fa-bell-slash noticont">
          <span class="icon_noti" id="campana">
            <p>Sin notificaciones</p>
          </span>
        </i>
      </div>
      <div class="events_icon" @click="mostrarNoticacion('configuracion')">
        <i class="fal fa-cog noticont">
          <span class="icon_noti" id="configuracion">
            <p>
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    idUsuario: usuario.username,
                  },
                }"
                style="text-decoration: none"
                class="router-link"
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
        <i class="fal fa-door-open" v-on:click="cerrarSesion()"></i>
      </div>
    </div>

    <div class="calendarioElement">
      <v-date-picker
        mode="date"
        v-model="date"
        :valid-hours="{ min: 4, max: 17 }"
        is24hr
      />
    </div>

    <div class="currentEvent">
      <div class="currentEvent_contenedor">
        <h3>Mis Eventos (Hoy)</h3>
        <div class="sidebarElement" v-if="loading">
          <span class="clases text-center">
            <span class="sidebarDot_event"></span> . . .
          </span>
        </div>
        <div
          class="sidebarElement"
          v-for="todo in eventos"
          :key="todo.id"
          v-else
        >
          <router-link to="/calendario" class="router-link">
            <span class="clases">
              <span class="sidebarDot_event"></span> {{ evento(todo) }}
            </span>
          </router-link>
        </div>
      
        <tokenExpired v-if='token'></tokenExpired>
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
import $ from "jquery"; 
import moment from "moment";
import tokenExpired from './TokenExpiradoComponent.vue'
export default {
  name: "SectionRight",
  components: {
    tokenExpired
  },
  data() {
    return {
      loading: true,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      eventos: "",
      cargarTareas: "",
      tareasPendientes: false,
      profesor: false,
      aux: 1,
      date: new Date(),
      token:false
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
      this.profesor = true;
    } else {
      this.cargarTareasCreadas();
    }
    this.cargarEventos();
  },
  methods: {
    tareaMateriasArray() {
      let array = [];
      const map = new Map();
      this.cargarTareas.tareas.forEach(function (tarea) {
        if (!map.has(tarea.Materia)) {
          map.set(tarea.Materia, "tarea");
          array.push(tarea);
        }
      });
      this.cargarTareas.re_hacer.forEach(function (tarea) {
        if (!map.has(tarea.Materia)) {
          map.set(tarea.Materia, "tarea");
          array.push(tarea);
        }
      });
      return array;
    },
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
            this.loading = false;
            if ($.isEmptyObject(res.data)) {
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
        })
        .catch(() => {
          this.token=true;
        });

    },
  },
};
</script>