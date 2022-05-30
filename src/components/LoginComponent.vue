<template>
  <div style="">
    <div class="login_cont">
      <div class="sidenav">
        <form form name="form" id="form" v-on:submit.prevent="procesar()">
          <img src="../assets/images/LogoFinal.png" alt="" />
          <h2>{{language.inicioSesion}}</h2>

          <div class="form-group">
            <div
              v-if="camposVacios"
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              <strong>Oops..</strong> {{language.inputVacio1}}
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
            <label>{{language.usuario}}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="language.placeholderUsuario"
              v-model="contacto.username"
            />
          </div>
          <div class="form-group">
            <label>{{language.contrasenia}}</label>
            <input
              type="password"
              class="form-control"
              :placeholder="language.placeholderContrasenia"
              v-model="contacto.password"
            />
          </div>
                <div class="events_icon">
        <i v-if="lang == 'es'" v-on:click="changeLanguage()"
          ><country-flag country="es" size="normal" style="margin-top: -4px"
        /></i>
        <i v-else v-on:click="changeLanguage()"
          ><country-flag country="gb" size="normal" style="margin-top: -4px"
        /></i>
      </div>
          <button type="submit" class="btn session boxText_btn btn_login">
            {{language.entrar}}
          </button>
        </form>
      </div>
      <div class="login_inputs">
        <div class="login-img">
          <img src="../assets/images/background_login.jpg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
import language from "../assets/lang/login.json";
import CountryFlag from "vue-country-flag";
export default {
  name: "LoginComponent",
   components: {
    CountryFlag
  },
  data() {
    return {
      contacto: {
        username: "",
        password: "",
           
      },
       lang: localStorage.getItem("lang"),
      language: "",
      camposVacios: false,
    };
  },
  mounted() {
       this.selectLanguage();
    if (localStorage.getItem("auth_token")) {
      this.$router.push("/home");
      this.$swal.fire(this.language.yaTienesUnaSesion, "", "success");
    } else {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("perfil_img");
      localStorage.removeItem("logged");
    }
    if (localStorage.getItem("lang") == null) {
      localStorage.setItem("lang", "es");
    }
  },

  methods: {
        changeLanguage() {
      if (this.lang == "es") {
        localStorage.setItem("lang", "en");
        location.reload();
      } else {
        localStorage.setItem("lang", "es");
        location.reload();
      }
    },
      selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },
    verificarCamposVacios(input1, input2) {
      return input1.length == 0 || input2.length == 0;
    },
    cargarFoto(username, token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      };

      axios
        .get(Global.urlSitio + "imagen-perfil?username=" + username, config)
        .then((res) => {
          if (res.status == 200) {
            let url_imagen = res.data;
            localStorage.setItem("perfil_img", url_imagen);
            this.$router.push("/home");
            location.reload();
          }
        });
    },
    procesar() {
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.camposVacios = this.verificarCamposVacios(
        this.contacto.username,
        this.contacto.password
      );

      if (!this.camposVacios) {
        this.camposVacios = false;
        axios
          .post(Global.urlSitio + "login", this.contacto, config)
          .then((response) => {
            if (response.status == 200) {
              localStorage.setItem("auth_token", response.data.datos);
              this.cargarFoto(this.contacto.username, response.data.datos);
            }
          })
          .catch(() => {
      
              this.$swal.fire({
                icon: "error",
                title: "ERROR",
                text: this.language.credencialesInvalidas,
              });
            
          });
      }
    },
  },
};
</script>

<style>
.login_cont {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.sidenav {
  background-color: white;
  width: 40%;
  display: flex;
  justify-content: center;
}
.login_inputs {
  height: 100vh;
}
.login-img img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.sidenav form {
  margin: auto;
}
form h2 {
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 30px;
}
form img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  width: 170px;
  height: 150px;
}
.form-group {
  width: 300px !important;
}
.btn_login {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}
@media screen and (max-width: 1000px) {
  .login-img img {
    display: none;
  }
  .sidenav {
    width: 100%;
  }
}
</style>