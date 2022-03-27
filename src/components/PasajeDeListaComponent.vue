<template>
  <div class="contenedorDiv">
    <SectionLeft></SectionLeft>

    <vue-headful :title="title" />
    <div class="feed">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Cedula</th>
            <th scope="col">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alumno in listadoUsuarios.Alumnos" :key="alumno.id">
            <th scope="row">
              <img
                style="width: 35px; height: 35px"
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
                  id="flexSwitchCheckDefault"
                />
              </div>
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
/* import JQuery from "jquery"; */
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
    };
  },
  mounted() {
    this.traerUsuarios();
  },
  methods: {
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
        .get(Global.urlSitio + "listar-alumnos?idGrupo=TB1&idMateria=2", config)
        .then((res) => {
          this.listadoUsuarios.Alumnos = res.data.Alumnos;
          this.listadoUsuarios.Profesor = res.data.Profesor;
          this.loading = false;
        });
    },
  },
};
</script>