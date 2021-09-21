<template>
  <div
    class="contenedor_login"
    style="
      background-attachment: fixed;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    "
  >
    <div class="login-container">
      <div id="output"></div>
      <div class="avatar"></div>
      <div class="form-box">
        <form form name="form" id="form" v-on:submit.prevent="procesar()" class="form">
          <p class="letraslogin">
            Documento:
            <input
              type="text"
              name="username"
              placeholder="Documento"
              class="form-control"
              v-model="contacto.username"
            />
          </p>

          <p class="letraslogin">
            Contraseña:

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              class="form-control"
              v-model="contacto.password"
            />
          </p>

          <br />
          <input
            type="submit"
            value="Iniciar Sesion"
            title="Enviar"
            class="session"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "LoginComponent",
  data() {
    return {
      contacto: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {
    if (localStorage.getItem("auth_token")) {
      this.$router.push("/misMaterias");
      this.flashMessage.show({
        status: "success",
        title: Global.tituloSitio,
        message: "Ya has iniciado sesión",
      });
    } else {
      localStorage.clear();
    }
  },

  methods: {
    procesar() {
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(Global.urlBackOffice + "login", this.contacto, config)
        .then((response) => {
          if (response.status == 200) {
            localStorage.setItem("auth_token", response.data.datos);
            this.$router.push("/home");
            location.reload();
          }
        })
        .catch(() => {
          this.flashMessage.show({
            status: "error",
            title: Global.tituloSitio,
            message: "Error, credenciales invalidas",
          });
          document.form.reset();
        });
    },
  },
};
</script>

<style>
.login-container {
  position: relative;
  width: 300px;
  margin: 150px auto;
  padding: 20px 40px 40px;
  text-align: center;
  background: #3a4f6b;
 
  border-radius: 10px;

  -webkit-box-shadow: 10px 10px 22px 0px rgba(0, 0, 0, 0.55);
  -moz-box-shadow: 10px 10px 22px 0px rgba(0, 0, 0, 0.55);
  box-shadow: 10px 10px 22px 0px rgba(0, 0, 0, 0.55);
}

.contenedor_login {
  position: absolute;
  width: 100%;
  height: 100%;
  background:url(../assets/images/lines.jpg);
}
.avatar {
  background: url(../assets/images/logoLogin.png);
  width: 100px;
  height: 100px;
  margin: 10px auto 30px;
  background-size: cover;
}
.letraslogin {
  text-align: left;
  margin-bottom: 25px;
  color: white;
}
.letraslogin input{
  width:100%;
  height:32px;
}
.session{
  height:40px;
  width:45%;
  
}
</style>