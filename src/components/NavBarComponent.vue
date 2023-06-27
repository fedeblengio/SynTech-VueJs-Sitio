<template>
  <nav
    class="navbar navbar-expand-lg navbar-light"
    style="width: 75% !important; margin: auto"
  >
    <a class="navbar-brand" href="#"
      ><img
        src="../assets/images/LogoFinal.png"
        alt="Logo"
        width="60px"
        height="50px"
    /></a>
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
        <li class="nav-item active">
          <router-link to="/home" class="router-link nav-link">
            <span>{{ language.inicio }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/materias" class="router-link nav-link">
            <span>{{ language.materias }}</span>
          </router-link>
        </li>
        <li class="nav-item"  v-if="profesor">
          <router-link
            to="/agenda-virtual"
            class="router-link nav-link"
          >
            <span>{{ language.agendaVirtual }}</span>
          </router-link>
        </li>
        <li class="nav-item" v-else>
          <router-link to="/calificaciones" class="router-link nav-link">
            <span>{{ language.calificaciones }}</span>
          </router-link>
        </li>

        <li class="nav-item">
             <router-link to="/calendario" class="router-link nav-link">
          <span>{{ language.calendario }}</span>
        </router-link>
        </li>
          <li class="nav-item">
         <router-link to="/noticias" class="router-link nav-link">
          <span>{{ language.noticias }}</span>
        </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import language from "../assets/lang/sectionLeft.json";
export default {
  name: "SectionLeft",
  components: {},
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      loading: true,
      lang: localStorage.getItem("lang"),
      language: "",
      profesor: false,
      changeGroup: false,
      localStorageGroup: localStorage.getItem("idGrupo"),
    };
  },
  mounted() {
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
    }

    this.selectLanguage();
  },
  methods: {
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
</style>