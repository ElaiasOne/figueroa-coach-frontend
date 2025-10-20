<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">

      <!-- Tabs -->
      <ion-segment :value="tab" @ionChange="onTabChange" class="seg">
        <ion-segment-button value="alumnos">
          <ion-label>Alumnos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="plan-nuevo">
          <ion-label>Plan nuevo</ion-label>
        </ion-segment-button>
        <ion-segment-button value="planes">
          <ion-label>Planes</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- ================== TAB: ALUMNOS ================== -->
      <div v-if="tab === 'alumnos'">
        <ion-card>
          <ion-card-header class="row-between">
            <ion-card-title class="title">Alumnos</ion-card-title>
            <ion-button size="small" fill="clear" @click="cargarAlumnos">Actualizar</ion-button>
          </ion-card-header>
          <ion-card-content>
            <ion-searchbar
              placeholder="Buscar por nombre o email"
              v-model="buscar"
              @ionClear="cargarAlumnos"
              @keyup.enter="cargarAlumnos"
            />
            <ion-button class="mt" size="small" @click="cargarAlumnos">Buscar</ion-button>

            <ion-list class="mt">
              <ion-item lines="full">
                <ion-label><strong>Resultados</strong></ion-label>
              </ion-item>

              <ion-item v-for="a in alumnosLista" :key="a.id">
                <ion-label>
                  <div class="row-between">
                    <strong>#{{ a.id }} — {{ a.nombre || '(Sin nombre)' }}</strong>
                    <ion-badge color="medium">{{ a.email || '—' }}</ion-badge>
                  </div>
                  <small>
                    Sexo: {{ a.sexo || '-' }} · Edad: {{ a.edad ?? '-' }} ·
                    Altura: {{ a.altura_cm ?? '-' }} cm ·
                    Peso: {{ a.peso_actual_kg ?? '-' }} kg ·
                    Objetivo: {{ a.peso_objetivo_kg ?? '-' }} kg
                  </small>
                </ion-label>

                <div slot="end" class="btns">
                  <ion-button size="small" fill="outline" @click="preEditarAlumno(a)">Editar</ion-button>
                  <ion-button size="small" fill="clear" @click="usarAlumnoParaPlan(a.id)">Usar plan</ion-button>
                  <ion-button size="small" fill="clear" @click="filtrarPlanificaciones(a.id)">Ver planes</ion-button>
                </div>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- FAB: Crear alumno -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="abrirModalCrear = true">
            <ion-icon :icon="add" />
          </ion-fab-button>
        </ion-fab>

        <!-- Modal: Crear Alumno -->
        <ion-modal :is-open="abrirModalCrear" @didDismiss="abrirModalCrear=false">
          <div class="modal-container">
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

            <div class="row-end mt">
              <ion-button @click="crearAlumno">Guardar</ion-button>
              <ion-button fill="clear" @click="abrirModalCrear=false">Cancelar</ion-button>
            </div>
            <ion-text color="success" v-if="okAlumno">Alumno creado ✅</ion-text>
            <ion-text color="danger" v-if="errAlumno">{{ errAlumno }}</ion-text>
          </div>
        </ion-modal>

        <!-- Modal: Editar Alumno -->
        <ion-modal :is-open="!!editAlumno" @didDismiss="cancelarEdicion">
          <div class="modal-container">
            <h3>Editar alumno #{{ editAlumno?.id }}</h3>

            <ion-item>
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input v-model="editAlumno.nombre" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input v-model="editAlumno.email" type="email" />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Sexo</ion-label>
              <ion-select v-model="editAlumno.sexo" placeholder="Seleccionar" interface="popover">
                <ion-select-option value="M">M</ion-select-option>
                <ion-select-option value="F">F</ion-select-option>
                <ion-select-option value="X">X</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Edad</ion-label>
              <ion-input v-model.number="editAlumno.edad" type="number" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Altura (cm)</ion-label>
              <ion-input v-model.number="editAlumno.altura_cm" type="number" step="0.1" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Peso actual (kg)</ion-label>
              <ion-input v-model.number="editAlumno.peso_actual_kg" type="number" step="0.1" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Peso objetivo (kg)</ion-label>
              <ion-input v-model.number="editAlumno.peso_objetivo_kg" type="number" step="0.1" />
            </ion-item>

            <div class="row-end mt">
              <ion-button @click="guardarAlumno">Guardar</ion-button>
              <ion-button fill="clear" @click="cancelarEdicion">Cancelar</ion-button>
            </div>
            <ion-text color="success" v-if="okEdit">Actualizado ✅</ion-text>
            <ion-text color="danger" v-if="errEdit">{{ errEdit }}</ion-text>
          </div>
        </ion-modal>
      </div>

      <!-- ================== TAB: PLAN NUEVO ================== -->
      <div v-else-if="tab === 'plan-nuevo'">
        <ion-card>
          <ion-card-header>
            <ion-card-title class="title">Crear Planificación</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Alumno</ion-label>
              <ion-select v-model.number="plan.user_id" placeholder="Elegí un alumno" interface="popover">
                <ion-select-option v-for="a in alumnosLista" :key="a.id" :value="a.id">
                  #{{ a.id }} — {{ a.nombre || '(Sin nombre)' }} ({{ a.email || '—' }})
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Título</ion-label>
              <ion-input v-model="plan.titulo" />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Descripción</ion-label>
              <ion-textarea v-model="plan.descripcion" rows="4" />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Fecha Inicio</ion-label>
              <ion-datetime-button datetime="fi" />
              <ion-modal keep-contents-mounted>
                <ion-datetime id="fi" v-model="plan.fecha_inicio" presentation="date" />
              </ion-modal>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Fecha Fin</ion-label>
              <ion-datetime-button datetime="ff" />
              <ion-modal keep-contents-mounted>
                <ion-datetime id="ff" v-model="plan.fecha_fin" presentation="date" />
              </ion-modal>
            </ion-item>

            <ion-button class="mt" @click="crearPlan">Crear Plan</ion-button>
            <ion-text color="success" v-if="okPlan" class="ml">Plan creado ✅</ion-text>
            <ion-text color="danger" v-if="errPlan" class="ml">{{ errPlan }}</ion-text>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- ================== TAB: PLANES ================== -->
      <div v-else>
        <ion-card>
          <ion-card-header class="row-between">
            <ion-card-title class="title">Planificaciones</ion-card-title>
            <ion-button size="small" fill="clear" @click="cargarPlanificaciones">Actualizar</ion-button>
          </ion-card-header>
          <ion-card-content>
            <div class="filters">
              <ion-item>
                <ion-label position="stacked">Filtrar por alumno (id)</ion-label>
                <ion-input v-model.number="filtroAlumnoId" type="number" placeholder="ej: 2" />
              </ion-item>
              <ion-button size="small" class="mt" @click="cargarPlanificaciones">Aplicar filtro</ion-button>
              <ion-button size="small" fill="clear" class="mt" @click="limpiarFiltro">Limpiar</ion-button>
            </div>

            <ion-list class="mt">
              <ion-item
                v-for="p in planificaciones"
                :key="p.id"
                button
                @click="$router.push(`/planificacion/${p.id}`)"
              >
                <ion-label>
                  <strong>{{ p.titulo }}</strong>
                  <p>Alumno: {{ p.alumno_nombre }} · {{ p.fecha_inicio }} → {{ p.fecha_fin }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonLabel, IonButton, IonText, IonList, IonItem, IonInput, IonTextarea,
  IonDatetime, IonDatetimeButton, IonModal, IonSelect, IonSelectOption, IonFab, IonFabButton,
  IonIcon, IonBadge, IonSearchbar, IonSegment, IonSegmentButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/vue'
import { add } from 'ionicons/icons'
import { ref, onMounted } from 'vue'
import { alumnos as alumnosApi, planificaciones as planApi } from '@/services/api'

// ---- estado UI
const tab = ref('alumnos')
const onTabChange = (ev) => { tab.value = ev.detail.value }

// ---- alumnos
const buscar = ref('')
const alumnosLista = ref([])
const alumno = ref({
  nombre: '', email: '', password: '',
  sexo: null, edad: null, altura_cm: null,
  peso_actual_kg: null, peso_objetivo_kg: null
})
const abrirModalCrear = ref(false)
const okAlumno = ref(false)
const errAlumno = ref('')

const editAlumno = ref(null)
const okEdit = ref(false)
const errEdit = ref('')

// ---- plan
const plan = ref({ user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })
const okPlan = ref(false)
const errPlan = ref('')

// ---- planificaciones
const planificaciones = ref([])
const filtroAlumnoId = ref(null)

// API: alumnos
const cargarAlumnos = async () => {
  try {
    alumnosLista.value = await alumnosApi.listar(buscar.value)
  } catch (e) {
    console.error(e)
  }
}
const preEditarAlumno = (a) => { editAlumno.value = { ...a }; okEdit.value = false; errEdit.value = '' }
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
    okEdit.value = true
    await cargarAlumnos()
  } catch (e) {
    okEdit.value = false
    errEdit.value = e?.response?.data?.message || 'Error al actualizar'
  }
}
const cancelarEdicion = () => { editAlumno.value = null }

const limpiarAlumnoForm = () => {
  alumno.value = {
    nombre: '', email: '', password: '',
    sexo: null, edad: null, altura_cm: null,
    peso_actual_kg: null, peso_objetivo_kg: null
  }
}
const crearAlumno = async () => {
  okAlumno.value = false; errAlumno.value = ''
  try {
    await alumnosApi.crear(alumno.value)
    okAlumno.value = true
    limpiarAlumnoForm()
    abrirModalCrear.value = false
    await cargarAlumnos()
  } catch (e) {
    errAlumno.value = e?.response?.data?.message || 'Error creando alumno'
  }
}

// API: planes
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
  try {
    planificaciones.value = await planApi.listar(params)
  } catch (e) { console.error(e) }
}
const limpiarFiltro = async () => { filtroAlumnoId.value = null; await cargarPlanificaciones() }

// Helpers de UI (ganchos de botones)
const usarAlumnoParaPlan = (id) => {
  plan.value.user_id = id
  tab.value = 'plan-nuevo'
}
const filtrarPlanificaciones = async (id) => {
  filtroAlumnoId.value = id
  tab.value = 'planes'
  await cargarPlanificaciones()
}

onMounted(async () => {
  await cargarAlumnos()
  await cargarPlanificaciones()
})
</script>

<style scoped>
.seg { margin-bottom: 12px; }
.row-between { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.row-end { display: flex; justify-content: flex-end; gap: 8px; }
.mt { margin-top: 12px; }
.ml { margin-left: 8px; }
.btns ion-button { margin-left: 6px; }

/* Cards y tipografía: respetan modo claro/oscuro */
ion-card, ion-card-content, ion-card-header {
  background: var(--ion-item-background);
  color: var(--ion-text-color);
}
.title, strong, small, p, h2, h3 {
  color: var(--ion-text-color);
}

/* Modal: también respeta el tema */
.modal-container {
  padding: 16px;
  background: var(--ion-background-color);
  color: var(--ion-text-color);
  border-radius: 16px;
}

/* Layout filtros */
.filters { display: grid; grid-template-columns: 1fr; gap: 8px; }
@media (min-width: 640px) {
  .filters { grid-template-columns: 1fr auto auto; align-items: end; }
}
</style>
