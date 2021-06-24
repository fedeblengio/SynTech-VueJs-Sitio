<template>
  <div>
    <button
      v-if="!alumno"
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target=".bd-example-modal-lg"
    >
      Agregar Post
    </button>

    <h1>Grupo {{ datos.idGrupo }} - {{ datos.materia }}</h1>
    <div class="container p-3 my-3 border">
      <vue-headful :title="title" />

      <div>
        <h1>Foro</h1>
        <div v-for="datos in datosForo" :key="datos.id">
          <div class="contenedorForo">
            <i
              class="fas fa-arrow-right"
              v-on:click="flechas(datos.id, datos.mensaje)"
            >
            </i>
            {{ datos.titulo }}
          </div>
          <div class="contenedorForo div" v-bind:id="datos.id"></div>
        </div>
      </div>

      <div
        class="modal fade bd-example-modal-lg"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modeloContenedor">
              <h2>Nuevo Post</h2>
              <hr />
              <div>
                <p>Titulo:</p>
                <input
                  type="text"
                  class="form-control imputCss"
                  v-model="nuevoPost.titulo"
                />
              </div>

              <div class="customImput input-group mb-3">
                <div class="custom-file">
                
                </div>
              </div>

              <ckeditor
                :editor="editor"
                v-model="nuevoPost.ckeditor"
              ></ckeditor>

              <input
                type="submit"
                value="Datos"
                class="btn btn-primary"
                v-on:click="enviarPost()"
              />
            </div>
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
import JQuery from "jquery";

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
      nuevoPost: {
        ckeditor: "",
        titulo: "",
        archivo: null,
      },
      editor: "",
      datosForo: "",
      alumno: false,
    };
  },
  mounted() {
    if (!localStorage.getItem("auth_token")) {
      this.$router.push("/home");
    }
    this.guardarRutas();
    this.getDatos();
  },

  methods: {
    flechas(id, mensaje) {
      let $ = JQuery;
      let div2 = document.getElementById(id);
      let mensaje2 = window.atob(mensaje);

      if (div2.style.display === "none") {
        div2.style.display = "block";
        $(id).removeClass("fa-arrow-right").addClass("fa-arrow-down");
        div2.innerHTML = mensaje2;
      } else {
        div2.style.display = "none";
        $(id).removeClass("fa-arrow-down").addClass("fa-arrow-right");
      }
    },

    guardarRutas() {
      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
      if (usuario.ou === "Alumno") {
        this.alumno = true;
      }
      this.datos.idUsuario = usuario.username;
      this.datos.idMateria = this.$route.params.idMateria;
      this.datos.materia = this.$route.params.materia;
      this.datos.idGrupo = this.$route.params.idGrupo;
    },

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
          if (res.status == 200) {
            this.responseDatos = res.data;
            this.traerDatosForo(this.responseDatos.idForo);
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    traerDatosForo(idForo) {
      axios.get(Global.urlSitio + "foro-grupo?idForo=" + idForo).then((res) => {
        if (res.status == 200) {
          this.datosForo = res.data;
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
        mensaje: window.btoa(this.nuevoPost.ckeditor),
        archivo: this.nuevoPost.archivo,
        titulo: this.nuevoPost.titulo,
      };
      console.log(parametros.archivo);
      alert("gggg");
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