<template>
  <div style="background-color:red;height:100%" >
    <header style="z-index: ">
      <div class="contenedor" >
        <a href="#" style="text-decoration: none"
          ><h1><i class="fas fa-books"></i> LMS</h1></a
        >
        <input type="checkbox" id="menu-barra" />
        <label class="icon-menu" for="menu-barra"></label>
        <nav class="menu">
          <a href="/dashboard">
            <i class="fa fa-home" aria-hidden="true"></i>
          </a>
          <a v-on:click="cambiarValorLocalStorage()" href="/login"> Entrar</a>
        </nav>
      </div>
    </header>
    <div class="sidenav">
      <div class="col-md-6 col-sm-12">
        
    
        <div class="login-form">
          <form>
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
            <button type="submit" class="btn session">Login</button>
          </form>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="login-main-text">
            <h2>Application<br> Login Page</h2>
            <p>Login or register from here to access.</p>
         </div>
       <img src="../assets/images/background_login.jpg" alt="">
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
.main-head {
  height: 150px;
  background: #fff;
}

.sidenav {
  height: 100%;
  background-color: white;
  overflow-x: hidden;
  padding-top: 20px;
}

.main {
 
  padding: 0px 10px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
}

@media screen and (max-width: 450px) {
  .login-form {
    margin-top: 10%;
  }

  .register-form {
    margin-top: 10%;
  }
}

@media screen and (min-width: 768px) {
  .main {
    margin-left: 40%;
  }

  .sidenav {
    width: 40%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
  }

  .login-form {
    margin-top: 80%;
  }

  .register-form {
    margin-top: 20%;
  }
}

.login-main-text {
  margin-top: 20%;
  padding: 60px;
  color: #fff;
}

.login-main-text h2 {
  font-weight: 300;
}

.btn-black {
  background-color: #000 !important;
  color: #fff;
}
.session {
  height: 45px;
  width: 60%;
  background-color: #50b7f5;
  color: white;
  font-size: 15px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
}
</style>