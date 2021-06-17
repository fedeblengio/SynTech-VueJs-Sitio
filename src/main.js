import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import FlashMessage from "@smartweb/vue-flash-message";
import CKEditor from 'ckeditor4-vue';

import HomeComponent from './components/HomeComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import ErrorComponent from './components/ErrorComponent.vue';
import MiPerfilComponent from './components/MiPerfilComponent.vue';
import foroComponent from './components/foroComponent.vue';
import gruposComponent from './components/gruposComponent.vue';
import ClaseComponent from './components/ClaseComponent.vue';
import MateriasAlumnoComponent from './components/MateriasAlumnoComponent.vue'

Vue.config.productionTip = false

Vue.use(FlashMessage);
Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(CKEditor);

//acá declaramos todas nuestras rutas de navegación
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/login', name: 'login', component: LoginComponent },
    { path: '/miPerfil', name: 'miPerfil', component: MiPerfilComponent },
    { path: '/foro', name: 'Foro', component: foroComponent },
    { path: '/mis-grupos', name: 'mis-grupos', component: gruposComponent },
    { path: '/clases/:idGrupo/:materia/:idMateria', name: 'clase-foro', component: ClaseComponent },
    { path: '/materias', name: 'alumno-materias', component: MateriasAlumnoComponent},
    { path: '*', name: 'error404', component: ErrorComponent} 
    
];




const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')