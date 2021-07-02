<template>
  <div>
    <h1>Grupo {{ datos.idGrupo }} - {{ datos.materia }}</h1>

    <vue-headful :title="title" />

    <div>
      <h1>Foro</h1>
      <button
        v-if="!alumno"
        type="button"
        class="btn btn-primary boton-foro"
        data-toggle="modal"
        data-target=".bd-example-modal-lg"
      >
        Agregar Post
      </button>
      <div
        v-for="datos in datosForo"
        :key="datos.id"
        class="contenedorPrincipal"
      >
        <div class="contenedorForo">
          <i class="fal fa-plus" v-on:click="flechas(datos.id, datos.mensaje)">
            {{ datos.titulo }}
            <button
             v-if="datos.datos"
              class="float-right btn btn-outline-danger"
              style="font-size: 10px"
              v-on:click="descargarPDF(datos.datos)"
            >
              <i style="color: red" class="far fa-file-pdf"></i>
              {{ datos.datos }}
            </button>
          </i>
        </div>
        <div class="test contenedorResulado" v-bind:id="datos.id"></div>
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
      editorConfig: {
        toolbar: {
                      items: [
                        'heading','|',
                            'bold',
                            'italic',
                            'link','|',
                            'numberedList',
                            'bulletedList', '|',
                            'insertTable', '|',
                            'outdent', 'indent', '|',
                            'blockQuote','|',
                          
                            'undo',
                            'redo',
                        ],
        }
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
    getFile(event) {
      //Asignamos la imagen a  nuestra data
      this.file = event.target.files[0];
    },

    flechas(id, mensaje) {
      let $ = JQuery;
      let div2 = document.getElementById(id);

      if (div2.style.display === "none") {
        div2.style.display = "block";
        $(id).removeClass("fa-arrow-right").addClass("fa-arrow-down");
        div2.innerHTML = mensaje;
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
          "Content-Type": "multipart/form-data",
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
   
  descargarPDF (label) {
     let url = Global.urlSitio + "archivo?archivo=" + label;
    axios.get(url, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = label
        link.click()
        URL.revokeObjectURL(link.href)
      }).catch(console.error)
  }

        





   
  },
};
</script>