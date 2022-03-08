  <template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Calendario de Clases</h2>
      </div>
      <div>
        <FullCalendar :options="calendarOptions" />
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Materia</th>
            <th scope="col">Hora</th>
            <th scope="col">Link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clase in listClasesVirtuales" :key="clase.id">
            <th scope="row">{{ clase.idGrupo }} - {{ clase.materia }}</th>
            <td>
              {{ moment(clase.fecha_inicio) }} - {{ moment(clase.fecha_fin) }}
            </td>
            <td>
              <button class="btn_jitsi" v-on:click="entrarJitsi(clase)">
                Entrar
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
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import moment from "moment";
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
window.$ = JQuery;
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
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        weekends: false,
        locale: "es",
        timeZone: "GMT-3",
        events: [],
      },
      title: "Calendario",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listClasesVirtuales: "",
    };
  },
  mounted() {
    this.clasesVirtualesCreadas();
  },
  methods: {
    moment: function (fecha) {
      return moment(fecha).format("h:mm");
    },
    addClass() {
      let json = { title: "examen", date: "2022-02-09" };
      this.calendarOptions.events.push(json);
    },

    entrarJitsi(clase) {
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


      if (habilitado) {
        let url = "https://meet.jit.si/" + window.btoa(clase);
        return window
          .open(
            url,
            "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=500"
          )
          .focus();
      } else {
        alert("Podras acceder a la clase 5 minutos antes de la hora especificada");
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
            "agenda-clase?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listClasesVirtuales = res.data;
            this.cargarCalendario();
          }
        });
    },
    cargarCalendario() {
      let arr = []; //    { title: "event 1", date: "2022-02-01" },
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