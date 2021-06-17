<template>
  <div>
    <h1>Materias</h1>

    <div class="container p-3 my-3">
      <vue-headful :title="title" />


      <div style="display:flex;flex-wrap: wrap;justify-content:center">
        <div class="carta-grupos card" v-for="todo in alumnoGrupo" :key="todo.id">
          <img  src="../assets/images/grupos-image.jpg" style="border-top-right-radius:15px;border-top-left-radius:15px;" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">{{ todo.nombre }} - {{ todo.idGrupo }} </h5>
            <p class="card-text">
              Profesor: 
              Informacion :
            </p>
          <router-link class="btn btn-primary"  :to="{
                name: 'clase-foro',
                params: { idGrupo: todo.idGrupo, materia: todo.nombre , idMateria: todo.idMateria},
              }">
              Entrar a Foro
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
      title: "Mis Materias",
      usuario: "",
      alumnoGrupo: "",
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
          Global.urlSitio + "alumno?idAlumno=" + this.usuario.username
        )
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.alumnoGrupo = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    
  },
};
</script>