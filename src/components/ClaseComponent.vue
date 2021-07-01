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
          <i
            class="fal fa-plus"
            v-on:click="flechas(datos.id, datos.mensaje)"
          >
            {{ datos.titulo }}
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
                  id="mensaje"
                  :editor="editor"
                  v-model="nuevoPost.ckeditor"
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
      file: null,
      responseDatos: "",
      nuevoPost: {
        ckeditor: "",
        titulo: "",
        archivo: null,
      },
      editor: "",
      datosForo: "",
      alumno: false,
      keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
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
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = this._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output =
          output +
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          this.keyStr.charAt(enc3) +
          this.keyStr.charAt(enc4);
      }

      return output;
    },

    _utf8_encode: function (string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },

    getFile(event) {
      //Asignamos la imagen a  nuestra data
      this.file = event.target.files[0];
    },

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
          "Content-Type": "multipart/form-data",
        },
      };

      let formData = new FormData();
      formData.append("archivo", this.file);
      formData.append("idForo", this.responseDatos.idForo);
      formData.append("idUsuario", this.responseDatos.idProfesor);
      formData.append("mensaje", window.btoa(this.nuevoPost.ckeditor));
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
  },
};
</script>