<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
        <!--  <div class="moverBtnCrearTarea" > -->
        <button
          v-if="usuario.ou == 'Profesor' && !this.$route.params.tareas_vencidas"
          type="button"
          class="btn_crearTarea"
          data-toggle="modal"
          data-target="#modalTarea"
        >
          Crear Tarea
        </button>
        <!--  </div> -->
      </div>
      <ul class="nav nav-tabs justify-content-center">
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
            >Inicio</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            style="text-decoration: none"
            :to="{
              name: 'listado-usuarios',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
              },
            }"
            class="nav-link"
          >
            Miembros
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="!this.$route.params.tareas_vencidas"
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: false,
              },
            }"
            class="nav-link active"
          >
            Tareas
          </router-link>
          <router-link
            v-else
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: false,
              },
            }"
            class="nav-link"
          >
            Tareas
          </router-link>
        </li>
        <li class="nav-item" v-if="usuario.ou == 'Profesor'">
          <router-link
            v-if="this.$route.params.tareas_vencidas"
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas-vencidas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: true,
              },
            }"
            class="nav-link active"
          >
            Registro
          </router-link>

          <router-link
            v-else
            style="text-decoration: none"
            :to="{
              name: 'listado-tareas-vencidas',
              params: {
                materia: this.$route.params.materia,
                idGrupo: this.$route.params.idGrupo,
                idMateria: this.$route.params.idMateria,
                tareas_vencidas: true,
              },
            }"
            class="nav-link"
          >
            Registro
          </router-link>
        </li>
      </ul>

      <!-- --- INICIO MODAL --- -->
      <div
        class="modal fade"
        id="modalTarea"
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

      <!-- MODAL VER TAREA -->

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
              <h5 class="modal-title" id="exampleModalLabel">
                Tarea Publicada
              </h5>
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
              <div class="spinerCont" v-if="cargandoFoto">
                <img :src="spinner" class="spinnerCSS" />
              </div>
              <div class="post" v-else>
                <div class="post_avatar">
                  <img
                    :src="returnIMGB64(tareaSeleccionada.profile_picture)"
                    alt=""
                  />
                </div>
                <div class="post_body" style="width: 375px !important">
                  <div class="post_title">
                    <span> {{ tareaSeleccionada.titulo }} </span>
                    <p>{{ tareaSeleccionada.fechaVencimiento }}</p>
                  </div>
                  <div class="post_body_text">
                    {{ tareaSeleccionada.descripcion }}
                  </div>

                  <div
                    class="post_footer"
                    v-for="img in tareaSeleccionada.imagenes"
                    :key="img.id"
                  >
                    <div class="contenedor_pdf">
                      <div class="previw_archivosPost">
                        <h3 v-on:click="descargarPDF(img.archivo)">
                          <i class="fal fa-file-alt file"></i>
                          <span>{{ img.archivo }}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div
                    class="post_footer"
                    v-for="archivo in tareaSeleccionada.archivos"
                    :key="archivo.id"
                  >
                    <div class="contenedor_pdf">
                      <div class="previw_archivosPost">
                        <h3 v-on:click="descargarPDF(archivo.archivo)">
                          <i class="fal fa-file-alt file"></i>
                          <span>{{ archivo.archivo }}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--FIN  MODAL VER TAREA -->

      <div class="sub_header" v-if="this.$route.params.tareas_vencidas">
        <h3>Tareas Caducadas</h3>
      </div>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>
      <!-- 
      PROFESOR -->
      <div class="list-group" v-else-if="usuario.ou == 'Profesor'">
        <div
          class="list-group-item list-group-item-action"
          aria-current="true"
          v-for="tarea in listadoTareas"
          :key="tarea.id"
        >
          <i
            class="far fa-ellipsis-h menu-card-home btn"
            v-on:click="showOptionBody(tarea.idTarea)"
          >
            <div class="notiPostBody" :id="tarea.idTarea" style="top: 15px">
              <p
                class="btn_postBody"
                v-on:click="cargarTareaSeleccionada(tarea.idTarea)"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Ver
              </p>
              <p
                class="btn_postBody red"
                v-on:click="comprobarOpcionEliminar(tarea.idTarea)"
              >
                Eliminar
              </p>
            </div>
          </i>
          <router-link
            :to="{
              name: 'entregas',
              params: {
                idGrupo: tarea.idGrupo,
                idMateria: tarea.idMateria,
                idTareas: tarea.idTarea,
              },
            }"
            class="router-link"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tarea.titulo }}</h5>
              <small class="text-muted" v-if="tareas_vencidas"
                >Vencio: {{ moment(tarea.fecha_vencimiento) }}
              </small>
              <small class="text-muted" v-else
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

      <!--  ALUMNO -->
      <div class="list-group" v-else>
        <div
          class="list-group-item list-group-item-action"
          v-for="tareas in listadoTareas.tareas"
          :key="tareas.id"
        >
          <router-link
            :to="{
              name: 'tarea-seleccionada',
              params: {
                materia: tareas.Materia,
                idTarea: tareas.idTarea,
                re_hacer: false,
              },
            }"
            class="router-link"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tareas.titulo }}</h5>
              <small class="text-muted"
                >Vence: {{ moment(tareas.fecha_vencimiento) }}</small
              >
            </div>
            <p class="mb-1">{{ tareas.descripcion }}</p>
            <small class="text-muted">
              <b>Haga click para visualizar las entregas</b></small
            >
          </router-link>
        </div>
        <div
          class="list-group-item list-group-item-action"
          v-for="tareas in listadoTareas.re_hacer"
          :key="tareas.id"
        >
          <router-link
            :to="{
              name: 'tarea-seleccionada',
              params: {
                materia: tareas.Materia,
                idTarea: tareas.idTarea,
                re_hacer: true,
              },
            }"
            class="router-link"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ tareas.titulo }} {{ tareas.idTarea }}</h5>
              <small class="text-muted"
                >Vence: {{ moment(tareas.fecha_vencimiento) }}</small
              >
            </div>
            <p class="mb-1">{{ tareas.descripcion }}</p>
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
      tareas_vencidas: this.$route.params.tareas_vencidas,
      routerValues: {
        idGrupo: "",
        idMateria: "",
        materia: "",
      },
      cargandoFoto: true,
      alumno: false,
      tarea: {
        titulo: "",
        descripcion: "",
        fecha_vencimiento: "",
        materiaGrupo: [],
        file: [],
      },
      tareaSeleccionada: {
        idTarea: "",
        titulo: "",
        idProfesor: "",
        profile_picture: "",
        nombreProfesor: "",
        idMateria: "",
        materia: "",
        descripcion: "",
        fechaVencimiento: "",
        archivos: "",
        imagenes: "",
      },
      aux: 1,
    };
  },
  mounted() {
    this.routerValues.idGrupo = this.$route.params.idGrupo;
    this.routerValues.idMateria = this.$route.params.idMateria;
    this.routerValues.materia = this.$route.params.materia;

    if (this.usuario.ou == "Profesor") {
      this.cargarTareasCreadasProfesor();
    } else {
      this.cargarTareasCreadasAlumnos();
    }
  },
  methods: {
    cargarTareaSeleccionada(idTarea) {
      this.cargandoFoto = true;
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(Global.urlSitio + "tarea?idTarea=" + idTarea, config)
        .then((res) => {
          if (res.status == 200) {
            this.tareaSeleccionada.idTarea = res.data.datos.idTarea;
            this.tareaSeleccionada.titulo = res.data.datos.titulo;
            this.tareaSeleccionada.idProfesor = res.data.datos.idProfesor;
            this.tareaSeleccionada.profile_picture =
              res.data.datos.profile_picture;
            this.tareaSeleccionada.nombreProfesor =
              res.data.datos.nombreProfesor;
            this.tareaSeleccionada.idMateria = res.data.datos.idMateria;
            this.tareaSeleccionada.materia = this.$route.params.materia;
            this.tareaSeleccionada.descripcion = res.data.datos.descripcion;
            this.tareaSeleccionada.fechaVencimiento =
              res.data.datos.fechaVencimiento;
            this.tareaSeleccionada.archivos = res.data.archivos;
            this.tareaSeleccionada.imagenes = res.data.imagenes;
          }
          this.cargandoFoto = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
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
          link.download = label;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
    },
    showOptionBody(id) {
      let elipsis = document.getElementById(id);
      if (this.aux == 0) {
        elipsis.style.display = "none";
        this.aux = 1;
      } else {
        elipsis.style.display = "block";
        this.aux = 0;
      }
    },
    comprobarOpcionEliminar(idTarea) {
      this.$swal
        .fire({
          title: "¿ Estas seguro que quieres eliminar ?",
          showDenyButton: true,
          confirmButtonText: "Eliminar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.borrarTarea(idTarea);
          }
        });
    },
    borrarTarea(idTarea) {
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
            this.$swal.fire("Tarea eliminada correctamente", "", "success");
            location.reload();
          }
        })
         .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
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
      let timerInterval;
      this.$swal.fire({
        title: "Cargando...",
        html: "Estamos creando tu tarea !",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          this.$swal.showLoading();
          const b = this.$swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = this.$swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      if (this.tarea.file.length > 0) {
        setTimeout(() => {
          for (let i = 0; i < this.tarea.file.length; i++) {
            nombres.push(fecha + this.tarea.file[i].name);
            let formData = new FormData();

            formData.append("archivo", this.tarea.file[i]);
            formData.append("nombre", fecha + this.tarea.file[i].name);

            axios
              .post(Global.urlSitio + "FTP", formData, config)
              .then((response) => {
                if (response.status == 200) {
                  this.enviarCuerpoTarea(nombres);
                }
              });
          }
        }, 2000);
      } else {
        setTimeout(() => {
          this.enviarCuerpoTarea(nombres);
        }, 2000);
      }
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
            this.$swal.fire("Tarea creada", "", "success");
            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
    },

    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.tarea.length <= 2) {
        if (res <= 50) {
          this.tarea.push(event.target.files[0]);
        } else {
          this.$swal.fire(
            "El tamamaño del archivo es mayor a 50 mb",
            "",
            "info"
          );
        }
      } else {
        this.$swal.fire(
          "Solo se permite 3 archivos por publicacion",
          "",
          "info"
        );
      }
    },
    cargarTareasCreadasAlumnos() {
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
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listadoTareas = res.data;
            this.loading = false;
          }
        });
    },
    cargarTareasCreadasProfesor() {
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
            if (this.$route.params.tareas_vencidas) {
              this.listadoTareas = res.data.vencidas;
            } else {
              this.listadoTareas = res.data.noVencidas;
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
    },
  },
};
</script>