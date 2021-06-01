<template>
<div>
<h1>Bienvenido</h1>
<div class="container p-3 my-3 ">
    <vue-headful :title="title" />
    
</div>
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
      title: "Inicio",
    };
  },

 
};
</script>

