<template>
  <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <img
        style="display: block; margin: 30px auto"
        src="https://new.edmodo.com/static/media/oops_404.cd0dcfe0.png"
        alt=""
      />
      <h3 style="text-align: center">{{languages.paginaNoEncontrada}}</h3>
    </div>
    <SectionRight></SectionRight>
  </div>
</template>
<script>
import vueHeadful from "vue-headful";
/* import { Global } from "../Global";
import axios from "axios";
import JQuery from "jquery"; */
import language from "../assets/lang/errorComponent.json";

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
      language: "",
    };
  },
  mounted() {
    this.selectLanguage();
  },
  methods: {
    selectLanguage() {
      if (localStorage.getItem("lang") == "es") {
        this.language = language.es;
      } else {
        this.language = language.en;
      }
      this.title = this.language.title;
    },
  },
};
</script>