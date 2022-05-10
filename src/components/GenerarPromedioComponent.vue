<template>
 <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      {{language.hola}}
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";


export default {
  name: "error-component",
  components: {
    vueHeadful,
    SectionLeft,
    SectionRight,
  },
   data() {
    return {
      language: "",
    };
  },
  mounted() {
   
  },

}
</script>

<style>

</style>