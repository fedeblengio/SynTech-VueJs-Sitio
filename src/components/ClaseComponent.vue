<template>
  <div style="background-color: whitesmoke; border-radius: 20px">
    <h1>Grupo {{ datos.idGrupo }} - {{ datos.materia }}</h1>

    <vue-headful :title="title" />

    <div>
      <h1>Foro</h1>
      <div class="ContenedorSup" style="padding: 15px" v-if="hayPost">
        <div class="info" style="width: 30%">
          <button
            v-if="!alumno"
            type="button"
            class="btn btn-success boton-foro btn-block"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
          >
            Agregar Post
          </button>
        </div>
        <div class="cont" style="padding: 30px; width: 70%">
          <h2>Realiza una publicación</h2>
          <img src="../assets/images/newpost.png" alt="" />
        </div>
      </div>
      <div class="ContenedorSup" style="padding: 15px" v-else>
        <div class="info" style="width: 30%">
          <button
            v-if="!alumno"
            type="button"
            class="btn btn-success boton-foro btn-block"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
          >
            Agregar Post
          </button>
          <button
            v-if="!alumno"
            type="button"
            class="btn btn-danger btn-block"
            v-on:click="toggle_eliminar()"
          >
            Eliminar Post
          </button>
          <div
            v-for="dato in datosForo"
            :key="dato.id"
            class="list-group"
            style="color: black"
          >
            <a
              class="list-group-item list-group-item-action"
              v-on:click="traderDatosForo(dato.id)"
            >
              {{ dato.titulo }}
              <i
                class="fas fa-times float-right"
                v-on:click="eliminarPost(dato.id)"
                style="color: red; font-size: 22px;"
                v-if="toggle"
              ></i>
            </a>
          </div>
        </div>
        <div class="cont" style="padding: 30px; width: 70%">
          <h2 style="margin-bottom: 4rem">{{ tituloPost }}</h2>
          <div id="datos"></div>
          <hr v-if="nombreArchivo" />
          <div id="archivo">
            <h2 v-if="nombreArchivo">Documentos:</h2>

            <button
              v-if="nombreArchivo"
              class="btn btn-outline-danger"
              style="font-size: 10px"
              v-on:click="descargarPDF(nombreArchivo)"
            >
              <i style="color: red" class="far fa-file-pdf"></i>
              {{ nombreArchivo }}
            </button>
          </div>
        </div>
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
          <hr />
          <h2>Nuevo Post</h2>

          <div class="modeloContenedor">
            <div class="mb-3 mt-1 row">
              <label for="titulo" class="col-sm-2 col-form-label"
                >Titulo:</label
              >
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  v-model="nuevoPost.titulo"
                  id="titulo"
                />
              </div>
            </div>

            <div class="mb-3 row">
              <label for="inputFile" class="col-sm-2 col-form-label"
                >Archivo:</label
              >
              <div class="col-sm-10">
                <input
                  @change="getFile"
                  type="file"
                  class="form-control-file"
                  id="file"
                  accept=".pdf"
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="mensaje" class="col-sm-2 col-form-label"
                >Mensaje:</label
              >
              <div class="col-sm-10">
                <ckeditor
                  :editor="editor"
                  v-model="nuevoPost.ckeditor"
                  :config="editorConfig"
                  id="mensaje"
                ></ckeditor>
              </div>
            </div>
            <hr />
            <input
              type="submit"
              value="Publicar Post"
              class="btn btn-secondary btn btn-block"
              v-on:click="enviarPost()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
      editorConfig: {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "|",
            "numberedList",
            "bulletedList",
            "|",
            "insertTable",
            "|",
            "outdent",
            "indent",
            "|",
            "blockQuote",
            "|",

            "undo",
            "redo",
          ],
        },
      },
      file: null,
      responseDatos: "",
      nuevoPost: {
        ckeditor: "",
        titulo: "",
        archivo: null,
      },
      editor: ClassicEditor,
      datosForo: "",
      alumno: false,
      nombreArchivo: "",
      tituloPost: "",
      hayPost: false,
      toggle: false,
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
    toggle_eliminar() {
    

      if (this.toggle) {
        this.toggle = false;
      } else {
        this.toggle = true;
      }
    },
    eliminarPost(id) {
      console.log(id + " id post");

      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .delete(Global.urlSitio + "foro?" + "idDatos=" + id, config)
        .then((res) => {
          if (res.status == 200) {
            this.flashMessage.show({
              status: "success",
              title: "Sitio",
              message: "El post se ha elminiado correctamente",
            });
            location.reload();
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    getFile(event) {
      //Asignamos la imagen a  nuestra data
      this.file = event.target.files[0];
    },

    traderDatosForo(id) {
      let dato = document.getElementById("datos");

      for (let i in this.datosForo) {
        if (this.datosForo[i].id === id) {
          dato.innerHTML = this.datosForo[i].mensaje;
          this.nombreArchivo = this.datosForo[i].datos;
          this.tituloPost = this.datosForo[i].titulo;
        }
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
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "profesor-foro?" +
            "idMateria=" +
            this.datos.idMateria +
            "&idGrupo=" +
            this.datos.idGrupo,
          config
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
          if (res.data.length === 0) {
            this.hayPost = true;
          }
        } else {
          alert("no se pudo conectar");
        }
      });
    },
    enviarPost() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: "Global.token",
        },
      };

      let formData = new FormData();
      formData.append("archivo", this.file);
      formData.append("idForo", this.responseDatos.idForo);
      formData.append("idUsuario", this.responseDatos.idProfesor);
      formData.append("mensaje", this.nuevoPost.ckeditor);
      formData.append("titulo", this.nuevoPost.titulo);

      axios
        .post(Global.urlSitio + "foro", formData, config)
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

    descargarPDF(label) {
      let url = Global.urlSitio + "archivo?archivo=" + label;
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = label;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
  },
};
</script>