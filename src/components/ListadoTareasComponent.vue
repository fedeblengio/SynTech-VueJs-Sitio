<template>
  <div class="contenedorDiv">
    <vue-headful :title="language.title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>{{ this.$route.params.materia }}</h2>
       
        <button
          class="boxText_btn"
          style="background-color: grey"
          v-if="
            loading &&
            !this.$route.params.tareas_vencidas &&
            usuario.ou == 'Profesor'
          "
        >
          {{ language.crearTarea }}
        </button>
        <button
          v-else-if="
            usuario.ou == 'Profesor' && !this.$route.params.tareas_vencidas
          "
          type="button"
          class="btn_crearTarea"
          data-toggle="modal"
          data-target="#modalTarea"
        >
          {{ language.crearTarea }}
        </button>
        
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
            >{{ language.navInicio }}</router-link
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
            {{ language.navMiembros }}
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
            {{ language.navTareas }}
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
            {{ language.navTareas }}
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
            {{ language.navRegistro }}
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
            {{ language.navRegistro }}
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
              <h5 class="modal-title" id="exampleModalLabel">
                {{ language.crearTarea }}
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
              <div
                class="alert alert-warning alert-dismissible fade show"
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
              <div class="styleTarea">
                <div class="text-right">
                  <small
                    class="text-muted"
                    style="margin-right: 28px; font-size: 16px"
                    >{{ language.publicarPara }} : {{ routerValues.idGrupo }}
                    {{ routerValues.materia }}
                  </small>
                </div>
                <div>
                  <label for="titulo" style="margin-left: 24px"
                    >{{ language.tituloTarea }} :
                  </label>
                  <input
                    type="text"
                    v-model="tarea.titulo"
                    :placeholder="language.placeholderTitulo"
                    required
                  />
                </div>

                <div>
                  <label for="descripcion" style="margin-left: 24px"
                    >{{ language.descripcionTarea }} :
                  </label>
                  <textarea
                    id="textarea"
                    :placeholder="language.placeholderDesc"
                    required
                    v-model="tarea.descripcion"
                  ></textarea>
                </div>
                <div>
                  <label for="datePicker" style="margin-left: 24px"
                    >{{ language.fecha_vencimiento }} :
                  </label>
                  <input
                    type="date"
                    v-model="tarea.fecha_vencimiento"
                    required
                    :min="today"
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
                      accept=".jpg, .png, .jpeg,  .pdf"
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
                {{ language.crearBtn }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- --- FIN MODAL --- -->
      <!-- MODAL VER CALIFIACIONES  -->
      <div
        class="modal fade bd-example-modal-lg"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {{ this.nalumno }} - {{ this.ciAlumnos }}
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
            <div class="spinerCont mt-2 mb-2 p-2" v-if="cargandoTareas">
              <img :src="spinner" class="spinnerCSS" />
            </div>
            <div class="p-4" v-else-if="objectoVacio(listadoHistorialTareas)">
              <p class="p-4 m-2 text-center">
                {{ language.noHayTareasRegistradas }}
              </p>
            </div>
            <div class="p-4" v-else>
              <table class="table table-striped">
                <thead class="thead-dark">
                  <tr class="text-center">
                    <th scope="col">{{ language.tablaTarea }}</th>
                    <th scope="col ml-1">{{ language.tablaPrimerNota }}</th>
                    <th scope="col ml-1">{{ language.tablaSegundaNota }}</th>
                    <th scope="col">{{ language.tablaEntrega }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="tarea in listadoHistorialTareas"
                    :key="tarea.id"
                    class="text-center"
                  >
                    <th scope="row">{{ tarea.titulo }}</th>
                    <td class="ml-2">
                      {{ calificacion(tarea.calificacion) }}
                    </td>
                    <td class="ml-4">
                      {{ calificacion(tarea.nota_reHacer.calificacion) }}
                    </td>
                    <td>
                      <router-link
                        aria-hidden="true"
                        data-dismiss="modal"
                        :to="{
                          name: 'visualizar-tarea',
                          params: {
                            idAlumnos: tarea.idAlumnos,
                            idTareas: tarea.idTareas,
                          },
                        }"
                        >{{ language.ver }}</router-link
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- FIN MODAL VER CALIFIACIONES -->
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
                {{ language.tareaPublicada }}
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
                <div class="contTareaSele" style="width: 375px !important">
                  <div class="post_title">
                    <span> {{ tareaSeleccionada.titulo }} </span>
                    <p>
                      <small
                        :class="
                          tiempoDeVencimiento(
                            tareaSeleccionada.fechaVencimiento,
                            'text-muted'
                          )
                        "
                      >
                        {{ language.vence }} :
                        {{ moment(tareaSeleccionada.fechaVencimiento) }}</small
                      >
                    </p>
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
                          <span>{{ simplificarNombre(img.archivo) }}</span>
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
                          <span>{{ simplificarNombre(archivo.archivo) }}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-on:click="
                    comprobarOpcionEliminar(tareaSeleccionada.idTarea)
                  "
                  class="trashTarea"
                >
                  <p
                    class="btn"
                    style="background-color: #568dca; color: white"
                  >
                    {{ language.eliminar }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--FIN  MODAL VER TAREA -->

      <div class="sub_header" v-if="this.$route.params.tareas_vencidas">
        <h3>{{ language.historialCorreciones }}</h3>
      </div>
      <div class="spinerCont" v-if="loading">
        <img :src="spinner" class="spinnerCSS" />
      </div>

      <!--  PROFESOR -->

      <div
        v-else-if="
          usuario.ou == 'Profesor' && !this.$route.params.tareas_vencidas
        "
      >
        <div
          class="list-group-item-action item-registro"
          aria-current="true"
          v-for="tarea in listadoTareas"
          :key="tarea.id"
          style="border-bottom: 1px solid var(--background)"
        >
          <i class="far fa-ellipsis-h menu-card-home btn ellipsis-home">
            <div class="notiPostBody" :id="tarea.idTarea" style="top: 15px">
              <p
                class="btn_postBody"
                v-on:click="cargarTareaSeleccionada(tarea.idTarea)"
                data-toggle="modal"
                data-target="#exampleModal"
              >

                {{ language.ver }}
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
              <h5 class="mb-1">{{ tarea.titulo }} {{ tarea.materia }}</h5>
            </div>
          </router-link>
         
          <p
            :class="
              tiempoDeVencimiento(
                tarea.fecha_vencimiento,
                'fechaRegistroComponent'
              )
            "
          >
            {{ language.vence }}: {{ moment(tarea.fecha_vencimiento) }}
          </p>
          <small class="text-muted">
            <b>{{ language.hagaClickParaVerEntregas }}</b></small
          >
        </div>
      </div>

      <!--  ALUMNO -->
      <div class="list-group" v-else-if="usuario.ou == 'Alumno'">
        <div
          class="list-group-item-action item-registro"
          aria-current="true"
          v-for="tareas in listadoTareas.tareas"
          :key="tareas.id"
          style="border-bottom: 1px solid var(--background)"
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
            </div>
          </router-link>
          <p
            :class="
              tiempoDeVencimiento(
                tareas.fecha_vencimiento,
                'fechaRegistroComponent'
              )
            "
          >
            {{ language.vence }}: {{ moment(tareas.fecha_vencimiento) }}
          </p>
          <small class="text-muted">
            <b>{{ tareas.descripcion }}</b></small
          >
        </div>

        <div
          class="list-group-item-action item-registro"
          aria-current="true"
          v-for="tareas in listadoTareas.re_hacer"
          :key="tareas.id"
          style="border-bottom: 1px solid var(--background)"
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
              <h5 class="mb-1">{{ tareas.titulo }}</h5>
            </div>
          </router-link>
          <p
            :class="
              tiempoDeVencimiento(
                tareas.fecha_vencimiento,
                'fechaRegistroComponent'
              )
            "
          >
            {{ language.vence }}: {{ moment(tareas.fecha_vencimiento) }}
          </p>
          <small class="text-muted">
            <b>{{ tareas.descripcion }}</b></small
          >
        </div>
      </div>
      <div v-else>
        <table class="table table-striped">
          <thead>
            <tr class="text-center">
              <th scope="col">{{ language.alumnoFoto }}</th>
              <th scope="col">{{ language.alumnoCedula }}</th>
              <th scope="col">{{ language.alumnoNombre }}</th>
              <th scope="col">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="text-center"
              v-for="alumno in listadoUsuarios.Alumnos"
              :key="alumno.id"
            >
              <th scope="row">
                <img
                  width="50px"
                  height="50px"
                  style="border-radius: 50%"
                  :src="returnImgProfile(alumno.imagen_perfil)"
                  alt=""
                />
              </th>
              <td>{{ alumno.idAlumnos }}</td>
              <td>{{ alumno.nombre }}</td>
              <td>
                <div
                  class="verTarea"
                  @click="
                    cargarListaCalificaciones(alumno.idAlumnos, alumno.nombre)
                  "
                  data-toggle="modal"
                  data-target=".bd-example-modal-lg"
                >
                  {{ language.ver }} <i class="far fa-eye"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
import $ from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
import language from "../assets/lang/listadoTareas.json";

export default {
  name: "tareasEntregadas",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "",
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
      today: "",
      cargandoFoto: true,
      alumno: false,
      tarea: {
        titulo: "",
        descripcion: "",
        fecha_vencimiento: "",
        materiaGrupo: [],
        file: [],
      },
      cargandoTareas: false,
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
      listadoUsuarios: {
        Profesor: "",
        Alumnos: "",
      },
      listadoHistorialTareas: "",
      nalumno: "",
      ciAlumnos: "",
      camposVacios: false,
      lang: localStorage.getItem("lang"),
      language: "",
      idGrupoStorage:localStorage.getItem('idGrupo'),
    };
  },
  mounted() {
    this.today = moment().format("YYYY-MM-DD");
    this.selectLanguage();
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
    tiempoDeVencimiento(fecha, defaultCSS) {
      let nextDay = moment().add(1, "d").format("YYYY-MM-DD");
      let followNextDay = moment().add(2, "d").format("YYYY-MM-DD");
      let today = moment().format("YYYY-MM-DD");

      if (moment(nextDay).isSame(fecha)) {
        return defaultCSS + " orange";
      } else if (moment(followNextDay).isSame(fecha)) {
        return defaultCSS + " orange";
      } else if (moment(fecha).isSame(today)) {
        return defaultCSS + " red";
      } else {
        return defaultCSS + " green";
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
    comprobarCamposVacios(input1, input2, input3) {
      return input1.length == 0 || input2.length == 0 || input3.length == 0;
    },
    objectoVacio(objecto) {
      return $.isEmptyObject(objecto);
    },
    calificacion(nota) {
      if (nota == undefined || nota == 0 || nota == null) {
        return this.language.sinCalificar;
      } else {
        return nota + " / 12";
      }
    },
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
    cargarTareaSeleccionada(idTarea) {
      this.cargandoFoto = true;
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(Global.urlSitio + "tarea/" + idTarea, config)
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
            text: this.language.algoSalioMal,
          });
        });
    },
    returnIMGB64(img) {
      return "data:image/png;base64," + img;
    },
    cargarListaCalificaciones(idAlumno, nombreAlumno) {
      this.cargandoTareas = true;
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
      .get(Global.urlSitio+"grupo/"+this.routerValues.idGrupo+"/materia/"+this.routerValues.idMateria+"/alumno/"+idAlumno+"/notas",config)
        .then((res) => {
          if (res.status == 200) {
            this.listadoHistorialTareas = res.data;
            this.cargandoTareas = false;
            this.nalumno = nombreAlumno;
            this.ciAlumnos = idAlumno;
          }
        });
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
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    simplificarNombre(nombreArchivo) {
      return nombreArchivo.replace(/^([\d_^)]+)/, "");
    },
    comprobarOpcionEliminar(idTarea) {
      this.$swal
        .fire({
          title: this.language.confirmarEliminacion,
          showDenyButton: true,
          confirmButtonText: this.language.eliminar,
          denyButtonText: this.language.cancelar,
        })
        .then((result) => {
        
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
        .delete(Global.urlSitio + "tarea/" + idTarea, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.tareaEliminada, "", "success");
            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    moment: function (fecha) {
      return moment(fecha).format("DD/MM/YYYY");
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
      this.camposVacios = this.comprobarCamposVacios(
        this.tarea.titulo,
        this.tarea.descripcion,
        this.tarea.fecha_vencimiento
      );
      if (!this.camposVacios) {
        this.$swal.fire({
          title: this.language.cargando,
          html: this.language.creandoTarea,
          allowOutsideClick: false,
          timerProgressBar: true,
          allowEscapeKey: false,
          didOpen: () => {
            this.$swal.showLoading();
            this.enviarCuerpoTarea();
          },
          willClose: () => {
            clearInterval(5);
          },
        });
      }
    },
    enviarCuerpoTarea() {
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
      formData.append("idUsuario", this.usuario.username);
      for (let archivo of this.tarea.file) {
        formData.append("archivos[]", archivo);
      }
      for (let archivo of this.tarea.file) {
        formData.append("nombresArchivo[]", archivo.name);
      }
      axios
        .post(Global.urlSitio + "tarea", formData, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.tareaCreada, "", "success");

            location.reload();
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },

    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.tarea.file.length <= 2) {
        if (res <= 50) {
          this.tarea.file.push(event.target.files[0]);
        } else {
          this.$swal.fire(this.language.archivoMayor50, "", "info");
        }
      } else {
        this.$swal.fire(this.language.maximo3Archivos, "", "info");
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
        Global.urlSitio+ "grupo/"+this.routerValues.idGrupo+"/materia/"+this.routerValues.idMateria+"/usuarios/"+this.usuario.username+"/tarea",config
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
        Global.urlSitio+ "grupo/"+this.routerValues.idGrupo+"/materia/"+this.routerValues.idMateria+"/usuarios/"+this.usuario.username+"/tarea",config
      )
        .then((res) => {
          if (res.status == 200) {
            if (this.$route.params.tareas_vencidas) {
              this.listadoTareas = res.data.vencidas;
              this.traerUsuarios();
            } else {
              this.listadoTareas = res.data.noVencidas;
              this.loading = false;
            }
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
    traerUsuarios() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
       .get(
        Global.urlSitio+"grupo/"+this.$route.params.idGrupo+"/materia/"+this.$route.params.idMateria+"/usuarios", config
      ).then((res) => {
          this.listadoUsuarios.Alumnos = res.data.Alumnos;
          this.listadoUsuarios.Profesor = res.data.Profesor;
          this.loading = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.algoSalioMal,
          });
        });
    },
  },
};
</script>

<style scoped>
.green {
  color: green !important;
}
.orange {
  color: orange !important;
}
.red {
  color: red !important;
}
</style>