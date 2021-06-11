<template>
<div>
<h1>Foro  {{usuario.ou}}</h1>
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
      title: "Foro",
      usuario: "",
      editorData:"",

    };
  },
  mounted() {
    this.usuario = JSON.parse(
              window.atob(localStorage.getItem("auth_token"))
            );

    
  },
  methods: {
    getDatos(){
      alert(this.editorData)
      let datos=this.editorData
      window.atob(datos)
    }
  }

 
};
</script>