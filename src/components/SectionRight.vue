<template>
  <div class="events">
    <!-- <div class="events_header"> -->
    <div class="currentEvent maxWidth" style="margin-top:20px !important">
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
        <div class="sidebarUser">
          <img :src="returnImgB64()" />
          <p id="nameUser">{{ usuario.nombre }}</p>
        </div>
      </router-link>
    </div>
      <div class="sidebarClass maxWidth"  style="margin-left:20px !important">
      <h3>{{ language.misGrupos }}</h3>

      <div class="sidebarElement" v-if="loading">
        <span class="clases"> <span class="sidebarDot"></span> . . .</span>
      </div>
      <div v-else>
        <span class="d-flex" v-if="!changeGroup">
          <input
            type="text"
            class="form-control"
            disabled
            :value="localStorageGroup"
          />
          <i class="fas fa-pencil icon" style="padding:10px" @click="changeGroup = true"></i>
        </span>
        <span v-else class="d-flex">
          <select
            v-on:change="cambiarGrupo()"
            class="form-control"
            v-model="selectedGroup"
            required
            id="group-select"
          >
            <option
              v-for="todo in groupNames"
              :key="todo.ids"
              :id="todo"
              v-bind:value="todo"
            >
              {{ todo }}
            </option>
          </select>
          <i class="fas fa-times icon" style="padding:10px" @click="changeGroup = false"></i>
        </span>
      </div>
    </div>


 
    

    

    <div class="calendarioElement maxWidth">
      <v-date-picker
        show-weeknumbers="right-outside"
        mode="date"
        :locale="language.calendario"
        v-model="date"
        :valid-hours="{ min: 4, max: 17 }"
        is24hr
      />
    </div>
    <div class="currentEvent maxWidth">
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
      </div>
    </div>
    <div class="currentEvent maxWidth">
      <div class="currentEvent_contenedor">
        <h3>{{ language.misClases }}</h3>
        <div class="sidebarElement" v-if="loadingMaterias">
          <span class="clases"> <span class="sidebarDot"></span> . . .</span>
        </div>

        <div
          class="sidebarElement"
          v-for="todo in traerMaterias"
          :key="todo.id2"
          v-else
        >
          <router-link
            :to="{
              name: 'materia-seleccionada',
              params: {
                idGrupo: todo.idGrupo,
                idMateria: todo.idMateria,
                materia: todo.Materia,
              },
            }"
            style="text-decoration: none"
          >
            <span class="clases">
              <span class="sidebarDot"></span>
              {{ todo.Materia }}</span
            ></router-link
          >
        </div>
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

export default {
  name: "SectionRight",

  data() {
    return {
      loading: true,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      eventos: "",
      traerMaterias: "",
      profesor: false,
      aux: 1,
      date: new Date(),
     
      language: "",
      loadingMaterias: true,

      notificaciones: "",

      spinner: Global.spinnerUrl,
      selectedGroup: "",
      changeGroup: false,
      grupos: "",
      groupNames: [],
      localStorageGroup: localStorage.getItem("idGrupo"),
    };
  },
  mounted() {
    this.traerGrupo();
    this.cargarNotificaciones();
    this.cargarEventos();
    this.selectLanguage();
    
  },
  methods: {
    returnImgB64() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
      cambiarGrupo() {
      localStorage.setItem("idGrupo", this.selectedGroup);
      this.localStorageGroup = this.selectedGroup;
      this.$router.push({ name: "home" });

      location.reload();
    },
    getNotDuplicatedNames(groups) {
      let names = [];
      for (let g of groups) {
        if (!names.includes(g.idGrupo)) {
          names.push(g.idGrupo);
        }
      }
      return names;
    },
    traerGrupo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio + "usuario/" + this.usuario.username + "/grupo",
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.grupos = res.data;
            this.groupNames = this.getNotDuplicatedNames(res.data);
            if (localStorage.getItem("idGrupo")) {
              this.selectedGroup = localStorage.getItem("idGrupo");
              this.localStorageGroup = localStorage.getItem("idGrupo");
            } else {
              this.selectedGroup = this.groupNames[0];
              this.localStorageGroup = this.groupNames[0];
              localStorage.setItem("idGrupo", this.groupNames[0]);
            }
            this.traerMateriasUser(this.selectedGroup);
          }
        });
    },
    traerMateriasUser(grupo) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "grupo/" +
            grupo +
            "/materia" +
            "?idUsuario=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.loadingMaterias = false;
          }
        })
        .catch(() => {
          let timerInterval;
          this.$swal.fire({
            title: this.language.tituloTokenExpirado,
            html: this.language.tokenExpirado,
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              this.$swal.showLoading();
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          });
          localStorage.removeItem("auth_token");
          localStorage.removeItem("perfil_img");
          localStorage.removeItem("logged");
          localStorage.removeItem("idGrupo");
          this.$router.push("/login");
        });
    },
    marcarComoLeida(notificacionId) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .put(Global.urlSitio + "notificacion/" + notificacionId, [], config)
        .then((res) => {
          if (res.status == 200) {
            this.cargarNotificaciones();
          }
        });
    },
    parsearNotificacion(noti) {
      let notificacion = noti.data;
      if (notificacion.tipo == "tarea") {
        return (
          this.language.nuevaTarea +
          " " +
          notificacion.nombreMateria +
          " - " +
          notificacion.grupo
        );
      }
      if (notificacion.tipo == "entrega") {
        return notificacion.alumno + " " + this.language.nuevaEntrega;
      }
      if (notificacion.tipo == "re-entrega") {
        return notificacion.alumno + " " + this.language.nuevaReEntrega;
      }

      if (notificacion.tipo == "correccion") {
        if (notificacion.re_entrega) {
          return this.language.soliciudReEntrega + " " + notificacion.materia;
        }
        return this.language.nuevaCorreccion;
      }
      if (notificacion.tipo == "re-correccion") {
        return this.language.nuevaReCorreccion;
      }
    },
    cargarNotificaciones() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "notificacion/usuario/" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.notificaciones = res.data;
          }
          this.loading = false;
        });
    },
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

    cerrarSesion() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("perfil_img");
      localStorage.removeItem("logged");
      localStorage.removeItem("idGrupo");
      location.reload();
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios.post(Global.urlSitio + "logout", config).then(() => {
        console.log("Sesion cerrada");
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
          Global.urlSitio + "evento/usuario/" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.eventos = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.cerrarSesion();
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
.maxWidth{
  max-width: 280px;
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