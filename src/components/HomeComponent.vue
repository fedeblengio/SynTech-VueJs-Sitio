<template>
  <div class="estiloContenedor">
    <vue-headful :title="title" />
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
      this.$router.push("/misMaterias");
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
</style>