
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
        <p @click='modificar=true'>Modificar <i class="fas fa-pencil"></i></p> 
        <p @click='modificar=false'>Cancelar <b class='fas' color="red">X</b> </p> 
        <p class="float-right" @click='dowloadPDF()'>Descargar <i class="fas fa-download">  </i></p> 
        <input type="submit" class="btn btn-primary  float-right" v-on:click='guardarLista()' value="Actualizar lista" v-if=modificar>
        <table class="table table-striped">
          <thead><!-- ../../assets/images/cruz_roja2.png -->
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
                <div class="form-check form-switch">
                  <input
                    v-if=modificar
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="alumno.idAlumno"
                    :checked="cargarAsistencia(alumno)"
                  />
                  <p v-else>{{alumno.asistencia}}</p>
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
      modificar:false,
    };
  },
  mounted() {
    this.cargarLista();
    $("#51717993").attr("checked", "checked");
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
     return alumno.asistencia=="Presente"?  true : false
    },
  },
};
</script>