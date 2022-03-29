<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Agendar Clase Virtual</h2>
      </div>

      <div class="agendaContenedor">
        <label>Grupo</label>
        <select
          class="form-control"
          v-model="agenda.idGrupo"
          name="grupos"
          required
          placeholder="Seleccione Grupo y Asignatura"
          v-on:change="filtrarMateria(agenda.idGrupo)"
        >
          <option
            v-for="todo in traerGrupos"
            :key="todo.id"
            v-bind:value="todo.idGrupo"
          >
            {{ todo.idGrupo }}
          </option>
        </select>
      </div>

      <div class="agendaContenedor">
        <label> Materia</label>
        <select
          class="form-control"
          v-model="agenda.materia"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option v-for="todo in materias" :key="todo.id">
            {{ todo }}
          </option>
        </select>
      </div>

      <div class="agendaContenedor">
        <label>Fecha</label>
        <input
          type="datetime-local"
          id="meeting-time"
          name="meeting-time"
          :min="today"
          v-model="agenda.fecha_inicio"
          class="imput_fechaAgenda"
        />
      </div>

      <div class="agendaContenedor">
        <label>Duracion</label>

        <div class="contenedorDuracion">
          <select name="meeting-hrs" v-model="agenda.duracionHrs" required>
            <option value="1">1⠀hr.</option>
            <option value="2">2 hrs.</option>
            <option value="3">3 hrs.</option>
            <option value="4">4 hrs.</option>
            <option value="5">5 hrs.</option>
          </select>

        </div>
      </div>

      <div class="agendaContenedor movimientoBtnAgenda">
        <input
          type="submit"
          value="Crear Clase"
          v-on:click="crearClaseVirtual()"
          class="btn_crearClase"
        />
      </div>
       <div class="sub_header">
        <h3>Clases Programadas</h3>
      </div>
      <table class="table table-striped">
        <thead>
          <tr class='text-center'>
            <th scope="col">Grupo</th>
            <th scope="col">Materia</th>
             <th scope="col">Dia</th>
            <th scope="col">Hora</th>
            
          </tr>
        </thead>
        <div class="div" v-if="loading">
          <center>
            <img class="spinnerCSS" :src="spinner" />
          </center>
        </div>
        <tbody v-else>
          <tr class='text-center'  v-for="clase in clasesVirtualesCreadas" :key="clase.id">
            <td>{{ clase.idGrupo }}</td>
            <th scope="row"> {{ clase.materia }}</th>
            <td>
               {{ fecha(clase.fecha_inicio) }}  
            </td>
            <th>
                 {{ hora(clase.fecha_inicio) }} - {{hora(clase.fecha_fin) }}  
            </th>
            
          </tr>
        </tbody>
      </table>
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
      loading: true,
      spinner: Global.spinnerUrl,
      title: "agenda-clase",
      today: "",
      usuario: "",
      traerGrupos: "",
      materias: "",
      clasesVirtualesCreadas: "",
      agenda: {
        idProfesor: "",
        materia: "",
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
  
    fecha: function (fecha) {
      return moment(fecha).format("DD/MM");
    },
     hora: function (fecha) {
      return moment(fecha).format("HH:mm");
    },
    filtrarMateria(idGrupo) {
      for (var i = 0; i < this.traerGrupos.length; i++) {
        if (this.traerGrupos[i].idGrupo == idGrupo) {
          this.materias = this.traerGrupos[i].materias;
        }
      }
    },
    traerGrupoProfesor(idProfesor) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "agenda-clase-grupos?idUsuario=" + idProfesor,
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

      if (this.agenda.duracionMin == undefined) {
        this.agenda.duracionMin = 0;
      }
      let data = {
        idProfesor: this.agenda.idProfesor,
        materia: this.agenda.materia,
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
            location.reload();
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Clase creada correctamente",
            });
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
          this.loading = false;
        });
    },
  },

};
</script>