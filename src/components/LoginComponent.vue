<template>
  <div>
    <div class="container">
      <div class="login-container">
        <div id="output"></div>
        <div class="avatar">
        </div>
        <div class="form-box">
          <form form name="form" id="form" v-on:submit.prevent="procesar()">
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

            <br>
           <input
          type="submit"
          value="Iniciar Sesion"
          title="Enviar"
          class="btn btn-primary"
        />
          </form>
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
    localStorage.clear();
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
        .catch((error) => {
          console.log(error);
          this.flashMessage.show({
            status: "error",
            title: "BackOffice",
            message: "Error , credenciales invalidas" + error,
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
  margin: 80px auto;
  padding: 20px 40px 40px;
  text-align: center;
  background: #1d1d1f;
  border: 1px solid rgb(0, 0, 0);
  border-radius:10px;

  -webkit-box-shadow: 10px 10px 22px 0px rgba(0,0,0,0.55);
  -moz-box-shadow: 10px 10px 22px 0px rgba(0,0,0,0.55);
  box-shadow: 10px 10px 22px 0px rgba(0,0,0,0.55);
}


.avatar {
  background:url(../assets/images/logoLogin.png);
  width: 100px;
  height: 100px;
  margin: 10px auto 30px;
  background-size: cover;
  
}
.letraslogin{
  text-align:left;
  margin-bottom:25px;
  color:white;
}

</style>