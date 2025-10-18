<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <h2>Panel del Entrenador</h2>

      <!-- ================== BUSCAR / LISTAR ALUMNOS ================== -->
      <div class="card ion-margin-vertical">
        <h3>Buscar alumnos</h3>
        <ion-item>
          <ion-label position="stacked">Nombre o Email</ion-label>
          <ion-input v-model="buscar" @keyup.enter="cargarAlumnos" placeholder="ej: juan o juan@mail.com" />
        </ion-item>
        <ion-button class="ion-margin-top" @click="cargarAlumnos">Buscar</ion-button>

        <ion-list class="ion-margin-top">
          <ion-item lines="full">
            <ion-label><strong>Resultados</strong></ion-label>
          </ion-item>
          <ion-item v-for="a in alumnosLista" :key="a.id">
            <ion-label>
              <h2>#{{ a.id }} — {{ a.nombre }}</h2>
              <p>{{ a.email }}</p>
              <p>Sexo: {{ a.sexo || '-' }} | Edad: {{ a.edad || '-' }} | Altura: {{ a.altura_cm || '-' }} cm | Peso: {{ a.peso_actual_kg || '-' }} kg | Obj: {{ a.peso_objetivo_kg || '-' }} kg</p>
            </ion-label>
            <div slot="end">
              <ion-button size="small" @click="preEditarAlumno(a)">Editar</ion-button>
              <ion-button size="small" fill="outline" @click="usarAlumnoParaPlan(a.id)">Usar para plan</ion-button>
              <ion-button size="small" fill="clear" @click="filtrarPlanificaciones(a.id)">Filtrar planes</ion-button>
            </div>
          </ion-item>
        </ion-list>
      </div>

      <!-- ================== EDITAR ALUMNO ================== -->
      <div v-if="editAlumno" class="card ion-margin-vertical">
        <h3>Editar alumno #{{ editAlumno.id }}</h3>
        <ion-item><ion-label position="stacked">Nombre</ion-label><ion-input v-model="editAlumno.nombre" /></ion-item>
        <ion-item><ion-label position="stacked">Email</ion-label><ion-input v-model="editAlumno.email" type="email" /></ion-item>

        <ion-item>
          <ion-label position="stacked">Sexo</ion-label>
          <ion-select v-model="editAlumno.sexo" placeholder="Seleccionar" interface="popover">
            <ion-select-option value="M">M</ion-select-option>
            <ion-select-option value="F">F</ion-select-option>
            <ion-select-option value="X">X</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item><ion-label position="stacked">Edad</ion-label><ion-input v-model.number="editAlumno.edad" type="number" /></ion-item>
        <ion-item><ion-label position="stacked">Altura (cm)</ion-label><ion-input v-model.number="editAlumno.altura_cm" type="number" step="0.1" /></ion-item>
        <ion-item><ion-label position="stacked">Peso actual (kg)</ion-label><ion-input v-model.number="editAlumno.peso_actual_kg" type="number" step="0.1" /></ion-item>
        <ion-item><ion-label position="stacked">Peso objetivo (kg)</ion-label><ion-input v-model.number="editAlumno.peso_objetivo_kg" type="number" step="0.1" /></ion-item>

        <ion-button class="ion-margin-top" @click="guardarAlumno">Guardar cambios</ion-button>
        <ion-button class="ion-margin-top" fill="clear" @click="cancelarEdicion">Cancelar</ion-button>
        <ion-text color="success" v-if="okEdit" class="ion-margin-start">Actualizado ✅</ion-text>
        <ion-text color="danger" v-if="errEdit" class="ion-margin-start">{{ errEdit }}</ion-text>
      </div>

      <!-- ================== CREAR ALUMNO ================== -->
<div class="card ion-margin-vertical">
  <h3>Crear Alumno</h3>

  <ion-item>
    <ion-label position="stacked">Nombre</ion-label>
    <ion-input v-model="alumno.nombre" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input v-model="alumno.email" type="email" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Password</ion-label>
    <ion-input v-model="alumno.password" type="password" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Sexo</ion-label>
    <ion-select v-model="alumno.sexo" placeholder="Seleccionar" interface="popover">
      <ion-select-option value="M">M</ion-select-option>
      <ion-select-option value="F">F</ion-select-option>
      <ion-select-option value="X">X</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Edad</ion-label>
    <ion-input v-model.number="alumno.edad" type="number" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Altura (cm)</ion-label>
    <ion-input v-model.number="alumno.altura_cm" type="number" step="0.1" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Peso actual (kg)</ion-label>
    <ion-input v-model.number="alumno.peso_actual_kg" type="number" step="0.1" />
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Peso objetivo (kg)</ion-label>
    <ion-input v-model.number="alumno.peso_objetivo_kg" type="number" step="0.1" />
  </ion-item>

  <ion-button class="ion-margin-top" @click="crearAlumno">Guardar alumno</ion-button>
  <ion-text color="success" v-if="okAlumno" class="ion-margin-start">Alumno creado</ion-text>
  <ion-text color="danger" v-if="errAlumno" class="ion-margin-start">{{ errAlumno }}</ion-text>
</div>


      <!-- ================== NUEVA PLANIFICACIÓN ================== -->
      <div class="card ion-margin-vertical">
        <h3>Nueva Planificación</h3>

        <ion-item>
          <ion-label position="stacked">Alumno</ion-label>
          <ion-select v-model.number="plan.user_id" placeholder="Elegí un alumno" interface="popover">
            <ion-select-option v-for="a in alumnosLista" :key="a.id" :value="a.id">
              #{{ a.id }} — {{ a.nombre }} ({{ a.email }})
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item><ion-label position="stacked">Título</ion-label><ion-input v-model="plan.titulo" /></ion-item>
        <ion-item><ion-label position="stacked">Descripción</ion-label><ion-textarea v-model="plan.descripcion" rows="4" /></ion-item>
        <ion-item>
          <ion-label position="stacked">Fecha Inicio</ion-label>
          <ion-datetime-button datetime="fi" />
          <ion-modal keep-contents-mounted>
            <ion-datetime id="fi" v-model="plan.fecha_inicio" presentation="date"></ion-datetime>
          </ion-modal>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Fecha Fin</ion-label>
          <ion-datetime-button datetime="ff" />
          <ion-modal keep-contents-mounted>
            <ion-datetime id="ff" v-model="plan.fecha_fin" presentation="date"></ion-datetime>
          </ion-modal>
        </ion-item>

        <ion-button class="ion-margin-top" @click="crearPlan">Crear Plan</ion-button>
        <ion-text color="success" v-if="okPlan" class="ion-margin-start">Plan creado</ion-text>
        <ion-text color="danger" v-if="errPlan" class="ion-margin-start">{{ errPlan }}</ion-text>
      </div>

      <!-- ================== PLANIFICACIONES (con filtro) ================== -->
      <div class="card ion-margin-vertical">
        <h3>Planificaciones</h3>
        <div class="ion-margin-bottom">
          <ion-item>
            <ion-label position="stacked">Filtrar por alumno (id)</ion-label>
            <ion-input v-model.number="filtroAlumnoId" type="number" placeholder="ej: 2" />
          </ion-item>
          <ion-button size="small" class="ion-margin-top" @click="cargarPlanificaciones">Aplicar filtro</ion-button>
          <ion-button size="small" fill="clear" class="ion-margin-top" @click="limpiarFiltro">Limpiar</ion-button>
        </div>

        <ion-list>
          <ion-item v-for="p in planificaciones" :key="p.id" button @click="$router.push(`/planificacion/${p.id}`)">
            <ion-label>
              <h2>{{ p.titulo }}</h2>
              <p>Alumno: {{ p.alumno_nombre }} | {{ p.fecha_inicio }} → {{ p.fecha_fin }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-button size="small" @click="cargarPlanificaciones">Actualizar</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText, IonList,
  IonDatetime, IonDatetimeButton, IonModal, IonSelect, IonSelectOption
} from '@ionic/vue'
import { ref, onMounted } from 'vue'
import { alumnos as alumnosApi, planificaciones as planApi } from '@/services/api'

const alumno = ref({
  nombre: '',
  email: '',
  password: '',
  sexo: null,          // 'M' | 'F' | 'X'
  edad: null,
  altura_cm: null,
  peso_actual_kg: null,
  peso_objetivo_kg: null
})

const okAlumno = ref(false); const errAlumno = ref('')

const editAlumno = ref(null)
const okEdit = ref(false); const errEdit = ref('')

const plan = ref({ user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })
const okPlan = ref(false); const errPlan = ref('')

const planificaciones = ref([])
const alumnosLista = ref([])
const buscar = ref('')
const filtroAlumnoId = ref(null)

// ---- alumnos ----
const cargarAlumnos = async () => {
  alumnosLista.value = await alumnosApi.listar(buscar.value)
}
const preEditarAlumno = (a) => {
  editAlumno.value = { ...a } // copia editable
  okEdit.value = false; errEdit.value = ''
}
const guardarAlumno = async () => {
  try {
    await alumnosApi.actualizar(editAlumno.value.id, {
      nombre: editAlumno.value.nombre || null,
      email: editAlumno.value.email || null,
      sexo: editAlumno.value.sexo || null,
      edad: editAlumno.value.edad ?? null,
      altura_cm: editAlumno.value.altura_cm ?? null,
      peso_actual_kg: editAlumno.value.peso_actual_kg ?? null,
      peso_objetivo_kg: editAlumno.value.peso_objetivo_kg ?? null
    })
    okEdit.value = true; errEdit.value = ''
    await cargarAlumnos()
  } catch (e) {
    okEdit.value = false
    errEdit.value = e?.response?.data?.message || 'Error al actualizar'
  }
}
const cancelarEdicion = () => { editAlumno.value = null; }

// usar alumno en selector de nueva plan
const usarAlumnoParaPlan = (id) => { plan.value.user_id = id }

// filtrar planificaciones por alumno
const filtrarPlanificaciones = (id) => { filtroAlumnoId.value = id; cargarPlanificaciones() }

// ---- crear alumno ----
const crearAlumno = async () => {
  okAlumno.value = false; errAlumno.value = ''
  try {
    await alumnosApi.crear(alumno.value)
    okAlumno.value = true
    alumno.value = { nombre:'', email:'', password:'' }
    await cargarAlumnos()
  } catch (e) {
    errAlumno.value = e?.response?.data?.message || 'Error creando alumno'
  }
}

// ---- planificaciones ----
const crearPlan = async () => {
  okPlan.value = false; errPlan.value = ''
  try {
    await planApi.crear(plan.value)
    okPlan.value = true
    await cargarPlanificaciones()
  } catch (e) {
    errPlan.value = e?.response?.data?.message || 'Error creando planificación'
  }
}

const cargarPlanificaciones = async () => {
  const params = {}
  if (filtroAlumnoId.value) params.user_id = filtroAlumnoId.value
  planificaciones.value = await planApi.listar(params)
}

const limpiarFiltro = async () => {
  filtroAlumnoId.value = null
  await cargarPlanificaciones()
}

onMounted(async () => {
  await cargarAlumnos()
  await cargarPlanificaciones()
})
</script>
