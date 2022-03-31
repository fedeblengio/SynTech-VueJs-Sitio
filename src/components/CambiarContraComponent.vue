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
        <div class="inputsPwd">
          <span>Actual contraseña</span>
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
        <div class="inputsPwd">
          <span>Nueva contraseña</span>
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
        <div class="inputsPwd">
          <span>Confirmar contraseña</span>
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
    };
  },
  mounted() {},
  methods: {
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
      axios
        .post(Global.urlBackOffice + "login", userActual, config)
        .then((response) => {
          if (response.status == 200) {
            this.procesar();
          }
        })
        .catch(() => {
          this.$swal.fire(
            "ERROR : La constraseña actual es incorrecta",
            "",
            "error"
          );
        });
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
        this.$swal.fire(
          "ERROR : Las contraseñas ingresadas no coinciden",
          "",
          "error"
        );
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
          this.$swal.fire(
            "",
            "",
            "error"
          );
          let timerInterval;
           this.$swal.fire({
            title: "Oops !",
            html: "Error Inesperado al intentar cambiar la contraseña",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
               this.$swal.showLoading();
              const b =  this.$swal.getHtmlContainer().querySelector("b");
              timerInterval = setInterval(() => {
                b.textContent =  this.$swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          })
        });
    },
  },
};
</script>
