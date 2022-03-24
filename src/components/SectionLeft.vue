<template>
  <div class="sidebar">
    <router-link to="/profile" class="router-link">
      <div class="sidebarUser">
        <img id="profile_img" :src="returnImgProfile()" />
        <p>{{ usuario.nombre }}</p>
      </div>
    </router-link>
    <div class="contenedor-sidebar">
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <router-link to="/home" class="router-link">
          <h2>Inicio</h2>
        </router-link>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-book"></i>
        <router-link to="/materias" class="router-link">
          <h2>Materias</h2>
        </router-link>
      </div>
      <div class="sidebarOption" v-if="profesor">
        <i class="fas fa-chalkboard-teacher"></i>

        <router-link to="/agenda-virtual" class="router-link">
          <h2>Agenda Virtual</h2>
        </router-link>
      </div>
  <!--     <div class="sidebarOption">
        <i class="fas fa-pen"></i>

        <router-link to="/tareas" class="router-link">
          <h2>Tareas</h2>
        </router-link>
      </div> -->
      <div class="sidebarOption">
        <i class="fas fa-calendar"></i>
        <router-link to="/calendario" class="router-link">
          <h2>Calendario</h2>
        </router-link>
      </div>
    </div>
    <div class="sidebarClass" >
      <h3>Mis Clases</h3>
      <div class="sidebarElement" v-if=loading>
        <span class="clases"> <span class="sidebarDot"></span> . . .</span>
      </div>
      <div class="sidebarElement" v-for="todo in traerMaterias" :key="todo.id" v-else>
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
            <span class="sidebarDot"></span> {{ todo.idGrupo }} -
            {{ todo.Materia }}</span
          ></router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Global } from "../Global";
import axios from "axios";

export default {
  name: "SectionLeft",
  components: {},
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      profesor: false,
      loading: true,
      spinner: Global.spinnerUrl,
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }
  },
  methods: {
    cargarFoto() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
      axios
        .get(
          Global.urlSitio +
            "imagen-perfil?imagen_perfil=" +
            usuario.imagen_perfil,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            let url_imagen = res.data;
            localStorage.setItem("perfil_img", url_imagen);

            document.getElementById("profile_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");

            document.getElementById("post_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");
          }
        });
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
          this.loading = false;
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
          this.loading = false;
        });
    },
    returnImgProfile() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
  },
};
</script>