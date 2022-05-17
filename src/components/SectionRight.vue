<template>
  <div class="events">
    <div class="events_header">
      <div
        class="events_icon dropdown"
        style="cursor: pointer"
        v-if="tareasPendientes && usuario.ou == 'Alumno'"
        @click="mostrarNoticacion('campana')"
      >
        <i class="far fa-bell dropbtn"></i>
        <div
          class="dropdown-content"
          style="
            text-decoration: none;
            width: 120px !important;
            cursor: pointer;
            text-align: center;
            margin: 0;
          "
        >
          <span style="padding-top: 10px !important">
            <router-link
              style="
                text-decoration: none;
                font-size: 14px;
                padding: 0px !important;
              "
              class="router-link"
              :to="{
                name: 'listado-tareas',
                params: {
                  materia: tarea.Materia,
                  idGrupo: tarea.idGrupo,
                  idMateria: tarea.idMateria,
                  tareas_vencidas: false,
                },
              }"
              v-for="tarea in materiasTareasPendientes"
              :key="tarea.id"
            >
              <p>{{ tarea.Materia }}</p>
            </router-link>
          </span>
        </div>
      </div>

      <div
        class="events_icon dropdown"
        style="cursor: pointer"
        v-else
        @click="mostrarNoticacion('campana')"
      >
        <i class="far fa-bell dropbtn"></i>
        <div
          class="dropdown-content"
          style="
            text-decoration: none;
            width: 130px !important;
            cursor: pointer;
            text-align: center;
            margin: 0;
          "
        >
          <span id="campana" style="padding: 0px !important">
            <p
              style="
                text-decoration: none;
                font-size: 14px;
                padding: 0px !important;
                color: black;
              "
            >
              {{ language.sinNotificaciones }}
            </p>
          </span>
        </div>
      </div>

      <div
        class="events_icon dropdown"
        style="cursor: pointer"
        @click="mostrarNoticacion('configuracion')"
      >
        <i class="fal fa-cog dropbtn"></i>
        <div class="dropdown-content" style="cursor: pointer">
          <span>
            <router-link
              :to="{
                name: 'profile',
                params: {
                  idUsuario: usuario.username,
                },
              }"
              style="text-decoration: none; font-size: 14px; padding: 5px"
              class="router-link"
            >
              {{ language.miPerfil }}</router-link
            >
          </span>
          <span>
            <router-link
              to="/cambioPwd"
              style="
                text-decoration: none !important;
                font-size: 14px;
                padding: 5px;
              "
              class="router-link"
            >
              {{ language.cambiarContra }}
            </router-link>
          </span>
        </div>
      </div>

      <div class="events_icon dropdown" style="cursor: pointer">
        <i class="fal fa-globe dropbtn"></i>

        <div
          class="dropdown-content"
          style="cursor: pointer; width: 55px !important"
          v-if="lang == 'es'"
        >
          <p class="iconBar active">
            <span><country-flag country="es" size="normal" /> </span>
          </p>
          <p class="iconBar">
            <span v-on:click="changeLanguage()"
              ><country-flag country="gb" size="normal" />
            </span>
          </p>
        </div>

        <div
          class="dropdown-content"
          style="cursor: pointer; width: 55px !important"
          v-else
        >
          <p class="iconBar">
            <span v-on:click="changeLanguage()"
              ><country-flag country="es" size="normal" />
            </span>
          </p>
          <p class="iconBar active">
            <span><country-flag country="gb" size="normal" /> </span>
          </p>
        </div>
      </div>

      <div class="events_icon" style="cursor: pointer">
        <i class="fal fa-door-open" v-on:click="cerrarSesion()"></i>
      </div>
    </div>

    <div class="calendarioElement">
      <v-date-picker
        show-weeknumbers="right-outside"
        mode="date"
        :locale="language.calendario"
        v-model="date"
        :valid-hours="{ min: 4, max: 17 }"
        is24hr
      />
    </div>

    <div class="currentEvent">
      <div class="currentEvent_contenedor">
        <h3>{{ language.eventosHoy }}</h3>
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
        {{ language.prueba1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
/* import $ from "jquery"; */
import moment from "moment";
import language from "../assets/lang/sectionRight.json";
import CountryFlag from "vue-country-flag";
export default {
  name: "SectionRight",
  components: {
    CountryFlag,
  },
  data() {
    return {
      loading: true,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      eventos: "",
      cargarTareas: "",
      tareasPendientes: true,
      profesor: false,
      aux: 1,
      date: new Date(),
      lang: localStorage.getItem("lang"),
      language: "",
      materiasTareasPendientes: "",
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
    this.selectLanguage();
  },
  methods: {
    changeLanguage() {
      if (this.lang == "es") {
        localStorage.setItem("lang", "en");
        location.reload();
      } else {
        localStorage.setItem("lang", "es");
        location.reload();
      }
    },
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
    },
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
            if (
              res.data.re_hacer.length === 0 &&
              res.data.tareas.length === 0
            ) {
              this.tareasPendientes = false;
            }
            this.materiasTareasPendientes = this.tareaMateriasArray();
          }
        });
    },
    cerrarSesion() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("perfil_img");
      localStorage.removeItem("logged");
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

<style scoped>
/* Dropdown Button */

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  width: 99px;
  height: auto;
  font-size: 12pt;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content span {
  color: skyblue;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
  display: inline-block;
}

.active {
  background-color: rgb(121, 172, 249);
}
/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
</style>