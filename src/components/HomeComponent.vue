<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <div class="sidebar">
      <div class="sidebarUser">
        <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
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
          v-for="todo in grupoProfesor"
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
            <img src="https://images4.alphacoders.com/946/946100.png" alt="" />
            <input
              type="text"
              placeholder="Escribe algo!"
              required
              v-model="mensaje"
            />
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
                  v-for="todo in grupoProfesor"
                  :key="todo.id"
                  v-bind:value="[todo.idGrupo, todo.idMateria]"
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
            <img
              src="https://assets.edmodo.com/images_v2/icons/small/image.png"
              alt=""
              srcset=""
            />
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
            <button class="boxText_btn" v-on:click="enviarPost()">
              Enviar
            </button>
          </div>
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
              v-for="todo in grupoProfesor"
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
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
import Calendar from "v-calendar/lib/components/calendar.umd";
export default {
  name: "App",
  components: {
    vueHeadful,
    Calendar,
  },
  data() {
    return {
      usuario: "",
      profesor: false,
      title: "Home",
      url: "/home",
      grupoProfesor: "",
      selectedGroup: "",
      file: [],
      mensaje: "",
      foro: "",
      value: 1,
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
            this.grupoProfesor = res.data;
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
      //Asignamos la imagen a  nuestra data
      this.file.push(event.target.files[0]);
    },

    delateFile(nombre) {
      let i;

      for (i = 0; i < this.file.length; i++) {
        if (this.file[i].name === nombre) {
          this.file.splice(i, 1);
        }
      }
    },
    add() {
      this.value += 1;
    },
    enviarPost() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Global.token,
        },
      };

      for (let i = 0; i < this.file.length; i++) {
        let formData = new FormData();
        formData.append("archivo", this.file[i]);
        formData.append("idForo", this.foro.idForo);
        formData.append("idUsuario", this.usuario.username);
        formData.append("mensaje", this.mensaje);
        formData.append("titulo", this.selectedGroup[1]);

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
      }
    },
  },
};
</script>
<style>
@import "../assets/css/app.css";
@import "../assets/css/iconos.css";
</style>
