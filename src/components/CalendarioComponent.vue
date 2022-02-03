  <template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Calendario de Clases</h2>
      </div>
      <div>
        <calendar :attributes="attrs" is-expanded />
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
window.$ = JQuery;
export default {
  name: "ProfileComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Profile",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listClasesVirtuales: "",
      attrs: [
        {
          key: "today",
          highlight: true,
          dates: new Date(),
        },
      ],
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
    entrarJitsi(clase){
      let url = "https://meet.jit.si/"+ window.btoa(clase)
      return window.open(url,"_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=500").focus();
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
          }
        });
    },
    /*    calendarioAlumno() {
      alert("ES ALUMNO");
    },
    calendarioProfesor() {
      alert("ES PROFESOR");
    }, */
  },
};
</script>