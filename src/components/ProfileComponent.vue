<template>
<div class="contenedorDiv">
<vue-headful :title="title" />
 <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header">
        <h2>Mi Perfil</h2>
      </div>

      <div class="boxText">
        <h1>ANASHE</h1>
      
     
      </div>
    </div> 
 <SectionRight></SectionRight>
</div>
</template>
<script>
import vueHeadful from "vue-headful";
/* import { Global } from "../Global";
import axios from "axios"; */
import JQuery from "jquery";
import SectionLeft from "./SectionLeft.vue";
import SectionRight from "./SectionRight.vue";
window.$ = JQuery;
export default {
  name: "ProfileComponent",
  components: {
    SectionLeft,
    SectionRight,
    vueHeadful,
  },
  data() {
    return {
      title: "Profile",
    };
  },
};
</script>