<template>
  <div>
    <h1>Página no encontrada (error 404)</h1>
     <vue-headful :title="title" />
    <br />
    <center>
      <img
        width="500px"
        class="center"
        src="https://media.giphy.com/media/idogabG8Entw4/giphy.gif"
        alt=""
      />
    </center>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
export default {
  name: "HomeComponent",
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