<template>
  <div>


    <vue-headful :title="title" />

    <div class="grupoComonentMateria">
      <h2>Tus Materias</h2>
      <table class="tableClass">
        <tr v-for="todo in alumnoGrupo" :key="todo.id" class="list-group-item">
          <router-link
            :to="{
              name: 'clase-foro',
              params: {
                idGrupo: todo.idGrupo,
                materia: todo.nombre,
                idMateria: todo.idMateria,
              },
            }"
          style="	text-decoration: none;" >
            <td style='color:black;'>{{ todo.nombre }}</td>
          </router-link>
        </tr>
      </table>
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
        .get(Global.urlSitio + "alumno?idAlumno=" + this.usuario.username)
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