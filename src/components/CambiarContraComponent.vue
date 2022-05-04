<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>

    <div class="feed">
      <div class="feed_header">
        <h2>Cambio contraseña</h2>
      </div>

      <div class="cambioPwdContenedor">
        <div class="alert alert-secondary" role="alert">
          Estas a punto de cambiar la contraseña de acceso, asegurate de
          recordarla
        </div>
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
          v-if="camposVacios && password.actual == ''"
        >
          Debes ingresar tu contraseña actual
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
          <span>Actual contraseña <em>*</em></span>
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
         Debes ingresar una contraseña nueva
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
          <span>Nueva contraseña <em>*</em></span>
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
          Debes repetir la contraseña ingresada previamente
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
          <span>Confirmar contraseña <em>*</em></span>
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
            Enviar
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
      aux: 0,
      password: {
        actual: "",
        nueva: "",
        confirmacion: "",
      },
      camposVacios: false,
    };
  },
  mounted() {},
  methods: {
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
              text: "La constraseña actual es incorrecta ...",
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
              text: "Las contraseñas ingresadas no coinciden ...",
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
            localStorage.clear();
            this.$router.push("/login");
            this.$swal.fire(
              "Contraseña actualizada correctamente",
              "",
              "success"
            );
          }
        })
        .catch(() => {
             this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: "Hubo un error al intentar actualizar su contraseña ...",
            });
        });
    },
  },
};
</script>
