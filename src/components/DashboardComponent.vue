<template>
  <div class="estiloContenedor">
    <vue-headful :title="title" />
    <header style="z-index: ">
      <div class="contenedor">
        <a href="#" style="text-decoration: none"
          ><h1><i class="fas fa-books"></i> {{ language.lms }}</h1></a
        >
        <input type="checkbox" id="menu-barra" />
        <label class="icon-menu" for="menu-barra"></label>
        <nav class="menu">
          <a href="#">
            <i class="fa fa-home" aria-hidden="true"></i>
          </a>
          <a href="#noticias">
            <i class="fas fa-newspaper"></i>
          </a>
          <a v-on:click="cambiarValorLocalStorage()" href="/login">
            {{ language.iniciarSesion }}</a
          >
          <a href="#" class="events_icon">
            <i v-if="lang == 'es'" v-on:click="changeLanguage()"
              ><country-flag
                country="es"
                size="normal"
                style="margin-top: -8px"
            /></i>
            <i v-else v-on:click="changeLanguage()"
              ><country-flag
                country="gb"
                size="normal"
                style="margin-top: -8px"
            /></i>
          </a>
        </nav>
      </div>
    </header>
    <section>
      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_1_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>

          <div class="texo-articulo uno">
            <h2>{{ language.texto1 }}</h2>
            <p>
              {{ language.texto2 }}
            </p>
            <a
              v-on:click="cambiarValorLocalStorage()"
              href="/login"
              class="btn btn-warning"
              >{{ language.iniciarSesion }}</a
            >
          </div>
        </div>
      </div>

      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="texo-articulo dos">
            <h3 class="text-muted">{{ language.paraEducadores }}</h3>
            <h2>{{ language.texto3 }}</h2>
            <p>
              {{ language.texto4 }}
            </p>
          </div>
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_2_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>
        </div>
      </div>

      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_3_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>

          <div class="texo-articulo uno">
            <h3 class="text-muted">{{ language.paraEstudiantes }}</h3>
            <h2>{{ language.texto5 }}</h2>
            <p>
              {{ language.texto6 }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div id="noticias">
      <center>
        <h2>Noticias</h2>
      </center>
      <div>
        <div style="height: 30rem; background-color: lightgreen">
          <div class="contenedor_principal_noticias">
            <div
              class="accordion"
              id="accordionExample"
              v-for="noticia in todasNoticias"
              :key="noticia.data.id"
              style="width: 85%; margin: auto"
            >
              <div class="card">
                <div class="card-header" id="headingOne">
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
                          />
                        </div>
                        <div
                          style="
                            margin-left: 1rem;
                            display: flex;
                            flex-direction: column;
                          "
                        >
                          <p>{{ noticia.data.titulo }}</p>
                          <small>
                            Publicado por {{ noticia.data.nombreAutor }}</small
                          >
                        </div>
                        <small style="position: absolute; right: 0">{{
                          difforHumans(noticia.data.fecha)
                        }}</small>
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
                      <label style="display: flex; justify-content: center">
                        Archivos
                      </label>
                      <div
                        class="archivo"
                        v-for="archivo in noticia.archivos"
                        :key="archivo.id"
                      >
                        <span
                          style="cursor: pointer"
                          @click="descargarPDF(archivo)"
                        >
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
</template>

<script>
import vueHeadful from "vue-headful";
import language from "../assets/lang/dashboard.json";
import CountryFlag from "vue-country-flag";
import { Global } from "../Global";
import moment from 'moment'
import axios from "axios";
export default {
  name: "homeComponent",
  components: {
    vueHeadful,
    CountryFlag,
  },

  data() {
    return {
      title: "",
      lang: localStorage.getItem("lang"),
      language: "",
      todasNoticias: "",
    };
  },
  mounted() {
    this.selectLanguage();
  },
  methods: {
    difforHumans(fecha) {
      return moment(fecha).locale("es").fromNow();
    },
    changeLanguage() {
      if (this.lang == "es") {
        localStorage.setItem("lang", "en");
        location.reload();
      } else {
        localStorage.setItem("lang", "es");
        location.reload();
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
    cambiarValorLocalStorage() {
      localStorage.setItem("logged", true);
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    cargarListaCalificaciones() {
      axios.get(Global.urlSitio + "/noticias").then((res) => {
        if (res.status == 200) {
          this.noticias = res.data;
        }
      });
    },
  
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Ubuntu&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");

* {
  font-family: "Poppins", sans-serif;
}

section {
  width: 100%;
}

header .contenedor {
  display: table;
}

header {
  width: 100%;
  height: 50px;
  background: rgba(38, 87, 153);
  border-color: rgba(38, 87, 153);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

header label {
  float: right;
  font-size: 28px;
  margin: 6px 0;
  cursor: pointer;
  color: #fff;
}

.contenedor h1 {
  float: left;
  color: #fff;
}

.contenedor {
  width: 98%;
  margin: auto;
}
#menu-barra {
  display: none;
}
.menu {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: all 0.5s;
  transform: translateX(-100%);
}

.menu a {
  display: block;
  color: rgb(255, 255, 255);
  height: 50px;
  text-decoration: none;
  padding: 15px;
  border-bottom: 1px solid rgb(255, 255, 255);
  background: rgba(0, 0, 0, 0.89);
}
.menu a:hover {
  background: rgb(12, 99, 214);
}

#menu-barra:checked ~ .menu {
  transform: translateX(0%);
}

/******Foro******************************************************************/

.boton-foro:hover {
  background-color: rgba(32, 121, 32, 0.849);
}

.articulo-img img {
  width: 50%;
  display: block;
  margin: auto;
}
.fas {
  cursor: pointer;
  user-select: none;
}

.modeloContenedor {
  padding: 15px;
}

.modeloContenedor input {
  margin-top: 3px;
}

.customImput {
  width: 50%;
  justify-content: center;
  text-align: center;
  margin: auto;
}

.imputCss {
  margin-bottom: 10px;
}

.estiloContenedor {
  background-color: white;
  border-radius: 7px;
  margin: 56px 8px 0px 8px;
}

/******Home******************************************************************/

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.articulo-card {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-top: 30px;
  margin-bottom: 60px;
}

.texo-articulo {
  width: 500px;
  margin-top: 60px;
  justify-content: center;
  align-items: center;
}
.articulo-contenedor {
  justify-content: space-between;
  display: flex;
}

.texo-articulo a {
  text-decoration: none;
  color: black;
  width: auto;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffca28;
  font-size: 23px;
  cursor: pointer;
  border: 0px;
  border-radius: 7px;
}

.texo-articulo h2 {
  color: #1c1e27;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.texo-articulo h3 {
  margin-bottom: 20px;
  font-size: 22px;
}

.texo-articulo p {
  color: #1c1e27;
  font-size: 19px;
  font-weight: 200;
  line-height: 28px;
}

.dos {
  margin-left: 230px;
}
.uno {
  margin-right: 230px;
}
.articulo-img img {
  width: 80%;
}

/******RESOLUCION******************************************************************/

/*Menu**********************/
/*Escritorio*/

@media (min-width: 1024px) {
  .menu {
    position: static;
    width: auto;
    height: auto;
    transform: translateX(0%);
    float: right;
    display: flex;
  }

  header label {
    display: none;
  }
  .menu a {
    border: none;
    background: rgba(38, 87, 153);
    border-bottom: 3px solid #fff;
  }

  .contenedor {
    width: 1500px;
  }
}

/*Banner**********************/
/*Celular*/
@media (min-width: 480px) {
}
/*Tablet*/
@media (min-width: 768px) {
}
</style>