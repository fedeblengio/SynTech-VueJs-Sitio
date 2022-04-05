
<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>Lista</h2>
      </div>
      <div class="div" v-if="loading">
        <center>
          <img class="spinnerCSS" :src="spinner" />
        </center>
      </div>
      <div class="feed" v-else>
        <p @click="modificar = true">Modificar <i class="fas fa-pencil"></i></p>
        <p @click="modificar = false">
          Cancelar <b class="fas" color="red">X</b>
        </p>
        <p class="float-right" @click="downloadPDF()">
          Descargar <i class="fas fa-download"> </i>
        </p>
        <input
          type="submit"
          class="btn btn-primary float-right"
          v-on:click="actualizarLista()"
          value="Actualizar lista"
          v-if="modificar"
        />

        <table class="table table-striped">
          <thead>
            <tr class="text-center">
              <th scope="col">&nbsp;</th>
              <th scope="col">Cedula</th>
              <th scope="col">Nombre</th>
              <th scope="col">Asistencia</th>
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
export default {
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      listado: "",
      title: "Registro Listas",
      loading: true,
      spinner: Global.spinnerUrl,
      modificar: false,
      presentes: "",
      ausentes: "",
    };
  },
  mounted() {
    this.cargarLista();
  },
  methods: {
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
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
            "registro-clase?idClase=" +
            this.$route.params.idClase,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.listado = res.data;
          }

          this.loading = false;
        });
    },
    cargarAsistencia(alumno) {
      return alumno.asistencia == "Presente" ? true : false;
    },   
    tickOrCross(alumno){
      return alumno.asistencia == "Presente" ? "fas fa-check green" : "fas fa-times red";
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
        "idClase": this.$route.params.idClase,
        "presentes": this.presentes,
        "ausentes": this.ausentes,
      };
 
      axios
        .put(Global.urlSitio + "lista-clase", data, config)
        .then((response) => {
    
          if (response.status == 200) {
            
            this.$swal.fire("Lista Actualizada", "", "success");
            this.cargarLista();
            this.modificar =false;
          }
        })
        .catch(() => {
        
          this.$swal.fire("Error al actualizar", "", "error");
        });
    },

    downloadPDF() {},
  },
};
</script>

<style scoped>

.red{
  color: red;
}
.green{
  color: green;
}
</style>