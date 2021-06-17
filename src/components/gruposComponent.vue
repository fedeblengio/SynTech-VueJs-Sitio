<template>
  <div>
    <h1>Mis grupos</h1>

    <div class="container p-3 my-3">
      <vue-headful :title="title" />


      <div style="display:flex;flex-wrap: wrap;justify-content:center">
        <div class="carta-grupos card" v-for="todo in profesorGrupo" :key="todo.id">
          <img  src="../assets/images/grupos-image.jpg" style="border-top-right-radius:15px;border-top-left-radius:15px;" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">{{ todo.idGrupo }} {{ todo.anioElectivo }}  - {{ todo.Materia }}</h5>
            <p class="card-text">
              Profesor: {{ todo.Profesor }}
              Informacion : {{ todo.nombreCompleto }} 
            </p>
            <router-link class="btn btn-primary"  :to="{
                name: 'clase-foro',
                params: { idGrupo: todo.idGrupo, materia: todo.Materia , idMateria: todo.idMateria},
              }">
              Entrar
            </router-link>
           
          </div>
        </div>

        
    </div>
    </div>
  </div>


  
</template>

<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "HomeComponent",
  components: {
    vueHeadful,
  },
  data() {
    return {
      title: "Mis Grupos",
      usuario: "",
      editorData: "",
      profesorGrupo: "",
    };
  },
  mounted() {
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.getDatos();
  },
  methods: {
    getDatos() {
      axios
        .get(
          Global.urlSitio + "profesor-grupo?idProfesor=" + this.usuario.username
        )
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.profesorGrupo = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
  },
};
</script>