<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>{{language.cambiarContra}}</h2>
      </div>

      <div class="cambioPwdContenedor">
        <div class="alert alert-secondary" role="alert">
          {{language.avisoContra}}
        </div>
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
          v-if="camposVacios && password.actual == ''"
        >
         {{language.inputVacio1}}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            v-on:click="camposVacios = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="inputsPwd">
          <span>{{language.contraActual}} <em>*</em></span>
          <input
            type="password"
            id="password"
            required
            autocomplete="off"
            v-model="password.actual"
          />
          <i
            class="fas fa-eye"
            id="iconPwd"
            v-on:click="mostrarContasenia()"
          ></i>
        </div>
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
          v-if="camposVacios && password.nueva == ''"
        >
         {{language.inputVacio2}}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            v-on:click="camposVacios = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="inputsPwd">
          <span>{{language.nuevaContra}} <em>*</em></span>
          <input
            type="password"
            id="password2"
            required
            minlength="8"
            maxlength="30"
            autocomplete="off"
            v-model="password.nueva"
          />
        </div>
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
          v-if="camposVacios && password.confirmacion == ''"
        >
         {{language.inputVacio3}}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            v-on:click="camposVacios = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="inputsPwd">
          <span>{{language.confirmarContra}} <em>*</em></span>
          <input
            type="password"
            id="password1"
            required
            minlength="8"
            maxlength="30"
            autocomplete="off"
            v-model="password.confirmacion"
          />
        </div>
        <div class="cambioPwdBtn">
          <button class="boxText_btn" v-on:click="verificarContraseniaActual()">
           {{language.btnEnviar}}
          </button>
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
import language from "../assets/lang/cambiarContra.json";
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
      title: "",
      usuario: JSON.parse(window.atob(localStorage.getItem("auth_token"))),
      aux: 0,
      password: {
        actual: "",
        nueva: "",
        confirmacion: "",
      },
      camposVacios: false,
         lang: localStorage.getItem("lang"),
      language: ""
    };
  },
  mounted() {
    this.selectLanguage();
  },

  methods: {
        selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title =  this.language.title;
    },
    comprobarCamposVacios(input1, input2, input3) {
      return input1.length == 0 || input2.length == 0 || input3.length == 0;
    },
    verificarContraseniaActual() {
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let userActual = {
        username: this.usuario.username,
        password: this.password.actual,
      };
      this.camposVacios = this.comprobarCamposVacios(
        this.password.actual,
        this.password.nueva,
        this.password.confirmacion
      );
      if (!this.camposVacios) {
        axios
          .post(Global.urlBackOffice + "login", userActual, config)
          .then((response) => {
            if (response.status == 200) {
              this.procesar();
            }
          })
          .catch(() => {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: this.language.contraIncorrecta,
            });
          });
      }
    },
    mostrarContasenia() {
      let input = document.getElementById("password1");
      let input1 = document.getElementById("password");
      let input2 = document.getElementById("password2");
      let icono = document.getElementById("iconPwd");

      if (this.aux == 0) {
        icono.classList.add("fa-eye-slash");
        icono.classList.remove("fa-eye");
        this.aux = 1;
        input.attributes["type"].value = "text";
        input1.attributes["type"].value = "text";
        input2.attributes["type"].value = "text";
      } else {
        icono.classList.remove("fa-eye-slash");
        icono.classList.add("fa-eye");
        this.aux = 0;
        input.attributes["type"].value = "password";
        input1.attributes["type"].value = "password";
        input2.attributes["type"].value = "password";
      }
    },
    procesar() {
      if (this.password.nueva === this.password.confirmacion) {
        this.cambiarContrasenia();
      } else {
        this.$swal.fire({
          icon: "error",
          title: "ERROR",
          text: this.language.contraNoCoinciden,
        });
      }
    },
    cambiarContrasenia() {
      let parametros = {
        username: this.usuario.username,
        newPassword: this.password.nueva,
      };
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .put(Global.urlSitio + "usuario", parametros, config)
        .then((response) => {
          if (response.status == 200) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("perfil_img");
            localStorage.removeItem("logged");
            this.$router.push("/login");
            this.$swal.fire(
            this.language.contraCambiada,
              "",
              "success"
            );
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
  },
};
</script>
