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
import auth_student from './middleware/auth_student';
import auth_teacher from './middleware/auth_teacher';
import auth from './middleware/auth'; 
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
import VisitarPerfilComponent from './components/VisitarPerfilComponent.vue'
import PDFComponent from './components/PDFComponent.vue'
import ListadoCalificacionesComponent from './components/ListadoCalificacionesComponent.vue'
import RegistroDeFaltasComponent from './components/RegistroDeFaltasComponent.vue'
import GenerarPromedioComponent from './components/GenerarPromedioComponent.vue'
import NoticiasComponent from './components/NoticiasComponent.vue'
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

//acá declaramos todas nuestras rutas de navegación   <router-link

const routes = [
    { path: '/', redirect: '/home'  },
    { path: '/login', name: 'login', component: LoginComponent },
    { path: '/home', name: 'home', component: HomeComponent , meta: { middleware: auth}},
    { path: '/profile/:idUsuario', name: 'profile', component: ProfileComponent , meta: { middleware: auth} },
    { path: '/visitar-perfil/:idUsuario', name: 'visitar-perfil', component: VisitarPerfilComponent , meta: { middleware: auth}},
    { path: '/noticias', name: 'listado-noticias', component: NoticiasComponent , meta: { middleware: auth_teacher} },
    { path: '/listado-tareas/:idGrupo/:materia/:idMateria', name: 'listado-tareas', component: ListadoTareasComponent , meta: { middleware: auth} },
    { path: '/listado-tareas/:idGrupo/:materia/:idMateria/:tareas_vencidas', name: 'listado-tareas-vencidas', component: ListadoTareasComponent , meta: { middleware: auth} },
    { path: '/tarea/:materia/:idTarea/:re_hacer', name: 'tarea-seleccionada', component: TareaSeleccionadaComponent , meta: { middleware: auth} },
    { path: '/listado-entregas/:idGrupo/:idMateria/:idTareas/', name: 'entregas', component: ListadoTareasEntregadasComponent , meta: { middleware: auth_teacher}},
    { path: '/calificar-alumno/:idAlumnos/:idTareas/:re_entrega', name: 'calificar-alumnos', component: CalificarAlumnoComponent, meta: { middleware: auth_teacher}  },
    { path: '/visualizar-tarea/:idTareas/:idAlumnos/', name: 'visualizar-tarea', component: VisualizarTareaComponent , meta: { middleware: auth_teacher} },
    { path: '/materias', name: 'materias-component', component: MateriasComponent , meta: { middleware: auth}},
    { path: '/materia-seleccionada/:idGrupo-:idMateria/:materia', name: 'materia-seleccionada', component: MateriasSeleccionadaComponent , meta: { middleware: auth}},
    { path: '/agenda-virtual', name: 'agenda-virtual', component: AgendaVirtualComponent , meta: { middleware: auth_teacher}},
    { path: '/listado-usuarios/:idGrupo/:idMateria/:materia', name: 'listado-usuarios', component: ListadoUsuariosComponent , meta: { middleware: auth} },
    { path: '/calendario', name: 'calendario', component: CalendarioComponent , meta: { middleware: auth}},
    { path: '/registro-clases', name: 'registro-clases', component: RegistroClasesComponent , meta: { middleware: auth_teacher} },
    { path: '/pasar-lista/:idGrupo/:idMateria/:idClase', name: 'pasaje-lista', component: PasajeDeListaComponent  , meta: { middleware: auth_teacher} },
    { path: '/calificaciones', name: 'calificaciones-alumno', component: ListadoCalificacionesComponent  , meta: { middleware: auth_student} },
    { path: '/PDF/:idClase/:materia/:fecha', name: 'PDF', component: PDFComponent , meta: { middleware: auth_teacher} },
    { path: '/historial-faltas', name: 'historial-faltas', component: RegistroDeFaltasComponent , meta: { middleware: auth_teacher}},
    { path: '/cambioPwd', name: 'cambiopwd', component: CambiarContraComponent , meta: { middleware: auth} },
    { path: '/generarPromedio/:idGrupo/:Materia/:idMateria', name: 'materia-generarPromedio', component: GenerarPromedioComponent , meta: { middleware: auth_teacher}},
    { path: '*', name: 'error404', component: ErrorComponent , meta: { middleware: auth} },
];




const router = new VueRouter({ routes, mode: 'history' });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')