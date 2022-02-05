<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Agendar Clase Virtual</h2>
      </div>
      <div class="boxText">
        <label>Profesor Cedula</label>
        <input type="text" v-model="agenda.idProfesor" />
        <br /><br />
        <label>Nombre Materia</label>
        <select
          class="form-control"
          v-model="agenda.idMateria"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option
            v-for="todo in traerGrupos"
            :key="todo.id"
            v-bind:value="todo.idMateria"
          >
            {{ todo.Materia }}
          </option>
        </select>
        <br /><br />
        <label>Grupo</label>
        <select
          class="form-control"
          v-model="agenda.idGrupo"
          name="grupos"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option
            v-for="todo in traerGrupos"
            :key="todo.id"
            v-bind:value="todo.idGrupo"
          >
            {{ todo.idGrupo }}
          </option>
        </select>

        <br /><br />
        <label>Fecha</label>
        <input
          type="datetime-local"
          id="meeting-time"
          name="meeting-time"
          :min="today"
          v-model="agenda.fecha_inicio"
        />

        <br /><br />
        <label>Duracion</label>
        <select name="meeting-hrs" v-model="agenda.duracionHrs" required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <label for="meeting-hrs">h</label>
        <select name="meeting-min" v-model="agenda.duracionMin" required>
          <option value="1">0</option>
          <option value="2">15</option>
          <option value="3">30</option>
          <option value="4">45</option>
        </select>
        <label for="meeting-min">min.</label>
      </div>
      <input
        type="submit"
        value="Crear Clase"
        v-on:click="crearClaseVirtual()"
      />

      <div  v-for="todo in clasesVirtualesCreadas" :key="todo.id">
        <span class="clases">
          <span class="sidebarDot"></span> {{ todo}} -</span
        >
      </div>
    </div>

    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
/* import $ from "jquery"; */
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";

export default {
  name: "AgendaVirtual",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "agenda-clase",
      today: "",
      usuario: "",
      traerGrupos: "",
      clasesVirtualesCreadas: "",
      agenda: {
        idProfesor: "",
        idMateria: "",
        idGrupo: "",
        fecha_inicio: "",
        duracionHrs: "",
        duracionMin: "",
      },
    };
  },
  mounted() {
    this.today = moment().format("YYYY-MM-DDTHH:mm");
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.traerGrupoProfesor(this.usuario.username);
    this.agenda.idProfesor = this.usuario.username;
    this.listarClaseVirtual();
  },
  methods: {
    traerGrupoProfesor(idProfesor) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "profesor-grupo?idProfesor=" + idProfesor,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerGrupos = res.data;
          }
        });
    },
    crearClaseVirtual() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      if(this.agenda.duracionMin == undefined) {
        this.agenda.duracionMin = 0;
      }
      let data = {
        idProfesor: this.agenda.idProfesor,
        idMateria: this.agenda.idMateria,
        idGrupo: this.agenda.idGrupo,
        fecha_inicio: this.agenda.fecha_inicio,
        fecha_fin: moment(
          moment(this.agenda.fecha_inicio)
            .add(this.agenda.duracionHrs, "hours")
            .add(this.agenda.duracionMin, "minutes")
        ).format("YYYY-MM-DDTHH:mm"),
      };

      axios.post(Global.urlSitio + "agenda-clase", data, config).then((res) => {
        if (res.status == 200) {
          alert("todo Funco");
        }
      });
    },
    listarClaseVirtual() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio +
            "agenda-clase?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.clasesVirtualesCreadas = res.data;
          }
        });
    },
  },
};
</script>