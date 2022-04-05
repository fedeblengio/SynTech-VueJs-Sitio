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
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import ListadoTareasEntregadasComponent from './components/ListadoTareasEntregadasComponent.vue';
import ErrorComponent from './components/ErrorComponent';
import LoginComponent from './components/LoginComponent.vue';
import HomeComponent from './components/HomeComponent.vue';
import TareaSeleccionadaComponent from './components/TareaSeleccionadaComponent.vue';
import ProfileComponent from './components/ProfileComponent.vue';
import CalificarAlumnoComponent from './components/CalificarAlumnoComponent.vue';
import ListadoTareasComponent from './components/ListadoTareasComponent.vue';
import AgendaVirtualComponent from './components/AgendaVirtualComponent.vue';
import CalendarioComponent from './components/CalendarioComponent.vue';
import CambiarContraComponent from './components/CambiarContraComponent.vue'
import MateriasComponent from './components/MateriasComponent.vue'
import MateriasSeleccionadaComponent from './components/MateriaSeleccionadaComponent.vue'
import VisualizarTareaComponent from './components/VisualizarTareaComponent.vue'
import ListadoUsuariosComponent from './components/ListadoUsuariosComponent.vue'
import PasajeDeListaComponent from './components/PasajeDeListaComponent.vue'
import RegistroClasesComponent from './components/RegistroClasesComponent.vue'
import PDFComponent from './components/PDFComponent.vue'

Vue.config.productionTip = false
Vue.use(VueSweetalert2);
Vue.use(FlashMessage);
Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(CKEditor);
Vue.use(VFileInput);
Vue.component('calendar', Calendar)
Vue.component('v-date-picker', DatePicker)
Vue.component('vue-picture-swipe', VuePictureSwipe);

//acá declaramos todas nuestras rutas de navegación
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: LoginComponent },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/profile', name: 'profile', component: ProfileComponent },
    { path: '/listado-tareas/:idGrupo/:materia/:idMateria', name: 'listado-tareas', component: ListadoTareasComponent },
    { path: '/listado-tareas/:idGrupo/:materia/:idMateria/:tareas_vencidas', name: 'listado-tareas-vencidas', component: ListadoTareasComponent },
    { path: '/tarea/:materia/:idTarea/:re_hacer', name: 'tarea-seleccionada', component: TareaSeleccionadaComponent },
    { path: '/listado-entregas/:idGrupo/:idMateria/:idTareas/', name: 'entregas', component: ListadoTareasEntregadasComponent },
    { path: '/calificar-alumno/:idAlumnos/:idTareas/:re_entrega', name: 'calificar-alumnos', component: CalificarAlumnoComponent },
    { path: '/visualizar-tarea/:idAlumnos/:idTareas/:calificacion/:re_hacer', name: 'visualizar-tareas', component: VisualizarTareaComponent },
    { path: '/materias', name: 'materias-component', component: MateriasComponent },
    { path: '/materia-seleccionada/:idGrupo-:idMateria/:materia', name: 'materia-seleccionada', component: MateriasSeleccionadaComponent },
    { path: '/agenda-virtual', name: 'agenda-virtual', component: AgendaVirtualComponent },
    { path: '/listado-usuarios/:idGrupo/:idMateria/:materia', name: 'listado-usuarios', component: ListadoUsuariosComponent },
    { path: '/calendario', name: 'calendario', component: CalendarioComponent },
    { path: '/registro-clases', name: 'registro-clases', component: RegistroClasesComponent },
    { path: '/pasar-lista/:idGrupo/:idMateria/:idClase', name: 'pasaje-lista', component: PasajeDeListaComponent },
    { path: '/PDF/:idClase', name: 'PDF', component: PDFComponent },
    { path: '/cambioPwd', name: 'cambiopwd', component: CambiarContraComponent },
    { path: '*', name: 'error404', component: ErrorComponent },
];




const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')