<template>
  <div>
    <h1>Bienvenido {{ usuario.nombre }}</h1>
    <div class="container p-3 my-3">
      <vue-headful :title="title" />
    </div>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
export default {
  name: "HomeComponent",
  components: {
    vueHeadful,
  },
  data() {
    return {
      title: "Inicio",
      usuario: "",
    };
  },
  mounted() {
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
  },
};
</script>

