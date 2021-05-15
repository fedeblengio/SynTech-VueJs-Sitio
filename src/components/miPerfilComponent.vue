<template>
  <div>
  <vue-headful :title="title" />
  <h1>{{datos}}</h1>

  </div>
</template>

<script>
import vueHeadful from "vue-headful";
import { Global } from "../Global";
import axios from "axios";
export default {
  name: "miPerfilComponent",
  components: {
    vueHeadful,
  },
  data() {
    return {
      title: "Mi Perfil",
      persona:{
        username:''
      },
      datos:'',
    };
  },
  
  mounted() {
   if(localStorage.getItem("auth_token")){
      this.persona.username = localStorage.getItem("auth_username");
      this.procesar();
    }else{
      this.$router.push("/login");
    }

  },
    methods: {
    procesar() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(Global.url + "usuario", this.persona, config)
        .then((response) => {
          if (response.status == 200) {
            

            this.datos =  response.data;      
          }

        
         
        })
        .catch((error) => {
          console.error();
          this.flashMessage.show({
            status: "error",
            title: "BackOffice",
            message: "Los datos ingresados no son válidos." + error,
          });
          document.form.reset();
        });
    },
  },
  
}
</script>



<style>
</style>