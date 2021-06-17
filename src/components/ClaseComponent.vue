<template>
  <div>
    <h1>Grupo {{ datos.idGrupo }} - {{ datos.materia }}</h1>
    <div class="container p-3 my-3 border">
      <vue-headful :title="title" />

      <ckeditor :editor="editor" v-model="editorData"></ckeditor>

      <input
        type="submit"
        value="Datos"
        class="btn btn-danger"
        v-on:click="enviarPost()"
      />

      <br>
    <br>
    <h1>Foro</h1>
    <br>
   <p>{{responseDatos}}</p> 
    </div>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "ClaseComponent.vue",

  components: {
    vueHeadful,
  },
  data() {
    return {
      title: "Clase",
      datos: {
        idMateria: "",
        materia: "",
        idGrupo: "",
        idUsuario: "",
      },
      responseDatos: "",
      editorData: "",
      editor: "",
      datosforo: "",
    };
  },
  mounted() {
    if (!localStorage.getItem("auth_token")) {
      this.$router.push("/home");
    }
    let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.datos.idUsuario = usuario.username;
    this.datos.idMateria = this.$route.params.idMateria;
    this.datos.materia = this.$route.params.materia;
    this.datos.idGrupo = this.$route.params.idGrupo;
    this.getDatos();
    this.traerDatosForo();
  },
  methods: {
    getDatos() {
      axios
        .get(
          Global.urlSitio +
            "profesor-foro?" +
            "idMateria=" +
            this.datos.idMateria +
            "&idGrupo=" +
            this.datos.idGrupo
        )
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.responseDatos = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    traerDatosForo() {
       alert("a")
      axios
        .get( Global.urlSitio + "foro-grupo?idForo="+ this.responseDatos.idForo)
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.datosforo = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    enviarPost() {
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let parametros = {
        idForo: this.responseDatos.idForo,
        idUsuario: this.responseDatos.idProfesor,
        mensaje: window.btoa(this.editorData),
      };

      axios
        .post(Global.urlSitio + "foro", parametros, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.flashMessage.show({
              status: "success",
              title: "Sitio",
              message: "Mensaje publicado",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.flashMessage.show({
            status: "error",
            title: "Sitio",
            message: "Error al publicar" + error,
          });
        });
    },
  },
};
</script>