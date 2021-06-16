<template>
  <div>
    <vue-headful :title="title" />
    <nav class="navbar navbar-expand-lg">
      <h3 class="text-muted">
        <router-link to="/home" title="Home"
          ><img
            src="./assets/images/LogoFinal.png"
            alt="Logo"
            style="width: 70px"
          />
        </router-link>
      </h3>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link
              to="/home"
              class="nav-link navMargin"
              active-class="menuActivo"
              title="Home"
              style="color: lightgrey; text-decoration: none"
              >Home</router-link
            >
          </li>
          <li class="nav-item" v-if="profesor">
            <router-link
              to="/mis-grupos"
              class="nav-link navMargin"
              active-class="menuActivo"
              title="Listar Usuarios"
              style="color: lightgrey; text-decoration: none"
              >Mis Grupos</router-link
            >
          </li>
          <li class="nav-item" v-else>
            <router-link
              to="/materias"
              class="nav-link navMargin"
              active-class="menuActivo"
              title="Listar Usuarios"
              style="color: lightgrey; text-decoration: none"
              >Grupo</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/contacto"
              active-class="menuActivo"
              class="nav-link navMargin"
              title="Contacto"
              style="color: lightgrey; text-decoration: none"
              >Contacto</router-link
            >
          </li>
        </ul>
        <div v-if="logged" class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ usuario.nombre }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <router-link class="dropdown-item" to="/miPerfil">
              Mi Perfil
            </router-link>
            <button class="dropdown-item" v-on:click="cerrarSesion()">
              <em>Cerrar Sesion</em>
            </button>
          </div>
        </div>
        <router-link
          v-else
          to="/login"
          active-class="menuActivoL"
          class="btn btn-success my-2 my-sm-0"
          title="Login"
          style="color: white"
          >Login</router-link
        >
      </div>
    </nav>

    <div class="container">
      <br />
      <router-view> </router-view>
      <!-- <footer class="footer">
        <p>&copy; Desarrollado por Syntech</p>
      </footer> -->
    </div>
    <FlashMessage></FlashMessage>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
export default {
  name: "App",
  components: {
    vueHeadful,
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
    cerrarSesion() {
      localStorage.clear();
      this.$router.push("/home");
      location.reload();
    },
  },
};
</script>
<style>
body {
  background-color: lightgrey;
  background-image: url(./assets/images/fondo-aflv.jpg);
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
@import "./assets/css/estilos.css";
</style>
