<template>
  <div class="sidebar">
    <!-- <router-link
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
        <img :src="returnImgB64()" />
        <p id="nameUser">{{ usuario.nombre }}</p>
      </div>
    </router-link>
    <div class="sidebarClass" style="margin-left:20px !important">
      <h3>{{ language.misGrupos }}</h3>

      <div class="sidebarElement" v-if="loading">
        <span class="clases"> <span class="sidebarDot"></span> . . .</span>
      </div>
      <div v-else>
        <span class="d-flex" v-if="!changeGroup">
          <input
            type="text"
            class="form-control"
            disabled
            :value="localStorageGroup"
          />
          <i class="fas fa-pencil icon" @click="changeGroup = true"></i>
        </span>
        <span v-else class="d-flex">
          <select
            v-on:change="cambiarGrupo()"
            class="form-control"
            v-model="selectedGroup"
            required
            id="group-select"
          >
            <option
              v-for="todo in groupNames"
              :key="todo.ids"
              :id="todo"
              v-bind:value="todo"
            >
              {{ todo }}
            </option>
          </select>
          <i class="fas fa-times icon" @click="changeGroup = false"></i>
        </span>
      </div>
    </div> -->

 
  </div>
</template>
<script>
import { Global } from "../Global";
import axios from "axios";
import language from "../assets/lang/sectionLeft.json";
export default {
  name: "SectionLeft",
  components: {},
  data() {
    return {
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
  
      profesor: false,
      loading: true,
      lang: localStorage.getItem("lang"),
      language: "",
      spinner: Global.spinnerUrl,
      selectedGroup: "",
      changeGroup: false,
      grupos: "",
      groupNames: [],
      localStorageGroup: localStorage.getItem("idGrupo"),
    };
  },
  mounted() {
    // this.traerGrupo();
    // if (this.usuario.ou == "Profesor") {
    //   this.profesor = true;
    // }

    // this.selectLanguage();
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
    },
    returnImgB64() {
      return "data:image/png;base64," + localStorage.getItem("perfil_img");
    },
    traerGrupo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      axios
        .get(
          Global.urlSitio + "usuario/" + this.usuario.username + "/grupo",
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.grupos = res.data;
            this.groupNames = this.getNotDuplicatedNames(res.data);
            if (localStorage.getItem("idGrupo")) {
              this.selectedGroup = localStorage.getItem("idGrupo");
              this.localStorageGroup = localStorage.getItem("idGrupo");
            } else {
              this.selectedGroup = this.groupNames[0];
              this.localStorageGroup = this.groupNames[0];
              localStorage.setItem("idGrupo", this.groupNames[0]);
            }
            this.traerMateriasUser(this.selectedGroup);
          }
        })
    },

    getNotDuplicatedNames(groups) {
      let names = [];
      for (let g of groups) {
        if (!names.includes(g.idGrupo)) {
          names.push(g.idGrupo);
        }
      }
      return names;
    },
    cambiarGrupo() {
      localStorage.setItem("idGrupo", this.selectedGroup);
      this.localStorageGroup = this.selectedGroup;
      this.$router.push({ name: "home" });

      location.reload();
    },

    traerMateriasUser(grupo) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "grupo/" +
            grupo +
            "/materia" +
            "?idUsuario=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
            this.loading = false;
          }
        })
        .catch(() => {
          let timerInterval;
          this.$swal.fire({
            title: this.language.tituloTokenExpirado,
            html: this.language.tokenExpirado,
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              this.$swal.showLoading();
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          });
          localStorage.removeItem("auth_token");
          localStorage.removeItem("perfil_img");
          localStorage.removeItem("logged");
          localStorage.removeItem("idGrupo");
          this.$router.push("/login");
        });
    },
  },
};
</script>

<style scoped>
.icon {
  padding: 10px;
}
</style>