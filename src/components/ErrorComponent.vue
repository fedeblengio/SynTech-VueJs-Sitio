<template>
  <div class="estiloContenedor">
    <vue-headful :title="title" />
    <h1>Página no encontrada (error 404)</h1>
    <br />
    <img
      width="500px"
      class="center"
      src="https://media.giphy.com/media/t6sWsqKTTMyNa/giphy.gif"
      alt=""
    />
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
      title: "Error",
    };
  },
};
</script>

