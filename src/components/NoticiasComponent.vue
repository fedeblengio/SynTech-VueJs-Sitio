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
                                @click="borrarNoticia(noticia.data)"
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
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
    borrarNoticia(noticia) {
      axios
        .delete(Global.urlSitio + "noticia", {
          headers: {
            "Content-Type": "application/json",
            token: Global.token,
          },
          data: {
            id: noticia.id,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire("Noticia Eliminada", "success");
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
      axios
        .get(Global.urlSitio + "noticia?idUsuario=" + this.usuario.username)
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
      let url = Global.urlSitio + "traerArchivo?archivo=" + label;

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
