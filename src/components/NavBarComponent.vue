<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-dark"
    style=" !important; margin: auto"
  >
    <router-link to="/home" class="router-link navbar-brand">
      <img
        src="../assets/images/LogoFinal.png"
        alt="Logo"
        width="60px"
        height="50px"
    /></router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div
      class="collapse navbar-collapse d-flex justify-content-end"
      id="navbarNav"
    >
      <ul class="navbar-nav">
        <li class="nav-item hover">
          <router-link to="/home" class="router-link nav-link">
            <span>{{ language.inicio }}</span>
          </router-link>
        </li>
        <li class="nav-item hover">
          <router-link to="/materias" class="router-link nav-link">
            <span>{{ language.materias }}</span>
          </router-link>
        </li>
        <li class="nav-item hover" v-if="profesor">
          <router-link to="/agenda-virtual" class="router-link nav-link">
            <span>{{ language.agendaVirtual }}</span>
          </router-link>
        </li>
        <li class="nav-item hover" v-else>
          <router-link to="/calificaciones" class="router-link nav-link">
            <span>{{ language.calificaciones }}</span>
          </router-link>
        </li>

        <li class="nav-item hover">
          <router-link to="/calendario" class="router-link nav-link">
            <span>{{ language.calendario }}</span>
          </router-link>
        </li>
        <li class="nav-item hover">
          <router-link to="/noticias" class="router-link nav-link">
            <span>{{ language.noticias }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="d-flex justify-content-center" style="margin-left:5vh;margin-right:-2vh;color:whitesmoke">
        <div
          class="events_icon dropdown"
          style="cursor: pointer"
          v-if="notificaciones.length == 0"
        >
          <i class="far fa-bell-slash dropbtn"></i>
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
        <div class="events_icon dropdown" style="cursor: pointer" v-else>
          <i class="far fa-bell dropbtn"></i>
          <div class="punto-rojo"></div>
          <div
            class="dropdown-content"
            style="
              text-decoration: none;
              width: 240px !important;
              cursor: pointer;
              padding: 5px;
              text-align: center;
              margin: 0;
              z-index: 2;
              border-radius: 5px;
            "
          >
            <span id="campana" style="padding: 0px !important; margin: 0">
              <span
                v-for="notificacion in notificaciones"
                class="notification-site elipsis"
                :key="notificacion.id"
                @click="marcarComoLeida(notificacion.id)"
                :title="parsearNotificacion(notificacion)"
              >
                <router-link
                  :to="notificacion.data.deeplink"
                  class="router-link"
                >
                  {{ parsearNotificacion(notificacion) }}
                </router-link>
              </span>
            </span>
          </div>
        </div>
        <div class="events_icon dropdown" style="cursor: pointer">
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
  </nav>
</template>
<script>
import { Global } from "../Global";
import axios from "axios";
import language from "../assets/lang/sectionLeft.json";
import CountryFlag from "vue-country-flag";
export default {
  name: "NavBarComponent",
  components: {
    CountryFlag,
  },
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      loading: true,
      lang: localStorage.getItem("lang"),
      language: "",
      profesor: false,
      changeGroup: false,
      localStorageGroup: localStorage.getItem("idGrupo"),
      notificaciones: "",
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
    }
    this.cargarNotificaciones();

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
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
    },
  },
};
</script>

<style scoped>
.icon {
  padding: 10px;
}
.hover:hover {
  color: #636363;
  border-bottom: 0.5px solid #636363;
}
</style>


<style scoped>
/* Dropdown Button */

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

.active {
  background-color: rgb(121, 172, 249);
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

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
</style>