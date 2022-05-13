<template>
 <div class="contenedorDiv">
    <vue-headful :title="title" />
    <SectionLeft></SectionLeft>
    <div class="feed">
      <div class="feed_header" style="border-bottom: 1px solid var(--background);margin-bottom:10px;">
        <h2>Promedio</h2>
      </div>
       
       <div class="GenerarCont" style="width: 95%;margin:0 auto; ">
         <p>
           Lista de Alumno
         </p>
         <button class="btnGenerar">Descrgar</button>
       </div>
       <div style='margin-top:10px; text-align: center;'>
         <table class="table" >
        <thead>
        <tr>
          <td>Nombre</td>
          <td>Promedio</td>
          <td>Aporbado</td>
        </tr>
      </thead>
      <tbody>
      <tr>
          <td>Mark</td>
          <td>Mark</td>
          <td>Mark</td>   
      </tr>
      <tr>
          <td>Mark</td>
          <td>Mark</td>
          <td>Mark</td>   
      </tr>
  
  </tbody>
</table>
       </div>
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