<template>
  <div style="">
    <div class="login_cont">
      <div class="sidenav">
        <form form name="form" id="form" v-on:submit.prevent="procesar()">
          <img src="../assets/images/LogoFinal.png" alt="" />
          <h2>Inicio de sesión</h2>
          <div class="form-group">
            <label>Usuario</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ejemplo: 51818993"
              v-model="contacto.username"
            />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              class="form-control"
              placeholder="Contraseña"
              v-model="contacto.password"
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
      this.$swal.fire("Ya tienes una sesion iniciada", "", "success");
    } else {
      localStorage.clear();
    }
  },

  methods: {
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
            localStorage.setItem("perfil_img",url_imagen);
            this.$router.push("/home");
            location.reload();
          }
        })
       
    },
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
            this.cargarFoto(this.contacto.username , response.data.datos);
          }
        })
        .catch((res) => {
          if (res.status == 500) {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: "Servidor fuera de servicio",
            });
          } else {
            this.$swal.fire({
              icon: "error",
              title: "ERROR",
              text: "Credenciales Invalidas ...",
            });
          }
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