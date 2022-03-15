<template>
  <div style="">
    <div class="login_cont">
      <div class="sidenav">
        <form>
          <img src="../assets/images/LogoFinal.png" alt="" />
          <h2>Inicio de sesión</h2>
          <div class="form-group">
            <label>Usuario</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ejemplo: 51818993"
            />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              class="form-control"
              placeholder="Contraseña"
            />
          </div>
          <button type="submit" class="btn session boxText_btn btn_login">
            Login
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
      this.$router.push("/home");
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
  width: 150px;
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
  .sidenav{
    width: 100%;
  }
}
</style>