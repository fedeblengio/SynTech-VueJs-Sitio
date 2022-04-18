<template>
  <div class="contenedorDiv">
    <SectionLeft></SectionLeft>

    <vue-headful :title="title" />
    <div class="feed">
      <table class="table table-striped" @change="getList">
        <thead>
          <tr class="text-center">
            <th scope="col">&nbsp;</th>
            <th scope="col">Cedula</th>
            <th scope="col">Nombre</th>
            <th scope="col">Asistencia</th>
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
          class="boxText_btn"
          type="submit"
          v-on:click="pasarLista()"
          value="Pasar Lista"
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
    };
  },
  mounted() {
    this.traerUsuarios();
  },
  methods: {
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
        })  .catch(() => {
          this.$swal.fire(
            "ERROR : Parece que algo salio mal ...",
            "",
            "error"
          );
        });
    },
    pasarLista() {
      this.verificarAsistencia();
      let config = {
        headers: {
          "Content-Type": "form-data",
          token: Global.token,
        },
      };
  
      let formdata = new FormData();
      formdata.append("idClase", this.$route.params.idClase);
      formdata.append("presentes", this.presentes);
      formdata.append("ausentes", this.ausentes);
    
      axios
        .post(Global.urlSitio + "lista-clase", formdata, config)
        .then((response) => {
          if (response.status == 200) {
           this.$swal.fire(
            "Lista publicada",
            "",
            "success"
          );
          }
        })
         .catch(() => {
          this.$swal.fire(
            "ERROR : Parece que algo salio mal ...",
            "",
            "error"
          );
        });
    },
  },
};
</script>