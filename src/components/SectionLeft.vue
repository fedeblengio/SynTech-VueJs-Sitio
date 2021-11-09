<template>
  <div class="sidebar">
    <router-link to="/profile">
    <div class="sidebarUser">
      <img id="profile_img" :src="returnImgProfile()" />
      <p>{{ usuario.nombre }}</p>
    </div>
    </router-link>
    <div class="contenedor-sidebar">
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <router-link to="/home">
          <h2>Home</h2>
        </router-link>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <router-link to="/materias" style="text-decoration: none">
          <h2>Materias</h2>
        </router-link>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <router-link to="/calendario">
          <h2>Calendario</h2>
        </router-link>
      </div>
    </div>
    <div class="sidebarClass">
      <h3>Mis Clases</h3>
      <div class="sidebarElement" v-for="todo in traerMaterias" :key="todo.id">
        <span class="clases">
          <span class="sidebarDot"></span> {{ todo.idGrupo }} -
          {{ todo.Materia }}</span
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
    returnImgProfile() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
  },
};
</script>