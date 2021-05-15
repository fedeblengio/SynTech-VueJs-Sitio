<template>
  <div>
    <h1>Ingresa tus datos para acceder</h1>

    <div class="container p-3 my-3 border">
      <form name="form" id="form" v-on:submit.prevent="procesar()">
        <p>
          Documento:
          <input
            type="text"
            name="username"
            placeholder="Documento"
            class="form-control"
            v-model="contacto.username"
          />
        </p>
        <p>
          Contraseña:
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            class="form-control"
            v-model="contacto.password"
          />
        </p>

        <hr />
        <input
          type="submit"
          value="Enviar"
          title="Enviar"
          class="btn btn-primary"
        />
      </form>
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
  methods: {
    procesar() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .post(Global.url + "login", this.contacto, config)
        .then((response) => {
          if (response.status == 200) {
            // console.log(response.data);
          /*   this.flashMessage.show({
              status: "success",
              title: "BackOffice",
              message: "Te has logueado exitosamente!!!.",
            }); */

            localStorage.setItem("auth_token", response.data.token);
            localStorage.setItem("auth_nombre", response.data.datos.nombre);
            localStorage.setItem("auth_ou", response.data.datos.ou);
            localStorage.setItem("auth_username", response.data.datos.username);
          }

           this.$router.push("/home");
          location.reload();
        })
        .catch((error) => {
          console.error();
          this.flashMessage.show({
            status: "error",
            title: "BackOffice",
            message: "Los datos ingresados no son válidos." + error,
          });
          document.form.reset();
        });
    },
  },
};
</script>