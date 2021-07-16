<template>
  <div>
    <vue-headful :title="title" />

    <header style="z-index: ">
      <div class="contenedor">
        <a :href="url" style="text-decoration: none"
          ><h1><i class="fas fa-books"></i> LMS</h1></a
        >
        <input type="checkbox" id="menu-barra" />
        <label class="icon-menu" for="menu-barra"></label>
        <nav class="menu">
          <a :href="url">
            <i class="fa fa-home" aria-hidden="true"></i>
          </a>
          <a href="/miPerfil" v-if="logged"
            ><i class="fas fa-user"></i> {{ usuario.nombre }}</a
          >

          <a href="/login" v-else> Login</a>
          <a href="" v-on:click="cerrarSesion()" v-if="logged"
            ><i class="fal fa-sign-out-alt"></i
          ></a>
        </nav>
      </div>
    </header>

    <div class="ContenedorAppVue">
      <div>
        <router-view> </router-view>
      </div>
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
      url: "/home",
    };
  },
  mounted() {
    this.verificarLogueo();
  },
  methods: {
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;
        this.url = "/misMaterias";
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
@import "./assets/css/app.css";
@import "./assets/css/iconos.css";
</style>
