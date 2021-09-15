import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import FlashMessage from "@smartweb/vue-flash-message";
import CKEditor from '@ckeditor/ckeditor5-vue2'; 
import VFileInput from 'v-file-input';



import LoginComponent from './components/LoginComponent.vue';




Vue.config.productionTip = false

Vue.use(FlashMessage);
Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(CKEditor);
Vue.use(VFileInput);



//acá declaramos todas nuestras rutas de navegación
const routes = [
    { path: '/', redirect: '/home' },
  
    { path: '/login', name: 'login', component: LoginComponent },
  
  
    
   
];




const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')