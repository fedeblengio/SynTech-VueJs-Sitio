<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <div class="sidebar">
      <div class="sidebarUser">
        <img id="profile_img" />
        <p>{{ usuario.nombre }}</p>
      </div>
      <div class="contenedor-sidebar">
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
      </div>
      <div class="sidebarClass">
        <h3>Mis Clases</h3>
        <div
          class="sidebarElement"
          v-for="todo in traerMaterias"
          :key="todo.id"
        >
          <span class="clases">
            <span class="sidebarDot"></span> {{ todo.idGrupo }} -
            {{ todo.Materia }}</span
          >
        </div>
      </div>
    </div>

    <div class="feed">
      <div class="feed_header">
        <h2>Home</h2>
      </div>

      <div class="boxText">
        <div class="form">
          <div class="boxText_input">
            <img id="post_img" />
            <textarea
              id="textarea"
              placeholder="Escribe algo!"
              required
              v-model="mensaje"
            ></textarea>
          </div>
          <div class="addArchivos">
            <div class="select_materia">
              <select
                v-on:change="traerIdForo()"
                class="form-control"
                v-model="selectedGroup"
                required
              >
                <option
                  v-for="todo in traerMaterias"
                  :key="todo.id"
                  v-bind:value="[todo.idGrupo, todo.idMateria, todo.Materia]"
                >
                  {{ todo.idGrupo }} - {{ todo.Materia }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="preview_contenedor"
            v-for="file in file"
            :key="file.id"
            :value="file.name"
          >
            <i class="fal fa-file-alt file"></i>

            <h3 class="preview">
              {{ file.name }}
            </h3>
            <i
              class="fas fa-times equis"
              v-on:click="delateFile(file.name)"
            ></i>
          </div>
          <div class="footer_post">
            <div class="select_file">
              <div class="image-upload">
                <label for="file-input">
                  <i class="fas fa-upload"></i>
                </label>

                <input
                  @change="getFile"
                  id="file-input"
                  type="file"
                  v-on:onchange="previewFile(this)"
                  style="display: none"
                />
              </div>
            </div>
            <button class="boxText_btn" v-on:click="enviarArchivos()">
              Enviar
            </button>
          </div>
        </div>
      </div>
      <div
        class="post"
        v-for="post in traerArchivos"
        :key="post.id"
        :id="post.id"
      >
        <div class="post_avatar">
          <img :src="returnImgProfile(post.data.profile_picture)" alt="" />
        </div>
        <div class="post_body">
          <div class="post_title">
            <span> {{ post.data.titulo }} </span>
            <p>{{ post.data.fecha }}</p>
          </div>
          <div class="post_body_text">
            {{ post.data.mensaje }}
          </div>
          <div :id="post.data.id" class="imgContnedor">
            <VuePictureSwipe
              :items="cargarImg(post.imagenes)"
            ></VuePictureSwipe>
          </div>

          <div class="post_footer" v-for="arc in post.archivos" :key="arc.id">
            <div class="contenedor_pdf">
              <div class="previw_archivosPost">
                <h3 v-on:click="descargarPDF(arc)">
                  <i class="fal fa-file-alt file"></i> 
                  <span>{{ arc }}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="events">
      <div class="events_header">
        <div class="events_icon">
          <i class="fas fa-bell sombra coloricono"></i>
        </div>
        <div class="events_icon">
          <i class="fas fa-cog sombra coloricono"></i>
        </div>
        <div class="events_icon">
          <a href="" v-on:click="cerrarSesion()">
            <i class="fas fa-door-open sombra coloricono"></i>
          </a>
        </div>
      </div>

      <div class="event">
        <div class="calendarioElement">
          <Calendar></Calendar>
        </div>

        <div class="currentEvent">
          <div class="currentEvent_contenedor">
            <h3>Mis Eventos</h3>
            <div
              class="sidebarElement"
              v-for="todo in traerMaterias"
              :key="todo.id"
            >
              <span class="clases">
                <span class="sidebarDot_event"></span> {{ todo.idGrupo }} -
                {{ todo.Materia }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import VuePictureSwipe from "vue-picture-swipe";
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
import Calendar from "v-calendar/lib/components/calendar.umd";
import JQuery from "jquery";
window.$ = JQuery;

export default {
  name: "App",
  components: {
    vueHeadful,
    Calendar,
    VuePictureSwipe,
  },
  data() {
    return {
      usuario: "",
      profesor: false,
      title: "Home",
      url: "/home",
      selectedGroup: "",
      file: [],
      mensaje: "",
      foro: "",
      value: 1,
      traerMaterias: "",
    };
  },
  mounted() {
    this.verificarLogueo();
    if (this.usuario.ou == "Profesor") {
      this.traerGrupoProfesor();
    } else {
      this.traerMateriasUser();
    }

    this.traerPostarchivos();

    let textarea = document.getElementById("textarea");

    textarea.oninput = function () {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    };
  },
  methods: {
    verificarLogueo() {
      if (localStorage.getItem("auth_token")) {
        this.logged = true;
        this.url = "/misMaterias";
        this.usuario = JSON.parse(
          window.atob(localStorage.getItem("auth_token"))
        );
        this.cargarFoto();
        if (this.usuario.ou == "Profesor") {
          this.profesor = true;
          this.traerGrupoProfesor();
        }
      } else {
        this.$router.push("/dashboard");
      }
    },

    cerrarSesion() {
      localStorage.clear();
      this.$router.push("/dashboard");
      location.reload();
    },
    traerPost() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(Global.urlSitio + "foro?id=" + this.usuario.username, config)
        .then((res) => {
          if (res.status == 200) {
            this.grupoProfesor = res.data;
          }
        });
    },
    traerGrupoProfesor() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "profesor-grupo?idProfesor=" +
            this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
        });
    },
    traerMateriasUser() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio + "listarMaterias?idUsuario=" + this.usuario.username,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerMaterias = res.data;
          }
        });
    },
    cargarImg(imagen) {
      let arrayImg = [];

      for (let i = 0; i < imagen.length; i++) {
        arrayImg.push({
          src: "data:image/png;base64," + imagen[i],
          thumbnail: "data:image/png;base64," + imagen[i],
          w: 1300,
          h: 1000,
          alt: "some numbers on a grey background",
        });
      }
      return arrayImg;
    },
    traerPostarchivos() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "foro?idUsuario=" +
            this.usuario.username +
            "&ou=" +
            this.usuario.ou,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.traerArchivos = res.data;
          }
        });
    },

    traerIdForo() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(
          Global.urlSitio +
            "foros?idMateria=" +
            this.selectedGroup[1] +
            "&idGrupo=" +
            this.selectedGroup[0],
          config
        )
        .then((res) => {
          if (res.status == 200) {
            this.foro = res.data;
          }
        });
    },
    getFile(event) {
      let size = event.target.files[0].size;
      let res = size * 0.000001;

      if (this.file.length <= 4) {
        if (res <= 50) {
          this.file.push(event.target.files[0]);
        } else {
          alert("El tamaño del archivo excede el límite máximo permitido");
        }
      } else {
        alert("5 archivos por post");
      }
    },

    delateFile(nombre) {
      let i;

      for (i = 0; i < this.file.length; i++) {
        if (this.file[i].name === nombre) {
          this.file.splice(i, 1);
        }
      }
    },
    cargarFoto() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };

      let usuario = JSON.parse(window.atob(localStorage.getItem("auth_token")));
      axios
        .get(
          Global.urlSitio +
            "imagen-perfil?imagen_perfil=" +
            usuario.imagen_perfil,
          config
        )
        .then((res) => {
          if (res.status == 200) {
            let url_imagen = res.data;
            localStorage.setItem("perfil_img", url_imagen);

            document.getElementById("profile_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");

            document.getElementById("post_img").src =
              "data:image/png;base64," + localStorage.getItem("perfil_img");
          }
        });
    },
    returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },

    enviarArchivos() {
      var hoy = new Date();
      var fecha =
        hoy.getDate() +
        hoy.getMonth() +
        hoy.getFullYear() +
        hoy.getHours() +
        hoy.getMinutes() +
        hoy.getSeconds() +
        "_";

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };
      let nombres = [];
      for (let i = 0; i < this.file.length; i++) {
        nombres.push(fecha + this.file[i].name);
        let formData = new FormData();

        formData.append("archivo", this.file[i]);
        formData.append("nombre", fecha + this.file[i].name);

        axios
          .post(Global.urlSitio + "FTP", formData, config)
          .then((response) => {
            if (response.status == 200) {
              location.reload();
            }
          })
          .catch(() => {});
      }
      this.enviarPost(nombres);
    },
    enviarPost(nombres) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      let formData = new FormData();
      let tituloForo =
        this.usuario.nombre +
        " publico para " +
        this.selectedGroup[0] +
        " - " +
        this.selectedGroup[2];

      formData.append("idForo", this.foro.idForo);
      formData.append("idUsuario", this.usuario.username);
      formData.append("mensaje", this.mensaje);
      formData.append("titulo", tituloForo);
      formData.append("nombre_archivos", nombres);

      axios
        .post(Global.urlSitio + "foro", formData, config)
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.flashMessage.show({
              status: "success",
              title: Global.tituloSitio,
              message: "Post publicado correctamente",
            });
          }
        })
        .catch(() => {
          this.flashMessage.show({
            status: "error",
            title: Global.tituloSitio,
            message: "Error al publicar el post",
          });
        });
    },
    descargarPDF(label) {
      let url = Global.urlSitio + "traerArchivo?archivo=" + label;
      axios
        .get(url, { responseType: "blob", token: Global.token })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = label;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
  },
};
</script>
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
