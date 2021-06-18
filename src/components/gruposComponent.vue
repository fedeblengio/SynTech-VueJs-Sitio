<template>
  <div class="grupoComonentMateria">
    <h2>Mis grupos</h2>
      <vue-headful :title="title" />
      <div class="contenedorMateria">
        <table class="tableClass">
          <tr v-for="todo in profesorGrupo" :key="todo.id" class="list-group-item" >
            <router-link
              :to="{
                name: 'clase-foro',
                params: {
                  idGrupo: todo.idGrupo,
                  materia: todo.Materia,
                  idMateria: todo.idMateria,
                },
              }"
              style="	text-decoration: none;">
              <td style='color:rgba(38, 87, 153);'>
                {{ todo.idGrupo }} {{ todo.anioElectivo }} - {{ todo.Materia }}
              </td>
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