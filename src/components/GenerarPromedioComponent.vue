<template>
  <div class="contenedorDiv">
     <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div
        class="feed_header"
        style="border-bottom: 1px solid var(--background); margin-bottom: 10px"
      >
        <h2>{{ language.titulo }}</h2>
      </div>
      <div class="alert alert-primary" role="alert">
        {{ language.info }}
      </div>
      <div class="GenerarCont" style="width: 95%; margin: 0 auto">
        <p>
          {{ language.listaAlumno }}
        </p>

        <button
          v-if="loading"
          class="btnGenerar"
          style="background-color: grey"
          @click="downloadPDF()"
        >
          {{ language.descargar }}
        </button>
        <button v-else class="btnGenerar" @click="downloadPDF()">
          {{ language.descargar }}
        </button>
      </div>

      <div style="margin-top: 10px; text-align: center">
        <table class="table">
          <thead>
            <tr>
              <td>{{ language.cedula }}</td>
              <td>{{ language.nombre }}</td>

              <td>{{ language.asis }}</td>
              <td>{{ language.promedio }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="promedio in traerPromedios" :key="promedio.id">
              <td>{{ promedio.idAlumnos }}</td>
              <td>{{ promedio.nombreAlumno }}</td>

              <td>{{ promedio.porcentajeFaltas }}</td>
              <td class="greenA" v-if="promedio.promedio >= 7">
                {{ promedio.promedio }}
              </td>
              <td class="redA" v-else>{{ promedio.promedio }}</td>
            </tr>
          </tbody>
        </table>
        <div class="spinerCont" v-if="loading">
          <img :src="spinner" class="spinnerCSS" />
        </div>
      </div>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
import axios from "axios";
import language from "../assets/lang/generarPromedio.json";
import { Global } from "../Global";
import jsPDF from "jspdf";
import moment from "moment";
export default {
  name: "error-component",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful
  },
  data() {
    return {
      title: "",
      language: "",
      traerPromedios: "",
      lang: localStorage.getItem("lang"),
      spinner: Global.spinnerUrl,
      loading: true,
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
    };
  },
  mounted() {
    if (this.usuario.ou == "Alumno") {
      this.$router.push("/home");
    }
    this.selectLanguage();
    this.traerPromedio();
  },
  methods: {
    traerPromedio() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
      .get(Global.urlSitio+ "grupo/"+this.$route.params.idGrupo+"/materia/"+this.$route.params.idMateria+"/promedio", config)
    
        .then((res) => {
          if (res.status == 200) {
            this.traerPromedios = res.data;
            this.loading = false;
          }
        });
    },
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
        
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },

    downloadPDF() {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      let materia_fecha =
        this.language.promediosDe +
        " " +
        this.$route.params.Materia +
        " " +
        moment().format("DD/MM/YYYY h:mm a");

      let bodyAlumnos = [];

      for (let i = 0; i < this.traerPromedios.length; i++) {
        let array = [];

        let aprobado;
        if (this.traerPromedios[i].promedio >= 7) {
          aprobado = this.language.aprobado;
        } else {
          aprobado = this.language.reprobado;
        }
        array = [
          this.traerPromedios[i].idAlumnos,
          this.traerPromedios[i].nombreAlumno,
          this.traerPromedios[i].promedio,
          this.traerPromedios[i].porcentajeFaltas,
          aprobado,
        ];

        bodyAlumnos.push(array);
      }
      doc.setFontSize(16).text(materia_fecha, 0.5, 1.0);
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);

      doc.autoTable({
        head: [
          [
            this.language.cedula,
            this.language.nombre,
            this.language.promedio,
            this.language.asis,
            this.language.aprobado,
          ],
        ],
        body: bodyAlumnos,
        margin: { left: 0.5, top: 1.25 },
      });
     
      doc.save(materia_fecha + ".pdf");
    },
  },
};
</script>

<style>
</style>