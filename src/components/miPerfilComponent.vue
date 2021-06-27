<template>
  <div>
    <vue-headful :title="title" />
    <div class="container emp-profile">
      <form method="post">
        <div class="row">
          <div class="col-md-4">
            <div class="profile-img">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                alt=""
              />
              <div class="file btn btn-lg btn-primary">
                Change Photo
                <input type="file" name="file" />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="profile-head">
              <h5>
                {{ usuarioDatos.nombre }}
              </h5>
              <h6>
                {{ usuarioDatos.ou }}
              </h6>

              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                  <a
                    class="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                    >Acerca de</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-2">
            <input
              type="submit"
              class="profile-edit-btn"
              name="btnAddMore"
              value="Editar Perfil"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="profile-work">
              <div v-if="!profesor">
                <p>Mis Grupos</p>
                <span v-for="mat in materias.slice(0, 1)" :key="mat.id">
                  <a href="">{{ mat.idGrupo }}</a
                  ><br />
                </span>

                <p>Mis Materias</p>
                <span v-for="mat in materias" :key="mat.id">
                  <a href="">{{ mat.nombre }}</a
                  ><br />
                </span>

                
              </div>
              <div v-else>
                <p>Mis Grupos</p>
               <span v-for="mat in materias" :key="mat.id">
                  <a href="">{{ mat.idGrupo }}</a
                  ><br />
                </span>

                <p>Mis Materias</p>
                <span v-for="mat in materias" :key="mat.id">
                  <a href="">{{ mat.Materia }}</a
                  ><br />
                </span>

              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="tab-content profile-tab" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="row">
                  <div class="col-md-6">
                    <label>Usuario</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ usuarioDatos.username }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Nombre</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ usuarioDatos.nombre }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Email</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ usuarioDatos.email }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Telefono</label>
                  </div>
                  <div class="col-md-6 prueba">
                    <p
                      color="color:black"
                      data-placeholder="Introduce tu numero"
                    ></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label>Profesión</label>
                  </div>
                  <div class="col-md-6">
                    <p>{{ usuarioDatos.ou }}</p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "miPerfilComponent",
  components: {
    vueHeadful,
  },
  data() {
    return {
      title: "Mi Perfil",
      usuarioDatos: "",
      materias: "",
      profesor: false,
    };
  },
  mounted() {
    if (!localStorage.getItem("auth_token")) {
      this.$router.push("/login");
      this.flashMessage.show({
        status: "error",
        title: "Sitio",
        message: "Error , debes iniciar sesión",
      });
    } 
    this.cargarUsuarioData();
     
    
  },

  methods: {
    cargarUsuarioData() {
      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));

      if (usuario.ou === "Profesor") {
        this.profesor = true;
        this.profeData();
      } else {
        this.getMaterias();
      }

      axios
        .get(Global.urlBackOffice + "usuario?username=" + usuario.username)
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.usuarioDatos = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },

    getMaterias() {
      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
      axios
        .get(Global.urlSitio + "alumno?idAlumno=" + usuario.username)
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.materias = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    },
    profeData(){
       let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
        axios
        .get(
          Global.urlSitio + "profesor-grupo?idProfesor=" + usuario.username
        )
        .then((res) => {
          //console.log('servicios', res.status);
          if (res.status == 200) {
            this.materias = res.data;
          } else {
            alert("no se pudo conectar");
          }
        });
    }
  },
};
</script>

<style scoped>
</style>