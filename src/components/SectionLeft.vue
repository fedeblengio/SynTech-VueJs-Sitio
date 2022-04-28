<template>
  <div class="sidebar">
    <router-link
      v-if="usuarioPerfil.username == null"
      :to="{
        name: 'profile',
        params: {
          idUsuario: usuario.username,
        },
      }"
      style="text-decoration: none"
      class="router-link"
    >
      <div class="sidebarUser">
        <img id="profile_img" />
        <p>. . .</p>
      </div>
    </router-link>
    <router-link
      v-else
      :to="{
        name: 'profile',
        params: {
          idUsuario: usuarioPerfil.username,
        },
      }"
      style="text-decoration: none"
      class="router-link"
    >
      <div class="sidebarUser">
        <img id="profile_img" />
        <p>{{ usuarioPerfil.nombre }}</p>
      </div>
    </router-link>
    <div class="contenedor-sidebar">
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <router-link to="/home" class="router-link">
          <h2>Inicio</h2>
        </router-link>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-book"></i>
        <router-link to="/materias" class="router-link">
          <h2>Materias</h2>
        </router-link>
      </div>
      <div class="sidebarOption" v-if="profesor">
        <i class="fas fa-chalkboard-teacher"></i>

        <router-link to="/agenda-virtual" class="router-link">
          <h2>Agenda Virtual</h2>
        </router-link>
      </div>
      <div class="sidebarOption" v-else>
        <i class="fas fa-pen"></i>
        <router-link to="/calificaciones" class="router-link">
          <h2>Calificaciones</h2>
        </router-link>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-calendar"></i>
        <router-link to="/calendario" class="router-link">
          <h2>Calendario</h2>
        </router-link>
      </div>
    </div>
    <div class="sidebarClass">
      <h3>Mis Clases</h3>
      <div class="sidebarElement" v-if="loading">
        <span class="clases"> <span class="sidebarDot"></span> . . .</span>
      </div>
      <div
        class="sidebarElement"
        v-for="todo in traerMaterias"
        :key="todo.id"
        v-else
      >
        <router-link
          :to="{
            name: 'materia-seleccionada',
            params: {
              idGrupo: todo.idGrupo,
              idMateria: todo.idMateria,
              materia: todo.Materia,
            },
          }"
          style="text-decoration: none"
        >
          <span class="clases">
            <span class="sidebarDot"></span> {{ todo.idGrupo }} -
            {{ todo.Materia }}</span
          ></router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Global } from "../Global";
import axios from "axios";

export default {
  name: "SectionLeft",
  components: {},
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      traerMaterias: "",
      profesor: false,
      loading: true,
      usuarioPerfil: "",
      spinner: Global.spinnerUrl,
    };
  },
  mounted() {
    this.cargarInfoUser();
    if (this.usuario.ou == "Profesor") {
      this.profesor = true;
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }
    setTimeout(() => {
      document.getElementById("profile_img").src =
        "data:image/png;base64," + localStorage.getItem("perfil_img");
    }, 2000);

    /*   this.returnImgProfile(); */
  },
  methods: {
    cargarInfoUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "usuario?idUsuario=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.usuarioPerfil = res.data;
          }
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Parece que algo salio mal ...",
          });
        });
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
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          let timerInterval;
          this.$swal.fire({
            title: "Saliendo ...",
            html: "Parece que tu sesion ha finalizado !",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              this.$swal.showLoading();
              const b = this.$swal.getHtmlContainer().querySelector("b");
              timerInterval = setInterval(() => {
                b.textContent = this.$swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          });
          localStorage.clear();
          this.$router.push("/login");
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
          Global.urlSitio + "listarMaterias?idUsuario=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          let timerInterval;
          this.$swal.fire({
            title: "Saliendo ...",
            html: "Parece que tu sesion ha finalizado !",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              this.$swal.showLoading();
              const b = this.$swal.getHtmlContainer().querySelector("b");
              timerInterval = setInterval(() => {
                b.textContent = this.$swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          });
          localStorage.clear();
          this.$router.push("/login");
        });
    },
    /*     returnImgProfile() {
       let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "imagen-perfil?username=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            let img = res.data;
            document.getElementById('profile_img').src ="data:image/png;base64," + img;
          }
        });
   
    }, */
  },
};
</script>