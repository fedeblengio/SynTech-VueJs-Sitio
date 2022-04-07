<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed" v-if="loading">
      <div class="feed_header linea_border_bottom">
        <h2>Informacion Personal</h2>
      </div>
      <div class="spinerCont" >
        <img :src="spinner" class="spinnerCSS" />
      </div>
    </div>
    <div class="feed" v-else>
      <div class="feed_header linea_border_bottom">
        <h2>Informacion Personal</h2>
      </div>
    
      <div class="boxText" style="border-bottom: none" >
        <div class="imgProfile">
          <div class="imgContenedorProfile">
            <img :src="returnImgProfile()" />
            <div class="textImg">
              <h3>{{ usuario.nombre }}</h3>

              <div class="image-upload">
                <label for="file-input">
                  <h4>Cambiar foto</h4>
                </label>

                <input
                  @change="getFile"
                  id="file-input"
                  type="file"
                  style="display: none"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="contenedorPerfil">
          <h5>Tipo de Usuario:</h5>
          <div class="tipoDeUser">
            <div class="contenidoUser" id="profesor">
              <h4>Profesor</h4>
              <i class="fal fa-chalkboard-teacher"></i>
            </div>
            <div class="contenidoUser" id="alumno">
              <h4>Alumno</h4>
              <i class="fal fa-users-class"></i>
            </div>
          </div>

          <div class="infoUserContenedor">
            <div class="infoUser">
              <span>CI:</span>
               <input type="text" class="form-control" :value=usuario.username disabled>
            
            </div>
            <div class="infoUser">
              <span>Grupo:</span>
              <input type="text" class="form-control" :value=nombreGrupo disabled>
            </div>
            <div class="infoUser">
              <span>Email:</span>
                  <div class="input-group mb-3" v-if='!modficarE'>
                 <input type="text" class="form-control"  v-if='usuario.email==null' :value=defaultEmail disabled>
                 <input type="text" class="form-control" v-else :value=usuario.email disabled>
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click='modficarE=true'><i class="fas fa-pencil"></i></button>
                  </div>
              </div>   
                <div class="input-group mb-3" v-else>
              <input type="text" class="form-control"  placeholder="Ejemplo: micorreo@gmail.com" v-model="newEmail">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button pr-3" @click='modificarE(usuario)'><i class="fas fa-check "></i> </button>
                    <button class="btn btn-outline-secondary" type="button" @click='modficarE=false'><i class="fas fa-times"></i></button>
                  </div>
              </div> 
            </div>
            <div class="infoUser">
              <span>Genero:</span>
              <div class="input-group mb-3" v-if='!modficarG'>
              <input type="text" class="form-control" v-if='usuario.genero==null' :value=defaultGenero disabled>
               <input type="text" class="form-control" v-else :value=usuario.genero disabled>
                  <div class="input-group-append">
                   <button class="btn btn-outline-secondary" type="button" @click='modficarG=true'><i class="fas fa-pencil"></i></button>
                  </div>
              </div>     
              <div class="input-group mb-3" v-else>
                  <input type="text" class="form-control"  placeholder="Ejemplo: Helicoptero Apache H-21" v-model="newGenero">
                  <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button pr-3" @click='modificarG(usuario)'><i class="fas fa-check "></i> </button>
                    <button class="btn btn-outline-secondary" type="button" @click='modficarG=false'><i class="fas fa-times"></i></button>
                  </div>
              </div>           
            </div>
          </div>

          <router-link to="/cambioPwd"> cambiar contraseña </router-link>
        </div>
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
      traerMaterias: "",
      nombreGrupo: "",
      loading: true,
      spinner: Global.spinnerUrl,
      modficarE:false,
      modficarG:false,
      newEmail: "",
      newGenero: "",
      defaultGenero: "Ingresar Genero",
      defaultEmail: "Ingresar Email",
      
    };
  },
  mounted() {
   
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }
      
    
  },
  methods: {
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;
      if (res <= 50) {
        this.cambiarFoto(event.target.files[0]);
      } else {
        alert("El tamaño del archivo excede el límite máximo permitido");
      }
    },
    modificarE(usuario){
        alert(usuario.nombre)
    },
    modificarG(usuario){
   alert(usuario.nombre)
    },
    cambiarFoto(foto) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();

      formData.append("idUsuario", this.usuario.username);
      formData.append("archivo", foto);

      axios
        .post(Global.urlSitio + "imagen-perfil", formData, config)
        .then((res) => {
          if (res.status == 200) {
            /* this.cargarFoto() */
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Foto cambiada correctamente",
            });
          }
        });
    },
    returnImgProfile() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    tipoDeUser() {
      let profesor = document.getElementById("profesor");
      let alumno = document.getElementById("alumno");

      if (this.usuario.ou == "Profesor") {
        profesor.classList.add("background-profile-active");
        alumno.classList.add("background-profile-disable");
      } else {
        alumno.classList.add("background-profile-active");
        profesor.classList.add("background-profile-disable");
      }
    },

    traerGrupoProfesor() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "profesor-grupo?idProfesor=" +
            this.$route.params.idUsuario,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.nombreGrupo = res.data[0].nombreCompleto;
            this.loading = false;
          }
          
          setTimeout(() => { this.tipoDeUser(); }, 100);
        });
    },
    traerMateriasUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "listarMaterias?idUsuario=" +
            this.$route.params.idUsuario,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.nombreGrupo = res.data[0].nombreCompleto;
            this.loading = false;
          }
           setTimeout(() => { this.tipoDeUser(); }, 100);
        });
    },
  },
};
</script>

<style scoped>
.background-profile-active {
  background: #E9ECEF;
}
.background-profile-disable {
  opacity: 0.9;
}
</style>>