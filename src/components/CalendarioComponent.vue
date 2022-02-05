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
   
      <div v-for="clase in listClasesVirtuales" :key="clase.id" class="post">
        <div class="post_body">
          {{ clase.idGrupo }}
          {{ clase.materia }}
          {{ clase.fecha_inicio }}
          {{ clase.fecha_fin }}
        </div>
        <button class="boxText_btn" v-on:click="entrarJitsi(clase)">
          Entrar
        </button>
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
       
        events: [
          { title: "event 1", date: "2022-02-01" },
          { title: "event 2", date: "2022-02-02" },
        ],
      },
      title: "Calendario",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listClasesVirtuales: "",
    };
  },
  mounted() {
    /*  if (this.usuario.ou == "Profesor") {
      this.calendarioProfesor();
    } else {
      this.calendarioAlumno();
    } */
   this.clasesVirtualesCreadas(); 
  },
  methods: {
    /*     handleDateClick: function (arg) {
      alert("date click! " + arg.dateStr);
    }, */


    addClass() {
      let json = { title: "examen", date: "2022-02-09" };
      this.calendarOptions.events.push(json);
    },
    entrarJitsi(clase) {
      let url = "https://meet.jit.si/" + window.btoa(clase);
      return window
        .open(
          url,
          "_blank",
          "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=500"
        )
        .focus();
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
            this.cargarCalendario()
          }
        });
    },
    cargarCalendario(){
       let arr = [];   //    { title: "event 1", date: "2022-02-01" },
       for (let i = 0; i < this.listClasesVirtuales.length; i++) {
         let date = moment(this.listClasesVirtuales[i].fecha_inicio).format("YYYY-MM-DD");
         let materia =this.listClasesVirtuales[i].materia.substr(0,3)
         let hora = moment(this.listClasesVirtuales[i].fecha_inicio).format("HH:mm");
        arr.push({ title:materia+". "+ hora, date: date})
      }
      this.calendarOptions.events = arr
    }
    /*    calendarioAlumno() {
      alert("ES ALUMNO");
    },
    calendarioProfesor() {
      alert("ES PROFESOR");
    }, */
  },
};
</script>