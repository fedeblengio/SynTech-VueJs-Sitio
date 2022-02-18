<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Tareas</h2>
      </div>
      <router-link
        to="entregas-realizadas"
        style="text-decoration: none; float: right; padding-right: 5px"
        v-if="alumno"
        >Tareas Entregadas</router-link
      >

      <div class="boxText" v-if="!alumno">
        <div class="moverBtnCrearTarea">
          <button
            type="button"
            class="btn_crearClase"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Crear Tarea
          </button>
        </div>

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
                <h5 class="modal-title" id="exampleModalLabel"> Crear Tarea</h5>
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
                  <div class="select_tarea">
                    <select
                      v-model="tarea.materiaGrupo"
                      required
                      placeholder="Seleccione Grupo y Asignatura"
                    >
                      <option
                        v-for="todo in traerGrupoMateria"
                        :key="todo.id"
                        v-bind:value="[
                          todo.idGrupo,
                          todo.idMateria,
                          todo.Materia,
                        ]"
                      >
                        {{ todo.idGrupo }} - {{ todo.Materia }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="titulo">Titulo : </label>
                    <input
                      type="text"
                      v-model="tarea.titulo"
                      placeholder="Escribe una Titulo"
                      required
                    />
                  </div>

                  <div>
                    <label for="descripcion">Descripcion : </label>
                    <textarea
                      id="textarea"
                      placeholder="Escribe una Descripcion"
                      required
                      v-model="tarea.descripcion"
                    ></textarea>
                  </div>
                  <div>
                    <label for="datePicker">Fecha de Vencimiento : </label>
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
      </div>

      <div class="boxText" v-if="!alumno">
        <div class="select_materia">
          <label for="selectMateria">Filtrar por Grupo y Materia</label>
          <select
            v-on:change="cargarTareasCreadas()"
            v-model="filtro.materiaGrupo"
            required
            placeholder="Seleccione Grupo y Asignatura"
          >
            <option
              selected="selected"
              v-for="todo in traerGrupoMateria"
              :key="todo.id"
              v-bind:value="[todo.idGrupo, todo.idMateria, todo.Materia]"
            >
              {{ todo.idGrupo }} - {{ todo.Materia }}
            </option>
          </select>
        </div>
        <div v-for="tarea in cargarTareas" :key="tarea.id" class="post">
          <router-link
            :to="{
              name: 'entregas',
              params: {
                idGrupo: tarea.idGrupo,
                idMateria: tarea.idMateria,
                idTarea: tarea.idTarea,
                titulo: tarea.titulo,
              },
            }"
            style="text-decoration: none"
          >
            <div class="post_body">
              {{ tarea.idTareas }}
              <!-- {{tarea.idProfesor}} -->
              <!--      {{tarea.nombreUsuario}} -->
              {{ tarea.nombreMateria }}
              <!--  {{tarea.idMateria}} -->
              {{ tarea.idGrupo }}
              <!-- {{tarea.turnoGrupo}} -->
              {{ tarea.titulo }}
              <!--  {{tarea.fecha_vencimiento}} -->
            </div>
          </router-link>
        </div>
      </div>

      <div class="boxText" v-else>
        <select
          v-on:change="cargarTareasCreadas()"
          class="form-control"
          v-model="filtro.materiaGrupo"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option v-bind:value="[0, 1]">Matematica 1</option>
          <option v-bind:value="[0, 2]">Fisica 2</option>
        </select>
        <details class="test target-me">
          <summary>Pendientes</summary>
          <div
            v-for="tarea in cargarTareas.tareas"
            :key="tarea.id"
            class="posts_style"
          >
            <div class="post_body">
              <router-link
                :to="{
                  name: 'tarea-seleccionada',
                  params: {
                    materia: tarea.Materia,
                    idTarea: tarea.idTarea,
                    re_hacer: false,
                  },
                }"
                class="router-link"
              >
                {{ tarea.Materia }}
                {{ tarea.idGrupo }}
                {{ tarea.titulo }}
                <!-- {{ tarea.vencido }} -->
              </router-link>
            </div>
          </div>
        </details>
        <h3>Tareas para Re Hacer</h3>
        <div
          v-for="re_tarea in cargarTareas.re_hacer"
          :key="re_tarea.id"
          class="post"
        >
          <div class="post_body">
            <router-link
              :to="{
                name: 'tarea-seleccionada',
                params: {
                  materia: re_tarea.Materia,
                  idTarea: re_tarea.idTarea,
                  re_hacer: true,
                },
              }"
              style="text-decoration: none"
            >
              {{ re_tarea.idTarea }}
              <!-- {{tarea.idProfesor}} -->
              <!--      {{tarea.nombreUsuario}} -->
              {{ re_tarea.Materia }}
              <!--  {{tarea.idMateria}} -->
              {{ re_tarea.idGrupo }}
              <!-- {{tarea.turnoGrupo}} -->
              {{ re_tarea.titulo }}
              {{ re_tarea.vencido }}
              <!--  {{tarea.fecha_vencimiento}} -->
            </router-link>
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
import axios from "axios";
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
window.$ = JQuery;
export default {
  name: "TareasComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Tareas",
      usuario: "",
      alumno: true,
      traerGrupoMateria: "",
      cargarTareas: "",
      tarea: {
        titulo: "",
        descripcion: "",
        fecha_vencimiento: "",
        materiaGrupo: [],
        file: [],
      },
      filtro: {
        materiaGrupo: ["", ""],
      },
    };
  },
  mounted() {
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.verificarRol();
    this.openListaDetalles();
  },
  methods: {
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.alumno = false;
        this.traerGrupoProfesor();
        this.cargarTareasCreadas();
      } else {
        this.cargarTareasCreadas();
        this.alumno = true;
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
            this.filtro.materiaGrupo[1] +
            "&idGrupo=" +
            this.filtro.materiaGrupo[0],
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.cargarTareas = res.data;
          }
        });
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
      formData.append("idMateria", this.tarea.materiaGrupo[1]);
      formData.append("idGrupo", this.tarea.materiaGrupo[0]);
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

    traerGrupoProfesor() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "profesor-grupo?idProfesor=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerGrupoMateria = res.data;
          }
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
    delateFile(nombre) {
      let i;

      for (i = 0; i < this.tarea.file.length; i++) {
        if (this.tarea.file[i].name === nombre) {
          this.tarea.file.splice(i, 1);
        }
      }
    },
    openListaDetalles() {
      const details = document.querySelector("details");
      details.setAttribute("open", "");
    },
  },
};
</script>