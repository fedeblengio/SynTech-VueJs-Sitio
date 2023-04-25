  <template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>{{ language.calendarioClases }}</h2>
      </div>

      <FullCalendar
        :options="calendarOptions"
        style="margin-top: -25px !important"
      />
      <div class="sub_header">
        <h3>{{ language.misClases }}</h3>
      </div>
      <table class="table table-striped">
        <thead>
          <tr class="text-center">
            <th scope="col">{{ language.grupo }}</th>
            <th scope="col">{{ language.materia }}</th>
            <th scope="col">{{ language.dia }}</th>
            <th scope="col">{{ language.hora }}</th>
            <th scope="col">{{ language.link }}</th>
          </tr>
        </thead>
        <div class="spinerCont" v-if="loading">
          <img class="spinnerCSS" :src="spinner" />
        </div>

        <tbody v-else>
          <tr
            class="text-center"
            v-for="clase in listClasesVirtuales"
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
                class="btn_jitsi"
                v-on:click="entrarJitsi(clase)"
                v-if="profesor"
              >
                {{ language.iniciar }}
              </button>
              <button class="btn_jitsi" v-on:click="entrarJitsi(clase)" v-else>
                {{ language.entrar }}
              </button>
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
import language from "../assets/lang/calendario.json";

import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";

export default {
  name: "ProfileComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
    FullCalendar,
  },
  data() {
    return {
      loading: true,
      spinner: Global.spinnerUrl,
      events: [],
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        weekends: false,
        locale: "",
        height: 450,
        timeZone: "GMT-3",
        events: [],
      },
      selectedGroup: localStorage.getItem("idGrupo"),
      title: "",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listClasesVirtuales: "",
      profesor: false,
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },

  mounted() {
    this.clasesVirtualesCreadas();
    this.verificarRol();
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
      this.calendarOptions.locale = this.language.calendario;
    },
    hora: function (fecha) {
      return moment(fecha).format("HH:mm ");
    },
    fecha: function (fecha) {
      return moment(fecha).format("DD/MM");
    },
    addClass() {
      let json = { title: "examen", date: "2022-02-09" };
      this.calendarOptions.events.push(json);
    },
    verificarRol() {
      if (this.usuario.ou == "Profesor") {
        this.profesor = true;
      }
    },
    verificarHabilitacionEntrar(clase) {
      let fecha_inicio = moment(clase.fecha_inicio).format(
        "YYYY-MM-DD HH:mm a"
      );
      let i = 0;
      let habilitado = false;
      while (i < 6) {
        i++;
        let fecha_actual = moment().add(i, "m").format("YYYY-MM-DD HH:mm a");
        if (fecha_actual === fecha_inicio) {
          habilitado = true;
        } else if (moment().isAfter(moment(clase.fecha_inicio))) {
          habilitado = true;
        }
      }
      return habilitado;
    },
    redirectPasarLista(clase) {
      if (this.profesor) {
        this.$router.push({
          name: "pasaje-lista",
          params: {
            idGrupo: clase.idGrupo,
            idMateria: clase.idMateria,
            idClase: clase.id,
          },
        });
      }
    },
    verificarExistenciaDeLista(clase) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(Global.urlSitio + "registro-clase?idClase=" + clase.id, config)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.length == 0) {
              this.redirectPasarLista(clase);
            } else {
              this.$router.push({
                name: "PDF",
                params: {
                  materia: clase.materia,
                  fecha: clase.fecha_inicio,
                  idClase: clase.id,
                },
              });
            }
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.lenguage.algoSalioMal,
          });
        });
    },
    entrarJitsi(clase) {
      let habilitado = this.verificarHabilitacionEntrar(clase);

      if (habilitado) {
        let url = "https://meet.jit.si/" + window.btoa(clase);
        this.verificarExistenciaDeLista(clase);

        return window
          .open(
            url,
            "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=500"
          )
          .focus();
      } else {
        this.$swal.fire(this.language.infoAcceder, "", "info");
      }
    },
    clasesVirtualesCreadas() {
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
            this.usuario.username +
            "/grupo/" +
            this.selectedGroup,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listClasesVirtuales = res.data;
            this.cargarCalendario();
          }
          this.loading = false;
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.lenguage.algoSalioMal,
          });
        });
    },
    cargarCalendario() {
      let arr = [];
      for (let i = 0; i < this.listClasesVirtuales.length; i++) {
        let date = moment(this.listClasesVirtuales[i].fecha_inicio).format(
          "YYYY-MM-DD"
        );
        let materia = this.listClasesVirtuales[i].materia.substr(0, 3);
        let hora = moment(this.listClasesVirtuales[i].fecha_inicio).format(
          "HH:mm"
        );
        arr.push({ title: materia + ". " + hora, date: date });
      }
      this.calendarOptions.events = arr;
    },
  },
};
</script>