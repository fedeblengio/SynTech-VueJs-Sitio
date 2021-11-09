<template>
  <div>
    <vue-headful :title="title" />

    <div class="ContenedorAppVue">
      <div v-if=logged>
        
        <router-view> </router-view>
      </div>
       <div v-else>
        <DashboardComponent> </DashboardComponent>
      </div>
    </div>
    <FlashMessage></FlashMessage>
  </div>
</template>






<script>
import vueHeadful from "vue-headful";
import DashboardComponent from "./components/DashboardComponent.vue";
export default {
  name: "App",
  components: {
    vueHeadful,
    DashboardComponent,
  },
   data() {
    return {
    title: "BackOffice",
    logged: false,
    };

  },
 
  
  mounted() {
    if (localStorage.getItem("auth_token") || localStorage.getItem("logged")) {
      this.logged = true
    }else{
       this.logged =  false
    }
  },
  methods: {
  
    },


};
</script>
<style>
@import "./assets/css/app.css";
@import "./assets/css/iconos.css";
</style>
