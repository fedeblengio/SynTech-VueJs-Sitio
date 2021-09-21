<template>
  <div>
    <vue-headful :title="title" />

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
