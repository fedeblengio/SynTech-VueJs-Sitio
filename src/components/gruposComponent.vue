<template>
  <div class="grupoComonentMateria">
    <h1>Mis Cursos</h1>
    <vue-headful :title="title" />
    <div
      class="contenedorMateria"
      style="display: flex; flex-wrap: wrap; justify-content: center"
    >
      <div
        class="card"
        style="
          width: 18rem;
          margin: 15px;
          border-radius: 10px;
          box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
            rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
        "
        v-for="todo in profesorGrupo"
        :key="todo.id"
      >
        <img
          class="card-img-top"
          src="../assets/images/grupos-image.jpg"
          alt="Card image cap"
        />
        <hr />
        <div class="card-body">
          <h5 class="card-title">
            {{ todo.idGrupo }} {{ todo.anioElectivo }} - {{ todo.Materia }}
          </h5>
          <router-link
            class="btn btn-primary"
            :to="{
              name: 'clase-foro',
              params: {
                idGrupo: todo.idGrupo,
                materia: todo.Materia,
                idMateria: todo.idMateria,
              },
            }"
            style="text-decoration: none"
          >
            Ir Foro
          </router-link>
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
        let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
        };
      axios
        .get(
          Global.urlSitio + "profesor-grupo?idProfesor=" + this.usuario.username,config
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