<template>
  <div>
    <h1>Mi Perfil</h1>
     <button class="btn btn-danger" v-on:click="cerrarSesion()">Cerrar Sesion</button>
    <div class="container p-3 my-3 border">
      <vue-headful :title="title" />

      <p class="form-control"><b> Username :</b> {{ usuarioDatos.username }}</p>
      <p class="form-control"><b>Nombre :</b> {{ usuarioDatos.nombre }}</p>
      <p class="form-control"><b> Email : </b>{{ usuarioDatos.email }}</p>
      <p class="form-control">
        <b> Unidad Organizativa : </b>{{ usuarioDatos.ou }}
      </p>
    </div>
   
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "miPerfilComponent",
  components: {
    vueHeadful,
    
  },
  data() {
    return {
      title: "Mi Perfil",
      usuarioDatos: "",
    };
  },
  mounted() {
    if (!localStorage.getItem("auth_token")) {
      this.$router.push("/home");
    } else {
      this.cargarUsuarioData();
    }
  },

  methods: {
    cargarUsuarioData() {
      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));

      axios
        .get(Global.urlBackOffice + "usuario?username=" + usuario.username)
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.usuarioDatos = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
      cerrarSesion() {
      localStorage.clear();
      this.$router.push("/login");
      location.reload();
    },
  },
};
</script>