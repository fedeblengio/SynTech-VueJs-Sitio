<template>
<div>
  <vue-headful :title="title" />
  <h1>Página Home</h1>
  <div class="container p-3 my-3 border">
    <h2>Hola {{ nombre }}</h2>
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
      title: "Home",
      nombre: "",
    };
  },

  mounted() {
   /*  if (localStorage.getItem("auth_ou") != "Profesores") {      
     this.$router.push("/login");
    }  */

  this.nombre = localStorage.getItem("auth_nombre");

  },
 
};
</script>

