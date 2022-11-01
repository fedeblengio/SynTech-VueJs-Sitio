<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <img
      width="450px"
        style="display: block; margin: 30px auto;"
         src="../assets/images/404.png"
        alt=""
      />
      <h3 style="text-align: center">{{languages.paginaNoEncontrada}}</h3>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";


import language from "../assets/lang/error404.json";
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
      title: "",
      lang: localStorage.getItem("lang"),
      languages: "",
    };
  },
  mounted() {
    this.selectLanguage();
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.languages = language.es;
      } else {
        this.languages = language.en;
      }
      this.title = language.title;
    },
  },
};
</script>