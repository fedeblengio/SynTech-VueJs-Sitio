
<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div id="feed" class="feed">
      <div class="feed_header">
        <h2>{{ language.lista }} {{ returnFechaLista() }}</h2>
      </div>
      <div class="div" v-if="loading">
        <center>
          <img class="spinnerCSS" :src="spinner" />
        </center>
      </div>
      <div class="feed" v-else>
        <div class="contPdf">
          <div class="btnpdf" style="cursor: pointer" v-if="!modificar">
            <p @click="modificar = true">
              {{ language.modificar }} <i class="fas fa-pencil"></i>
            </p>
          </div>

          <div v-if="!modificar">
            <p
              class="btnpdf float-right"
              @click="downloadPDF()"
              style="width: 115px; cursor: pointer; background-color: green"
            >
              {{ language.descargar }} <i class="fas fa-download"> </i>
            </p>
          </div>
        </div>
        <div class="pdfContSegundo">
          <div class="btnpdf btncheck" style="background: red" v-if="modificar">
            <p @click="modificar = false">{{ language.cancelar }}</p>
          </div>
          <div v-if="modificar">
            <p
              class="btnpdf btncheck"
              type="submit"
              v-on:click="actualizarLista()"
              style="background: green"
            >
              {{ language.actualizar }}
            </p>
          </div>
        </div>

        <table class="table table-striped" id="my-table">
          <thead>
            <tr class="text-center">
              <th scope="col">&nbsp;</th>
              <th scope="col">{{ language.cedula }}</th>
              <th scope="col">{{ language.nombre }}</th>
              <th scope="col">{{ language.asistencia }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in listado" :key="alumno.id" class="text-center">
              <th scope="row">
                <img
                  class="imagen_pasar_lista"
                  :src="returnImgProfile(alumno.imagen_perfil)"
                  alt=""
                />
              </th>
              <td>{{ alumno.idAlumno }}</td>
              <td>{{ alumno.nombre }}</td>

              <td>
                <div class="form-check form-switch mr-4">
                  <input
                    v-if="modificar"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="alumno.idAlumno"
                    :checked="cargarAsistencia(alumno)"
                  />
                  <p v-else>
                    <i :class="tickOrCross(alumno)"></i>
                  </p>
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
import jsPDF from "jspdf";
import moment from "moment";
import language from "../assets/lang/PDF.json";

import "jspdf-autotable";
export default {
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
        usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      listado: "",
      title: "",
      loading: true,
      spinner: Global.spinnerUrl,
      modificar: false,
      presentes: "",
      ausentes: "",
      lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    if (this.usuario.ou == "Alumno") {
      this.$router.push("/home");
    }
    this.cargarLista();
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
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
    returnFechaLista() {
      return moment(this.$route.params.fecha)
        .locale(this.lang)
        .format("MMMM Do YYYY, h:mm a");
    },
    cargarLista() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "agenda-clase/" +
            this.$route.params.idClase+"/asistencia",
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listado = res.data;
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
    cargarAsistencia(alumno) {
      return alumno.asistencia == "Presente" ? true : false;
    },
    tickOrCross(alumno) {
      return alumno.asistencia == "Presente"
        ? "fas fa-check green"
        : "fas fa-times red";
    },
    verificarAsistencia() {
      let presentes = [];
      let ausentes = [];
      this.listado.forEach(function (valor) {
        if ($("#" + valor.idAlumno).is(":checked")) {
          let a = valor.idAlumno;
          presentes.push(a);
        } else {
          let a = valor.idAlumno;
          ausentes.push(a);
        }
      });
      this.presentes = presentes;
      this.ausentes = ausentes;
    },
    actualizarLista() {
      this.verificarAsistencia();
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let data = {
        idClase: this.$route.params.idClase,
        presentes: this.presentes,
        ausentes: this.ausentes,
      };
      axios
        .put(Global.urlSitio + "agenda-clase/"+this.$route.params.idClase+"/asistencia", data, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.listaActualizada,"", "success");
            this.cargarLista();
            this.modificar = false;
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

    downloadPDF() {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      let materia_fecha =
        this.$route.params.materia +
        " " +
        moment(this.$route.params.fecha).format("DD/MM/YYYY h:mm a");

      let bodyAlumnos = [];

      for (let i = 0; i < this.listado.length; i++) {
        let array = [];
        if (this.lang == "es") {
          array = [
            this.listado[i].idAlumno,
            this.listado[i].nombre,
            this.listado[i].asistencia,
          ];
        } else {
          if (this.listado[i].asistencia == "Presente") {
            array = [
              this.listado[i].idAlumno,
              this.listado[i].nombre,
              "Present",
            ];
          } else {
            array = [
              this.listado[i].idAlumno,
              this.listado[i].nombre,
              "Absent",
            ];
          }
        }
        bodyAlumnos.push(array);
      }
      doc.setFontSize(16).text(materia_fecha, 0.5, 1.0);
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);

      doc.autoTable({
        head: [
          [
            this.language.cedula,
            this.language.nombre,
            this.language.asistencia,
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

<style scoped>
.red {
  color: red;
}
.green {
  color: green;
}
</style>