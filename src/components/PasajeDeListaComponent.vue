<template>
  <div class="contenedorDiv">
    <SectionLeft></SectionLeft>

    <vue-headful :title="title" />

    <div class="feed">
      <div class="feed_header linea_border_bottom">
        <h2>{{language.pasajeLista}}</h2>
      </div>
      <div class="spinerCont" v-if="loading">
        <img class="spinnerCSS" :src="spinner" />
      </div>
      <table class="table table-striped" @change="getList" v-else>
        <thead>
          <tr class="text-center">
            <th scope="col">&nbsp;</th>
            <th scope="col">{{language.cedula}}</th>
            <th scope="col">{{language.nombre}}</th>
            <th scope="col">{{language.asistencia}}</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="alumno in listadoUsuarios.Alumnos"
            :key="alumno.id"
            class="text-center"
          >
            <th scope="row">
              <img
                class="imagen_pasar_lista"
                :src="returnImgProfile(alumno.imagen_perfil)"
                alt=""
              />
            </th>
            <td>{{ alumno.idAlumnos }}</td>
            <td>{{ alumno.nombre }}</td>
            <td>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :id="alumno.idAlumnos"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <input
          v-if="!loading"
          class="boxText_btn"
          type="submit"
          v-on:click="pasarLista()"
          :value=language.pasarLista
        />
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
import language from "../assets/lang/pasajeDeLista.json";
export default {
  name: "pasaje-lista-component",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
  data() {
    return {
      title: "Pasar Lista",
      selectedRows: [],
      loading: true,
      spinner: Global.spinnerUrl,
      listadoUsuarios: {
        Profesor: "",
        Alumnos: "",
      },
      table: "",
      presentes: "",
      ausentes: "",
          lang: localStorage.getItem("lang"),
      language: "",
    };
  },
  mounted() {
    this.traerUsuarios();
    this.selectLanguage()
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
    verificarAsistencia() {
      let presentes = [];
      let ausentes = [];
      this.listadoUsuarios.Alumnos.forEach(function (valor) {
        if ($("#" + valor.idAlumnos).is(":checked")) {
          let a = valor.idAlumnos;
          presentes.push(a);
        } else {
          let a = valor.idAlumnos;
          ausentes.push(a);
        }
      });
      this.presentes = presentes;
      this.ausentes = ausentes;
    },
    getList(event) {
      return event;
    },
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
    traerUsuarios() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "listar-alumnos?idGrupo=" +
            this.$route.params.idGrupo +
            "&idMateria=" +
            this.$route.params.idMateria,
          config
        )
        .then((res) => {
          this.listadoUsuarios.Alumnos = res.data.Alumnos;
          this.listadoUsuarios.Profesor = res.data.Profesor;
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
    pasarLista() {
      this.verificarAsistencia();
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let lista = {
        idClase: this.$route.params.idClase,
        presentes : this.presentes,
        ausentes : this.ausentes
      }


    
      axios
        .post(Global.urlSitio + "lista-clase", lista, config)
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire(this.language.listaPublicada, "", "success");
             this.$router.back();
          }
          
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: this.language.errorPublicarLista,
          });
        });
    },
  },
};
</script>