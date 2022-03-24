<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
        <!--  <div class="moverBtnCrearTarea" > -->
        <button
          v-if="!alumno"
          type="button"
          class="btn_crearTarea"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Crear Tarea
        </button>
        <!--  </div> -->
      </div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto navbar-materias">
            <li class="nav-item">
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'materia-seleccionada',
                  params: {
                    idGrupo: this.$route.params.idGrupo,
                    idMateria: this.$route.params.idMateria,
                    materia: this.$route.params.materia,
                  },
                }"
                class="nav-link"
                >Inicio <span class="sr-only">(current)</span></router-link
              >
            </li>
            <li class="nav-item active">
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'listado-tareas',
                  params: {
                    materia: this.$route.params.materia,
                    idGrupo: this.$route.params.idGrupo,
                    idMateria: this.$route.params.idMateria,
                  },
                }"
                class="nav-link"
              >
                <span class="sr-only">(current)</span>
                Tareas
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Usuarios</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Documentos</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- --- INICIO MODAL --- -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Crear Tarea</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="styleTarea">
                <div class="text-right">
                  <small style="margin-right: 28px; font-size: 16px"
                    >Publicar para : {{ routerValues.idGrupo }}
                    {{ routerValues.materia }}
                  </small>
                </div>
                <div>
                  <label for="titulo" style="margin-left: 24px"
                    >Titulo :
                  </label>
                  <input
                    type="text"
                    v-model="tarea.titulo"
                    placeholder="Escribe una Titulo"
                    required
                  />
                </div>

                <div>
                  <label for="descripcion" style="margin-left: 24px"
                    >Descripcion :
                  </label>
                  <textarea
                    id="textarea"
                    placeholder="Escribe una Descripcion"
                    required
                    v-model="tarea.descripcion"
                  ></textarea>
                </div>
                <div>
                  <label for="datePicker" style="margin-left: 24px"
                    >Fecha de Vencimiento :
                  </label>
                  <input
                    type="date"
                    v-model="tarea.fecha_vencimiento"
                    required
                  />
                </div>

                <div>
                  <div
                    class="preview_contenedor"
                    v-for="file in tarea.file"
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
                </div>
                <div class="footer_tarea">
                  <div class="image-upload">
                    <label for="file-input">
                      <i class="fas fa-upload"></i>
                    </label>
                    <input
                      @change="getFile"
                      id="file-input"
                      type="file"
                      v-on:onchange="previewFile(this)"
                      style="display: none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="boxText_btn_tarea" v-on:click="crearTarea()">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- --- FIN MODAL --- -->
      <div class="div" v-if="loading">
        <center>
          <img :src="spinner" class="spinnerCSS" />
        </center>
      </div>
      <div class="list-group" v-else>
        <div
          class="list-group-item list-group-item-action"
          aria-current="true"
          v-for="tarea in listadoTareas"
          :key="tarea.id"
        >
          <button
            type="button"
            class="boxText_btn"
            v-on:click="borrarPublicacion(tarea.idTarea)"
          >
            Borrar
          </button>
          <router-link
            :to="{
              name: 'entregas',
              params: {
                idGrupo: tarea.idGrupo,
                idMateria: tarea.idMateria,
                idTareas: tarea.idTarea,
              },
            }"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tarea.titulo }} {{ tarea.idTarea }}</h5>
              <small class="text-muted"
                >Vence: {{ moment(tarea.fecha_vencimiento) }}</small
              >
            </div>
            <p class="mb-1">{{ tarea.descripcion }}</p>
            <small class="text-muted">
              <b>Haga click para visualizar las entregas</b></small
            >
          </router-link>
        </div>
      </div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
window.$ = JQuery;
export default {
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tareas",
      loading: true,
      spinner: Global.spinnerUrl,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listadoTareas: "",
      routerValues: {
        idGrupo: "",
        idMateria: "",
        materia: "",
      },
      alumno: false,
      tarea: {
        titulo: "",
        descripcion: "",
        fecha_vencimiento: "",
        materiaGrupo: [],
        file: [],
      },
    };
  },
  mounted() {
    this.routerValues.idGrupo = this.$route.params.idGrupo;
    this.routerValues.idMateria = this.$route.params.idMateria;
    this.routerValues.materia = this.$route.params.materia;
    this.cargarTareasCreadas();
  },
  methods: {
    borrarPublicacion(idTarea) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .delete(Global.urlSitio + "tarea?idTareas=" + idTarea, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
          }
        })
        .catch(() => {});
    },
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY h:mm a");
    },
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.alumno = false;
      } else {
        this.alumno = true;
      }
    },
    delateFile(nombre) {
      let i;

      for (i = 0; i < this.tarea.file.length; i++) {
        if (this.tarea.file[i].name === nombre) {
          this.tarea.file.splice(i, 1);
        }
      }
    },
    crearTarea() {
      var hoy = new Date();
      var fecha =
        hoy.getDate() +
        hoy.getMonth() +
        hoy.getFullYear() +
        hoy.getHours() +
        hoy.getMinutes() +
        hoy.getSeconds() +
        "_";

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      let nombres = [];
      for (let i = 0; i < this.tarea.file.length; i++) {
        nombres.push(fecha + this.tarea.file[i].name);
        let formData = new FormData();

        formData.append("archivo", this.tarea.file[i]);
        formData.append("nombre", fecha + this.tarea.file[i].name);

        axios
          .post(Global.urlSitio + "FTP", formData, config)
          .then((response) => {
            if (response.status == 200) {
              location.reload();
            }
          })
          .catch(() => {});
      }
      this.enviarCuerpoTarea(nombres);
    },
    enviarCuerpoTarea(nombres) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();

      formData.append("titulo", this.tarea.titulo);
      formData.append("descripcion", this.tarea.descripcion);
      formData.append("fechaVencimiento", this.tarea.fecha_vencimiento);
      formData.append("idMateria", this.routerValues.idMateria);
      formData.append("idGrupo", this.routerValues.idGrupo);
      formData.append("nombreArchivos", nombres);
      formData.append("idUsuario", this.usuario.username);
      formData.append("ou", this.usuario.ou);

      axios
        .post(Global.urlSitio + "tarea", formData, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Tarea publicado correctamente",
            });
          }
        })
        .catch(() => {
          this.flashMessage.show({
            status: "error",
            title: Global.tituloSitio,
            message: "Error al publicar la tarea",
          });
        });
    },

    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.tarea.file.length <= 4) {
        if (res <= 50) {
          this.tarea.file.push(event.target.files[0]);
        } else {
          alert("El tamaño del archivo excede el límite máximo permitido");
        }
      } else {
        alert("5 archivos por post");
      }
    },

    cargarTareasCreadas() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "tareas?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou +
            "&idMateria=" +
            this.routerValues.idMateria +
            "&idGrupo=" +
            this.routerValues.idGrupo,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listadoTareas = res.data;
          }
          this.loading = false;
        });
    },
  },
};
</script>