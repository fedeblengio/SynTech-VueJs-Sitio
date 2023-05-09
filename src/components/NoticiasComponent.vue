<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed" v-if="loading">
      <div class="feed_header linea_border_bottom">
        <h2 style="margin-bottom: 2rem">{{ language.noticias }}</h2>
      </div>
      <div class="spinerCont">
        <img :src="spinner" class="spinnerCSS" />
      </div>
    </div>
    <div class="feed" v-else>
      <div class="feed_header linea_border_bottom">
        <h2 style="margin-bottom: 2rem">{{ language.noticias }}</h2>
      </div>
        <div
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
        v-if="camposVacios"
      >
        {{ language.inputVacio1 }}
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
          v-on:click="camposVacios = false"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

    <div class="boxText">
        <div class="form">
          <div class="boxText_input">
            <img :src="returnImgB64()" />
            <textarea
              id="textarea"
              :placeholder="language.escribeAlgo"
              required
              v-model="mensaje"
              maxlength="250"
            ></textarea>
            <span class="float-right mt-2 text-muted ml-3 mr-2">
              {{ mensaje.length }} / 250</span
            >
          </div>
       
          <div
            class="preview_contenedor"
            v-for="file in file"
            :key="file.id"
            :value="file.name"
          >
            <i class="fal fa-file-alt file"></i>

            <h3 class="preview">
              {{ file.name }}
            </h3>
            <i
              class="fas fa-times equis"
              v-on:click="delateFile(file.name)"
            ></i>
          </div>
          <div class="footer_post">
            <div class="select_file">
              <div
                class="form-check form-switch"
                v-if="usuario.ou == 'Profesor'"
              >
            
              </div>
              <div class="image-upload">
                <label for="file-input">
                  <i class="fas fa-upload"></i>
                </label>

                <input
                  @change="getFile"
                  id="file-input"
                  type="file"
                  accept=".jpg, .png, .jpeg,.pdf"
                  v-on:onchange="previewFile(this)"
                  style="display: none"
                />
              </div>
            </div>
            <button
              class="boxText_btn"
              style="background-color: grey"
              v-if="loading"
            >
              {{ language.enviar }}
            </button>
            <button v-else class="boxText_btn" v-on:click="enviarArchivos()">
              {{ language.enviar }}
            </button>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center">
        <div>
          <div style="max-height: 850px; overflow-y: auto">
            <div class="contenedor_principal_noticias">
              <div
                class="accordion"
                id="accordionExample"
                v-for="noticia in todasNoticias"
                :key="noticia.data.id"
                style="margin: auto"
              >
                <div class="card" style="padding: 0.5rem 1rem">
                  <div class="" id="headingOne">
                    <h2 class="mb-0">
                      <button
                        class="btnCustom btn-block text-left atr"
                        type="button"
                        data-toggle="collapse"
                        :data-target="'#col' + noticia.data.id"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <div
                          style="
                            display: flex;
                            flex-direction: row;
                            position: relative;
                          "
                        >
                          <div>
                            <img
                              :src="returnIMGB64(noticia.data.imagenEncabezado)"
                              alt=""
                              width="100px"
                              height="86px"
                              style="object-fit: cover"
                            />
                          </div>
                          <div
                            style="
                              margin-left: 1rem;
                              display: flex;
                              flex-direction: column;
                            "
                          >
                            <div style="display: flex; flex-direction: row">
                              <p>{{ noticia.data.titulo }}</p>
                              <i
                                class="fas fa-times"
                                style="
                                  margin-left: auto;

                                  color: red;
                                "
                                @click="comprobarOpcionEliminar(noticia.data)"
                              ></i>
                            </div>

                            <small style="margin-top: 24px">
                              {{ language.publicadoPor }}
                              {{ noticia.data.nombreAutor }}</small
                            >
                          </div>
                          <small
                            style="
                              position: absolute;
                              right: 0;
                              bottom: 0;
                              display: flex;
                              flex-direction: column;
                              align-items: end;
                            "
                          >
                            {{ difforHumans(noticia.data.fecha) }}
                          </small>
                        </div>
                      </button>
                    </h2>
                  </div>

                  <div
                    :id="'col' + noticia.data.id"
                    class="collapse"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div class="card-body" style="padding: 10px">
                      <p>{{ noticia.data.mensaje }}</p>
                      <div v-if="noticia.archivos != ''">
                        <hr />
                        <div style="display: flex">
                          <div
                            class="archivo eplipis"
                            v-for="archivo in noticia.archivos"
                            :key="archivo.id"
                          >
                            <span
                              style="cursor: pointer"
                              @click="descargarPDF(archivo)"
                            >
                              <img
                                src="../assets/images/file.svg"
                                alt="My Happy SVG"
                              />
                              {{ simplificarNombre(archivo) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import moment from "moment";
import axios from "axios";
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import language from "../assets/lang/dashboard.json";

window.$ = JQuery;
export default {
  name: "ProfileComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "",
      usuarioPerfil: "",
      nombreGrupo: "",
      loading: true,
      spinner: Global.spinnerUrl,
      profesor: false,
      lang: localStorage.getItem("lang"),
      language: "",
      todasNoticias: "",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      camposVacios: false,
       file: [],
      mensaje: "",
    };
  },
  mounted() {
    if (this.usuario.ou != "Profesor") {
      this.$router.push("home");
    }
    this.selectLanguage();
    this.cargarNoticias();
  },
  methods: {
       comprobarCamposVacios(input1) {
        return input1.length == 0;
    },
     getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.file.length <= 2) {
        if (res <= 50) {
          this.file.push(event.target.files[0]);
        } else {
          this.$swal.fire(this.language.archivoMayor50, "", "info");
        }
      } else {
        this.$swal.fire(this.language.maximo3Archivos, "", "info");
      }
    },
       publicarNoticia() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      let formData = new FormData();
      formData.append("idUsuario", this.usuario.username);
      formData.append(
        "titulo",
        "Profesor " + this.usuario.nombre + this.language.usernamePublico
      );
      formData.append("mensaje", this.mensaje);

      for (let archivo of this.file) {
        formData.append("archivos[]", archivo);
      }
      for (let archivo of this.file) {
        formData.append("nombresArchivo[]", archivo.name);
      }

      axios
        .post(Global.urlSitio + "noticia", formData, config)
        .then((res) => {
          if (res.status == 200) {
            this.$swal.fire({
              icon: "success",
              title: this.language.NoticiaPublicada,
            });
            this.mensaje = "";
            this.file = [];
            this.cargarNoticias();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.error,
          });
        });
    },
     returnImgB64() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
       enviarArchivos() {
      this.camposVacios = this.comprobarCamposVacios(
        this.mensaje
      );
      if (!this.camposVacios) {
        this.$swal.fire({
          title: this.language.enviando,
          html: this.language.enviandoTuPublicacion,
          allowOutsideClick: false,
          timerProgressBar: true,
          allowEscapeKey: false,
          didOpen: () => {
            this.$swal.showLoading();
              this.publicarNoticia();
          },
          willClose: () => {
            clearInterval(5);
          },
        });
      }
    },
    comprobarOpcionEliminar(id) {
      this.$swal
        .fire({
          title: this.language.confirmacionEliminar,
          showDenyButton: true,
          confirmButtonText: this.language.eliminar,
          denyButtonText: this.language.cancelar,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.borrarNoticia(id);
          }
        });
    },

    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
    borrarNoticia(noticia) {
         let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      axios
        .delete(Global.urlSitio + "noticia/"+noticia.id,config
        )
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire({
              icon: "success",
              title: this.language.confimacionTitulo,
              showConfirmButton: false,
              timer: 1500,
            });
            this.cargarNoticias();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Algo salio mal",
          });
        });
    },
    cargarNoticias() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      axios
        .get(Global.urlSitio + "noticia?idUsuario=" + this.usuario.username,config)
        .then((res) => {
          if (res.status == 200) {
            this.todasNoticias = res.data;
            this.loading = false;
          }
        });
    },
    difforHumans(fecha) {
      return moment(fecha).locale(this.lang).fromNow();
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    descargarPDF(label) {
         let url = Global.urlSitio + "archivo/" + label;

      axios
        .get(url, {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
            token: Global.token,
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = this.simplificarNombre(label);
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },

     delateFile(nombre) {
      let i;

      for (i = 0; i < this.file.length; i++) {
        if (this.file[i].name === nombre) {
          this.file.splice(i, 1);
        }
      }
    },
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },
  },
};
</script>
