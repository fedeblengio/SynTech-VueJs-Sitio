<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />

    <div class="sidebar">
      <div class="sidebarUser">
        <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
        <p>Federico Blengio</p>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <h2>Home</h2>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <h2>Materias</h2>
      </div>
      <div class="sidebarOption">
        <i class="fas fa-home"></i>
        <h2>Calendario</h2>
      </div>
      <div class="sidebarClass">
        <h3>Mis Clases</h3>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
        <div class="sidebarElement">
          <span class="clases">
            <span class="sidebarDot"></span> TB1 - Matematica</span
          >
        </div>
      </div>
    </div>

    <div class="feed">
      <div class="feed_header">
        <h2>Home</h2>
      </div>

      <div class="boxText">
        <form>
          <div class="boxText_input">
            <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
            <input type="text" placeholder="Escribe algo!" />
          </div>
          <button class="boxText_btn">Enviar</button>
        </form>
      </div>

      <div class="post">
        <div class="post_avatar">
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span>Federico Blengio publico en TB1</span>
          </div>
          <div class="post_body_text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            sapiente.
          </div>
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
          <div class="post_footer"></div>
        </div>
      </div>
      <div class="post">
        <div class="post_avatar">
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span>Federico Blengio publico en TB1</span>
          </div>
          <div class="post_body_text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            sapiente.
          </div>
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
          <div class="post_footer"></div>
        </div>
      </div>
      <div class="post">
        <div class="post_avatar">
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span>Federico Blengio publico en TB1</span>
          </div>
          <div class="post_body_text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            sapiente.
          </div>
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
          <div class="post_footer"></div>
        </div>
      </div>
      <div class="post">
        <div class="post_avatar">
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span>Federico Blengio publico en TB1</span>
          </div>
          <div class="post_body_text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            sapiente.
          </div>
          <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
          <div class="post_footer"></div>
        </div>
      </div>
    </div>

    <div class="event">
      <DatePicker></DatePicker>
    </div>

    <div class="ContenedorAppVue">
      <div>
        <router-view> </router-view>
      </div>
    </div>
    <FlashMessage></FlashMessage>
  </div>
</template>






<script>
import vueHeadful from "vue-headful";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
export default {
  name: "App",
  components: {
    vueHeadful,

    DatePicker,
  },
  data() {
    return {
      usuario: "",
      logged: false,
      profesor: false,
      title: "BackOffice",
      url: "/home",
    };
  },
  mounted() {
    this.verificarLogueo();
  },
  methods: {
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;
        this.url = "/misMaterias";
        this.usuario = JSON.parse(
          window.atob(localStorage.getItem("auth_token"))
        );
        if (this.usuario.ou == "Profesor") {
          this.profesor = true;
        }
      }
    },

    cerrarSesion() {
      localStorage.clear();
      this.$router.push("/home");
      location.reload();
    },
  },
};
</script>
<style>
@import "./assets/css/app.css";
@import "./assets/css/iconos.css";
</style>
