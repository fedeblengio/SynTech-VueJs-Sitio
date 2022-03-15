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


import ListadoTareasEntregadasComponent from './components/ListadoTareasEntregadasComponent.vue';
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
import MateriasComponent from './components/MateriasComponent.vue'
import MateriasSeleccionadaComponent from './components/MateriaSeleccionadaComponent.vue'

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
    { path: '/listado-tareas/:idGrupo/:materia/:idMateria', name: 'listado-tareas', component: ListadoTareasComponent },
    { path: '/tarea/:materia/:idTarea/', name: 'tarea-seleccionada', component: TareaSeleccionadaComponent },
    { path: '/entregas/:idGrupo/:idMateria/:idTareas/', name: 'entregas', component: ListadoTareasEntregadasComponent },
    { path: '/entregas/:idAlumnos/:idTareas', name: 'calificar-alumnos', component: CalificarAlumnoComponent },
    { path: '/materias', name: 'materias-component', component: MateriasComponent },
    { path: '/materia-seleccionada/:idMateria/:nombreMateria', name: 'materia-seleccionada', component: MateriasSeleccionadaComponent },
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