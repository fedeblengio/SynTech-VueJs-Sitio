<template>
  <div>
    <vue-headful :title="title" />

    <header>
      <div class="contenedor">
        <h1><i class="fas fa-books"></i> LMS</h1>
        <input type="checkbox" id="menu-barra" />
        <label class="icon-menu" for="menu-barra"></label>
        <nav class="menu">
          <a href="/home">
            <i class="fa fa-home" aria-hidden="true"></i>
          </a>
          <a href="/miPerfil" v-if="logged"> {{ usuario.nombre }}</a>
          <a href="/login" v-else> Login</a>
        </nav>
      </div>
    </header>

    <div class="ContenedorSup" v-if="logged">
      <div class="info">
        <materias v-if="usuario.ou === 'Alumno'"></materias>
        <grupos v-else></grupos>
      </div>
      <div class="cont">
        <router-view> </router-view>
      </div>
    </div>

    <div class="loginSet" v-else>
      <router-view> </router-view>
    </div>

    <FlashMessage></FlashMessage>
  </div>
</template>






<script>
import vueHeadful from "vue-headful";
import materias from "./components/MateriasAlumnoComponent.vue";
import grupos from "./components/gruposComponent.vue";
export default {
  name: "App",
  components: {
    vueHeadful,
    materias,
    grupos,
  },
  data() {
    return {
      usuario: "",
      logged: false,
      profesor: false,
      title: "BackOffice",
    };
  },
  mounted() {
    this.verificarLogueo();
  },
  methods: {
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;
        this.usuario = JSON.parse(
          window.atob(localStorage.getItem("auth_token"))
        );
        if (this.usuario.ou == "Profesor") {
          this.profesor = true;
        }
      }
    },
  },
};
</script>
<style>
/* body {
  background-color: lightgrey;
  background-image: url(./assets/images/fondo-aflv.jpg);
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
} */
/* @import "./assets/css/estilos.css"; */
@import "./assets/css/app.css";
@import "./assets/css/iconos.css";
</style>
