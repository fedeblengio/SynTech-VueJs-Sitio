<template>
  <div class="estiloContenedor">
    <vue-headful :title="title" />
    <header style="z-index: ">
      <div class="contenedor">
        <a :href="url" style="text-decoration: none"
          ><h1><i class="fas fa-books"></i> LMS</h1></a
        >
        <input type="checkbox" id="menu-barra" />
        <label class="icon-menu" for="menu-barra"></label>
        <nav class="menu">
          <a :href="url">
            <i class="fa fa-home" aria-hidden="true"></i>
          </a>
          <a href="/miPerfil" v-if="logged"
            ><i class="fas fa-user"></i> {{ usuario.nombre }}</a
          >

          <a href="/login" v-else> Login</a>
          <a href="" v-on:click="cerrarSesion()" v-if="logged"
            ><i class="fal fa-sign-out-alt"></i
          ></a>
        </nav>
      </div>
    </header>
    <section>
      
      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_1_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>

          <div class="texo-articulo uno">
            <h2>Aprender mejor juntos</h2>
            <p>
              Administra tu aula. Involucra a tus estudiantes. Seguro. Simple.
            </p>
            <a href="/login" class="btn btn-warning">Login</a>
          </div>
        </div>
      </div>

      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="texo-articulo dos">
            <h3 class="text-muted">PARA EDUCADORES</h3>
            <h2>Herramientas que los profesores necesitan</h2>
            <p>
              Envía mensajes, comparte materiales de clase y haz que el
              aprendizaje sea accesible en cualquier lugar. Ahorra tiempo al
              reunir todas las herramientas de tu clase.
            </p>
          </div>
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_2_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>
        </div>
      </div>

      <div class="articulo-card">
        <div class="articulo-contenedor">
          <div class="articulo-img">
            <img
              src="https://a.edim.co/images_v2/landing/rebrand/module_3_abstract_ltr_img@2X.webp"
              alt=""
            />
          </div>

          <div class="texo-articulo uno">
            <h3 class="text-muted">PARA ESTUDIANTES</h3>
            <h2>Una plataforma que los estudiantes aman</h2>
            <p>
              Aumenta tu seguridad, encuentra tu voz y experimenta lo que
              significa ser un ciudadano digital. Potencia tu aprendizaje y
              forma parte de una vibrante comunidad de aulas.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import vueHeadful from "vue-headful";
export default {
  name: "homeComponent",
  components: {
    vueHeadful,
  },

  data() {
    return {
      title: "Home",
    };
  },
  mounted() {
    if (localStorage.getItem("auth_token")) {
      this.$router.push("/home");
      this.flashMessage.show({
        status: "success",
        title: "Sitio",
        message: "Ya has iniciado sesión",
      });
    }
    this.usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Ubuntu&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");

* {
  font-family: "Poppins", sans-serif;
}

section {
  width: 100%;
}

header .contenedor {
  display: table;
}

header {
  width: 100%;
  height: 50px;
  background: rgba(38, 87, 153);
  border-color: rgba(38, 87, 153);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

header label {
  float: right;
  font-size: 28px;
  margin: 6px 0;
  cursor: pointer;
  color: #fff;
}

.contenedor h1 {
  float: left;
  color: #fff;
}

.contenedor {
  width: 98%;
  margin: auto;
}
#menu-barra {
  display: none;
}
.menu {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: all 0.5s;
  transform: translateX(-100%);
}

.menu a {
  display: block;
  color: rgb(255, 255, 255);
  height: 50px;
  text-decoration: none;
  padding: 15px;
  border-bottom: 1px solid rgb(255, 255, 255);
  background: rgba(0, 0, 0, 0.89);
}
.menu a:hover {
  background: rgb(12, 99, 214);
}

#menu-barra:checked ~ .menu {
  transform: translateX(0%);
}



/******Foro******************************************************************/

.boton-foro:hover {
  background-color: rgba(32, 121, 32, 0.849);
}

.articulo-img img {
  width: 50%;
  display: block;
  margin: auto;
}
.fas {
  cursor: pointer;
  user-select: none;
}

.modeloContenedor {
  padding: 15px;
}

.modeloContenedor input {
  margin-top: 3px;
}

.customImput {
  width: 50%;
  justify-content: center;
  text-align: center;
  margin: auto;
}

.imputCss {
  margin-bottom: 10px;
}

.estiloContenedor {
  background-color: white;
  border-radius: 7px;
  margin: 56px 8px 0px 8px;
}




/******Home******************************************************************/

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.articulo-card {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-top: 30px;
  margin-bottom: 60px;
}

.texo-articulo {
  width: 500px;
  margin-top: 60px;
  justify-content: center;
  align-items: center;
}
.articulo-contenedor {
  justify-content: space-between;
  display: flex;
}

.texo-articulo a {
  text-decoration: none;
  color: black;
  width: auto;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffca28;
  font-size: 23px;
  cursor: pointer;
  border: 0px;
  border-radius: 7px;
}

.texo-articulo h2 {
  color: #1c1e27;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.texo-articulo h3 {
  margin-bottom: 20px;
  font-size: 22px;
}

.texo-articulo p {
  color: #1c1e27;
  font-size: 19px;
  font-weight: 200;
  line-height: 28px;
}

.dos {
  margin-left: 230px;
}
.uno {
  margin-right: 230px;
}
.articulo-img img {
  width: 80%;
}

/******RESOLUCION******************************************************************/

/*Menu**********************/
/*Escritorio*/

@media (min-width: 1024px) {
  .menu {
    position: static;
    width: auto;
    height: auto;
    transform: translateX(0%);
    float: right;
    display: flex;
  }

  header label {
    display: none;
  }
  .menu a {
    border: none;
    background: rgba(38, 87, 153);
    border-bottom: 3px solid #fff;
  }

  .contenedor {
    width: 1500px;
  }
}

/*Banner**********************/
/*Celular*/
@media (min-width: 480px) {
}
/*Tablet*/
@media (min-width: 768px) {
}
</style>