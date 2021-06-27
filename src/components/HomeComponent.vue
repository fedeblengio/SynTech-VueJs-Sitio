<template>
  <div>
   
    <div class="container p-3 my-3">
      <vue-headful :title="title" />
       <div class="fffffffffffff">
        <materias v-if="usuario.ou === 'Alumno'"></materias>
        <grupos v-else></grupos>
      </div>
    </div>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
import materias from "./MateriasAlumnoComponent.vue";
import grupos from "./gruposComponent.vue";
export default {
  name: "HomeComponent",
  components: {
    vueHeadful,
    materias,
    grupos,
  },
  data() {
    return {
      title: "Inicio",
      usuario: "",
    };
  },
  mounted() {
     if (!localStorage.getItem("auth_token")) {
      this.$router.push("/login");
      this.flashMessage.show({
            status: "error",
            title: "Sitio",
            message: "Error , debes iniciar sesión",
          });
     }
   this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
  },
};
</script>

