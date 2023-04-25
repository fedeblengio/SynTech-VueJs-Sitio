<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>{{ language.agendarClaseVirtual }}</h2>
      </div>
      <ul class="nav nav-tabs justify-content-center text-decoration-none">
        <li class="nav-item">
          <router-link
            to="/agenda-virtual"
            class="nav-link active"
            style="text-decoration: none"
          >
            {{ language.agendarClase }}</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/registro-clases"
            class="nav-link"
            style="text-decoration: none"
          >
            {{ language.registroClases }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/historial-faltas"
            class="nav-link"
            style="text-decoration: none"
          >
            {{ language.historialFaltas }}
          </router-link>
        </li>
      </ul>
      <div
        v-if="camposVacios"
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        {{ language.camposVaciosAlert }}
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
      <div class="agendaContenedor">
        <label>{{ language.grupos }} <em>*</em></label>
        <select
          class="form-control"
          v-model="agenda.idGrupo"
          name="grupos"
          required
          placeholder="Seleccione Grupo"
        >
          <option
            v-bind:value="selectedGroup"
          >
            {{ selectedGroup }}
          </option>
        </select>
      </div>

      <div class="agendaContenedor">
        <label> {{ language.materias }} <em>*</em></label>
        <select
          class="form-control"
          v-model="agenda.materia"
          required
          placeholder="Seleccione Grupo y Asignatura"
        >
          <option v-for="todo in materias" :key="todo.id" :value="todo.id">
            {{ todo.nombre }}
          </option>
        </select>
      </div>

      <div class="agendaContenedor">
        <label>{{ language.fecha }} <em>*</em></label>
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
        <label>{{ language.duracion }} <em>*</em></label>

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
          :value="language.crearClase"
          v-on:click="crearClaseVirtual()"
          class="btn_crearClase"
          style="background-color: grey"
          v-if="loading"
        />
        <input
        v-else
          type="submit"
          :value="language.crearClase"
          v-on:click="crearClaseVirtual()"
          class="btn_crearClase"
        />
    
      </div>
      <div class="sub_header">
        <h3>{{ language.clasesProgramadas }}</h3>
      </div>
      <table class="table table-striped">
        <thead>
          <tr class="text-center">
            <th scope="col">{{ language.grupo }}</th>
            <th scope="col">{{ language.materia }}</th>
            <th scope="col">{{ language.dia }}</th>
            <th scope="col">{{ language.hora }}</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <div class="spinerCont" v-if="loading">
          <img class="spinnerCSS" :src="spinner" />
        </div>
        <tbody v-else>
          <tr
            class="text-center"
            v-for="clase in clasesVirtualesCreadas"
            :key="clase.id"
          >
            <td>{{ clase.idGrupo }}</td>
            <th scope="row">{{ clase.materia }}</th>
            <td>
              {{ fecha(clase.fecha_inicio) }}
            </td>
            <th>
              {{ hora(clase.fecha_inicio) }} - {{ hora(clase.fecha_fin) }}
            </th>
            <td>
              <button
                type="submit"
                style=""
                v-on:click="comprobarOpcionEliminar(clase.id)"
                class="btn-close btn-close"
                aria-label="Close"
              ></button>
            </td>
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
import language from "../assets/lang/agendaVirtual.json";
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
      title: "",
      today: "",
      usuario: "",
      selectedGroup: localStorage.getItem('idGrupo'),
      materias: "",
      camposVacios: false,
      clasesVirtualesCreadas: "",
      agenda: {
        idProfesor: "",
        materia: "",
        idGrupo: "",
        fecha_inicio: "",
        duracionHrs: "",
      },
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    if(this.usuario.ou=="Alumno"){
      this.$router.push("/home");
    }
    this.today = moment().format("YYYY-MM-DDTHH:mm");

    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
    this.getMateriasFromProfesorGrupo(this.usuario.username);
    this.agenda.idProfesor = this.usuario.username;
    this.listarClaseVirtual();
    this.selectLanguage();
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },
    comprobarCamposVacios(input1, input2, input3, input4) {
      return (
        input1.length == 0 ||
        input2.length == 0 ||
        input3.length == 0 ||
        input4.length == 0 ||
        moment(this.today).isAfter(moment(this.agenda.fecha_inicio))
      );
    },
    comprobarOpcionEliminar(idClase) {
      this.$swal
        .fire({
          title: this.language.confirmacionEliminar,
          showDenyButton: true,
          confirmButtonText: this.language.eliminar,
          denyButtonText: this.language.cancelar,
        })
        .then((result) => {
        
          if (result.isConfirmed) {
            this.borrarClase(idClase);
          }
        });
    },
    fecha: function (fecha) {
      return moment(fecha).format("DD/MM");
    },
    hora: function (fecha) {
      return moment(fecha).format("HH:mm");
    },
    borrarClase(idClase) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .delete(Global.urlSitio + "agenda-clase/"+idClase, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.$swal.fire(this.language.eliminarExitoso, "", "success");
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
  
    
    getMateriasFromProfesorGrupo(idProfesor) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "agenda-clase/profesor/" + idProfesor+"/grupo/"+this.selectedGroup+"/materia",
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.materias = res.data;
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
    crearClaseVirtual() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let data = {
        idProfesor: this.agenda.idProfesor,
        idMateria: this.agenda.materia,
        idGrupo: this.agenda.idGrupo,
        fecha_inicio: this.agenda.fecha_inicio,
        fecha_fin: moment(
          moment(this.agenda.fecha_inicio).add(this.agenda.duracionHrs, "hours")
        ).format("YYYY-MM-DDTHH:mm"),
      };

      this.camposVacios = this.comprobarCamposVacios(
        this.agenda.materia,
        this.agenda.idGrupo,
        this.agenda.duracionHrs,
        this.agenda.fecha_inicio
      );
      if (!this.camposVacios) {
        axios
          .post(Global.urlSitio + "agenda-clase", data, config)
          .then((res) => {
            if (res.status == 200) {
              location.reload();
              this.$swal.fire({
                icon: "success",
                title: "Agenda",
                text: this.language.claseCreada,
              });
            }
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: this.language.algoSalioMal,
            });
          });
      }
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
            "agenda-clase/usuario/" +
            this.usuario.username+"/grupo/"+this.selectedGroup,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.clasesVirtualesCreadas = res.data;
          }
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