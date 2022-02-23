import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import FlashMessage from "@smartweb/vue-flash-message";
import CKEditor from '@ckeditor/ckeditor5-vue2';
import VFileInput from 'v-file-input';
import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import VuePictureSwipe from 'vue-picture-swipe';


import EntregasComponent from './components/EntregasComponent';
import ErrorComponent from './components/ErrorComponent';
import LoginComponent from './components/LoginComponent.vue';
import HomeComponent from './components/HomeComponent.vue';
import TareasComponent from './components/TareasComponent.vue';
import TareaSeleccionadaComponent from './components/TareaSeleccionadaComponent.vue';
import ProfileComponent from './components/ProfileComponent.vue';
import CalificarAlumnoComponent from './components/CalificarAlumnoComponent.vue';
import ListadoTareasComponent from './components/ListadoTareasComponent.vue';
import AgendaVirtualComponent from './components/AgendaVirtualComponent.vue';
import CalendarioComponent from './components/CalendarioComponent.vue';
import CambiarContraComponent from './components/CambiarContraComponent.vue'


Vue.config.productionTip = false

Vue.use(FlashMessage);
Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(CKEditor);
Vue.use(VFileInput);
Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)
Vue.component('vue-picture-swipe', VuePictureSwipe);

//acá declaramos todas nuestras rutas de navegación
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: LoginComponent },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/profile', name: 'profile', component: ProfileComponent },
    { path: '/tareas', name: 'tareas', component: TareasComponent },
    { path: '/listado-tareas/:idGrupo/:materia', name: 'listado-tareas', component: ListadoTareasComponent },
    { path: '/tarea/:materia/:idTarea/', name: 'tarea-seleccionada', component: TareaSeleccionadaComponent },
    { path: '/entregas/:idGrupo/:idMateria/:idTarea/', name: 'entregas', component: EntregasComponent },
    { path: '/entregas/:idAlumnos/:idTareas', name: 'calificar-alumnos', component: CalificarAlumnoComponent },

    { path: '/agenda-virtual', name: 'agenda-virtual', component: AgendaVirtualComponent },
    { path: '/calendario', name: 'calendario', component: CalendarioComponent },
    { path: '*', name: 'error404', component: ErrorComponent },
    { path: '/cambioPwd', name: 'cambiopwd', component: CambiarContraComponent },

];




const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')