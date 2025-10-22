<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container">
        <!-- Tabs/segment scrollable -->
        <ion-segment v-model="tab" class="seg" scrollable>
          <ion-segment-button value="alumnos"><ion-label>Alumnos</ion-label></ion-segment-button>
          <ion-segment-button value="alumno-nuevo"><ion-label>Alumno nuevo</ion-label></ion-segment-button>
          <ion-segment-button value="planes"><ion-label>Planes</ion-label></ion-segment-button>
          <ion-segment-button value="plan-nuevo"><ion-label>Plan nuevo</ion-label></ion-segment-button>
        </ion-segment>

        <ion-grid class="res-grid">
          <!-- ======== TAB: ALUMNOS ======== -->
          <ion-row v-if="tab==='alumnos'">
            <ion-col size="12" size-md="6">
              <div class="card">
                <h2 class="title">Alumnos</h2>
                <ion-searchbar placeholder="Buscar" v-model="search" @ionInput="fetchAlumnosDebounced" />

                <ion-list class="list-inset">
                  <ion-item v-for="al in alumnos" :key="al.id">
                    <ion-label @click="filtrarPorAlumno(al.id)" style="cursor:pointer">
                      <h3>{{ al.nombre }}</h3>
                      <p>{{ al.email }}</p>
                      <small v-if="al.peso_actual_kg !== null || al.peso_objetivo_kg !== null">
                        Peso: {{ al.peso_actual_kg ?? '¿?' }} kg · Objetivo: {{ al.peso_objetivo_kg ?? '¿?' }} kg
                      </small>
                    </ion-label>

                    <div class="row-actions" slot="end">
                      <ion-button size="small" fill="clear" color="dark" class="icon-btn" @click="abrirEditarAlumno(al)">
                        <ion-icon :icon="createOutline" />
                        <span class="btn-text">Editar</span>
                      </ion-button>
                      <ion-button size="small" fill="clear" color="danger" class="icon-btn" @click="openConfirmEliminarAlumno(al)">
                        <ion-icon :icon="trashOutline" />
                        <span class="btn-text">Borrar</span>
                      </ion-button>
                    </div>
                  </ion-item>
                </ion-list>

                <ion-skeleton-text v-if="loadingAlumnos" :animated="true" style="height: 80px" />
              </div>
            </ion-col>

            <ion-col size="12" size-md="6">
              <div class="card">
                <h2 class="title">Planes recientes</h2>
                <ion-list class="list-inset">
                  <ion-item
                    v-for="p in planes" :key="p.id"
                    button detail
                    @click="$router.push(`/planificacion/${p.id}`)">
                    <ion-label>
                      <h3>{{ p.titulo }}</h3>
                      <p>Alumno: {{ p.alumno_nombre }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
                <ion-skeleton-text v-if="loadingPlanes" :animated="true" style="height: 80px" />
              </div>
            </ion-col>
          </ion-row>

          <!-- ======== TAB: ALUMNO NUEVO ======== -->
          <ion-row v-else-if="tab==='alumno-nuevo'">
            <ion-col size="12" size-md="8">
              <div class="card">
                <h2 class="title">Crear alumno</h2>
                <ion-list class="list-inset">
                  <ion-item>
                    <ion-label position="stacked">Nombre</ion-label>
                    <ion-input v-model="alumnoNuevo.nombre" placeholder="Nombre y apellido" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Email</ion-label>
                    <ion-input type="email" inputmode="email" autocomplete="email" v-model="alumnoNuevo.email" placeholder="correo@ejemplo.com" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Contraseña</ion-label>
                    <ion-input :type="showPwd ? 'text' : 'password'" autocomplete="new-password" v-model="alumnoNuevo.password" placeholder="mínimo 6 caracteres" />
                    <ion-button fill="clear" slot="end" @click="showPwd = !showPwd" aria-label="Ver contraseña">
                      <ion-icon :icon="showPwd ? eyeOffOutline : eyeOutline"></ion-icon>
                    </ion-button>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Sexo</ion-label>
                    <ion-select v-model="alumnoNuevo.sexo" interface="popover" placeholder="Opcional">
                      <ion-select-option value="MASCULINO">Masculino</ion-select-option>
                      <ion-select-option value="FEMENINO">Femenino</ion-select-option>
                      <ion-select-option value="OTRO">Otro</ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Edad</ion-label>
                    <ion-input type="number" inputmode="numeric" v-model.number="alumnoNuevo.edad" placeholder="Ej: 28" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Altura (cm)</ion-label>
                    <ion-input type="number" inputmode="numeric" v-model.number="alumnoNuevo.altura_cm" placeholder="Ej: 175" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Peso actual (kg)</ion-label>
                    <ion-input type="number" inputmode="decimal" v-model.number="alumnoNuevo.peso_actual_kg" placeholder="Ej: 82.5" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Peso objetivo (kg)</ion-label>
                    <ion-input type="number" inputmode="decimal" v-model.number="alumnoNuevo.peso_objetivo_kg" placeholder="Ej: 78" />
                  </ion-item>
                </ion-list>
                <ion-button expand="block" class="ion-margin-top" :disabled="creatingAlumno" @click="crearAlumno">
                  {{ creatingAlumno ? 'Creando...' : 'Crear alumno' }}
                </ion-button>
              </div>
            </ion-col>
          </ion-row>

          <!-- ======== TAB: PLANES ======== -->
          <ion-row v-else-if="tab==='planes'">
            <ion-col size="12">
              <div class="card">
                <h2 class="title">Todos los planes</h2>
                <ion-list class="list-inset">
                  <ion-item
                    v-for="p in planes" :key="p.id"
                    button detail
                    @click="$router.push(`/planificacion/${p.id}`)">
                    <ion-label>
                      <h3>{{ p.titulo }}</h3>
                      <p>{{ p.descripcion || 'Sin descripción' }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </div>
            </ion-col>
          </ion-row>

          <!-- ======== TAB: PLAN NUEVO ======== -->
          <ion-row v-else>
            <ion-col size="12" size-md="8">
              <div class="card">
                <h2 class="title">Crear nueva planificación</h2>
                <ion-list class="list-inset">
                  <ion-item>
                    <ion-label position="stacked">Alumno</ion-label>
                    <ion-select v-model="nuevo.user_id" interface="popover" placeholder="Elegí un alumno">
                      <ion-select-option v-for="al in alumnos" :key="al.id" :value="al.id">
                        {{ al.nombre }} - {{ al.email }}
                      </ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Título</ion-label>
                    <ion-input v-model="nuevo.titulo" placeholder="Ej: Plan Hipertrofia 4 semanas" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Descripción</ion-label>
                    <ion-textarea v-model="nuevo.descripcion" auto-grow placeholder="Notas generales" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Inicio</ion-label>
                    <ion-input type="date" v-model="nuevo.fecha_inicio" />
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Fin</ion-label>
                    <ion-input type="date" v-model="nuevo.fecha_fin" />
                  </ion-item>
                </ion-list>
                <ion-button expand="block" class="ion-margin-top" :disabled="savingPlan" @click="crearPlan">
                  {{ savingPlan ? 'Creando...' : 'Crear planificación' }}
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- FAB acción rápida -->
      <ion-fab slot="fixed" horizontal="end" vertical="bottom">
        <ion-fab-button @click="tab='plan-nuevo'" aria-label="Crear plan">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>

      <!-- ===== MODAL EDITAR ALUMNO ===== -->
      <ion-modal :is-open="editAlumnoOpen" @didDismiss="cerrarEditarAlumno">
        <ion-header translucent>
          <ion-toolbar>
            <ion-title>Editar alumno</ion-title>
            <ion-button slot="end" fill="clear" color="dark" @click="cerrarEditarAlumno">Cerrar</ion-button>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list class="list-inset">
            <ion-item>
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input v-model="alumnoEdit.nombre" placeholder="Nombre y apellido" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input type="email" inputmode="email" autocomplete="email" v-model="alumnoEdit.email" placeholder="correo@ejemplo.com" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Sexo</ion-label>
              <ion-select v-model="alumnoEdit.sexo" interface="popover" placeholder="Seleccionar">
                <ion-select-option value="MASCULINO">Masculino</ion-select-option>
                <ion-select-option value="FEMENINO">Femenino</ion-select-option>
                <ion-select-option value="OTRO">Otro</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Edad</ion-label>
              <ion-input type="number" inputmode="numeric" v-model.number="alumnoEdit.edad" placeholder="Ej: 28" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Altura (cm)</ion-label>
              <ion-input type="number" inputmode="numeric" v-model.number="alumnoEdit.altura_cm" placeholder="Ej: 175" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Peso actual (kg)</ion-label>
              <ion-input type="number" inputmode="decimal" v-model.number="alumnoEdit.peso_actual_kg" placeholder="Ej: 82.5" />
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Peso objetivo (kg)</ion-label>
              <ion-input type="number" inputmode="decimal" v-model.number="alumnoEdit.peso_objetivo_kg" placeholder="Ej: 78" />
            </ion-item>
          </ion-list>

          <ion-button expand="block" class="ion-margin-top" :disabled="savingAlumno" @click="guardarAlumno">
            {{ savingAlumno ? 'Guardando...' : 'Guardar cambios' }}
          </ion-button>
        </ion-content>
      </ion-modal>

      <!-- ===== ALERT ELIMINAR ALUMNO ===== -->
      <ion-alert
        :is-open="confirmEliminar.isOpen"
        header="Eliminar alumno"
        message="Se eliminará el alumno y todas sus planificaciones. ¿Continuar?"
        :buttons="[
          { text:'Cancelar', role:'cancel', handler:() => confirmEliminar.isOpen=false },
          { text:'Eliminar', role:'destructive', handler: onConfirmEliminarAlumno }
        ]"
        @didDismiss="confirmEliminar.isOpen=false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonSearchbar, IonSkeletonText, IonFab, IonFabButton, IonIcon,
  IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonModal, IonHeader, IonToolbar, IonTitle, IonAlert
} from '@ionic/vue'
import { ref } from 'vue'
import { alumnos as apiAlumnos, planificaciones as apiPlanif } from '@/services/api'
import { addOutline, createOutline, trashOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons'

const tab = ref('alumnos')

/* -------- Listados y estados -------- */
const alumnos = ref([])
const planes = ref([])
const loadingAlumnos = ref(false)
const loadingPlanes = ref(false)
const search = ref('')

/* -------- Crear plan -------- */
const nuevo = ref({ user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })
const savingPlan = ref(false)

/* -------- Crear alumno -------- */
const alumnoNuevo = ref({
  nombre: '', email: '', password: '',
  sexo: null, edad: null, altura_cm: null, peso_actual_kg: null, peso_objetivo_kg: null
})
const showPwd = ref(false)
const creatingAlumno = ref(false)

/* -------- Editar alumno -------- */
const editAlumnoOpen = ref(false)
const alumnoEdit = ref({
  id: null, nombre: '', email: '', sexo: null, edad: null, altura_cm: null, peso_actual_kg: null, peso_objetivo_kg: null
})
const savingAlumno = ref(false)

/* -------- Confirmación eliminar alumno -------- */
const confirmEliminar = ref({ isOpen: false, alumno: null })

/* ====== Fetch ====== */
const fetchAlumnos = async () => {
  loadingAlumnos.value = true
  try { alumnos.value = await apiAlumnos.listar(search.value || '') } finally { loadingAlumnos.value = false }
}
const fetchPlanes = async (params={}) => {
  loadingPlanes.value = true
  try { planes.value = await apiPlanif.listar(params) } finally { loadingPlanes.value = false }
}

let t
const fetchAlumnosDebounced = () => { clearTimeout(t); t = setTimeout(fetchAlumnos, 250) }
const filtrarPorAlumno = async (id) => { tab.value = 'planes'; await fetchPlanes({ user_id: id }) }

/* ====== Crear plan ====== */
const crearPlan = async () => {
  if (!nuevo.value.user_id || !nuevo.value.titulo) return alert('Alumno y título son obligatorios')
  savingPlan.value = true
  try {
    await apiPlanif.crear({ ...nuevo.value })
    alert('Planificación creada')
    nuevo.value = { user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' }
    tab.value = 'planes'
    await fetchPlanes()
  } catch (e) {
    alert(e?.response?.data?.message || 'Error al crear')
  } finally {
    savingPlan.value = false
  }
}

/* ====== Crear alumno ====== */
const crearAlumno = async () => {
  if (!alumnoNuevo.value.nombre || !alumnoNuevo.value.email || !alumnoNuevo.value.password) {
    return alert('Nombre, email y contraseña son obligatorios')
  }
  creatingAlumno.value = true
  try {
    await apiAlumnos.crear({ ...alumnoNuevo.value })
    alert('Alumno creado')
    alumnoNuevo.value = { nombre:'', email:'', password:'', sexo:null, edad:null, altura_cm:null, peso_actual_kg:null, peso_objetivo_kg:null }
    tab.value = 'alumnos'
    await fetchAlumnos()
  } catch (e) {
    alert(e?.response?.data?.message || 'Error al crear alumno')
  } finally {
    creatingAlumno.value = false
  }
}

/* ====== Editar alumno ====== */
const abrirEditarAlumno = (al) => {
  alumnoEdit.value = {
    id: al.id,
    nombre: al.nombre ?? '',
    email: al.email ?? '',
    sexo: al.sexo ?? null,
    edad: al.edad ?? null,
    altura_cm: al.altura_cm ?? null,
    peso_actual_kg: al.peso_actual_kg ?? null,
    peso_objetivo_kg: al.peso_objetivo_kg ?? null
  }
  editAlumnoOpen.value = true
}
const cerrarEditarAlumno = () => { editAlumnoOpen.value = false }
const guardarAlumno = async () => {
  savingAlumno.value = true
  try {
    const id = alumnoEdit.value.id
    const payload = {
      nombre: alumnoEdit.value.nombre || null,
      email: alumnoEdit.value.email || null,
      sexo: alumnoEdit.value.sexo ?? null,
      edad: alumnoEdit.value.edad ?? null,
      altura_cm: alumnoEdit.value.altura_cm ?? null,
      peso_actual_kg: alumnoEdit.value.peso_actual_kg ?? null,
      peso_objetivo_kg: alumnoEdit.value.peso_objetivo_kg ?? null
    }
    await apiAlumnos.actualizar(id, payload)
    alert('Alumno actualizado')
    editAlumnoOpen.value = false
    await fetchAlumnos()
  } catch (e) {
    alert(e?.response?.data?.message || 'No se pudo actualizar')
  } finally {
    savingAlumno.value = false
  }
}

/* ====== Eliminar alumno ====== */
const openConfirmEliminarAlumno = (al) => { confirmEliminar.value = { isOpen: true, alumno: al } }
const onConfirmEliminarAlumno = async () => {
  const al = confirmEliminar.value.alumno
  try {
    await apiAlumnos.eliminar(al.id)
    await fetchAlumnos()
    await fetchPlanes() // refrescá por si estaba filtrado por él
  } catch (e) {
    alert(e?.response?.data?.message || 'No se pudo eliminar')
  } finally {
    confirmEliminar.value = { isOpen: false, alumno: null }
  }
}

fetchAlumnos()
fetchPlanes()
</script>

<style scoped>
.row-actions {
  display: flex; gap: 6px; align-items: center;
}
.icon-btn ion-icon { margin-right: 6px; }
.btn-text { display: inline-block; }
@media (max-width: 360px) { .btn-text { display: none; } }
</style>
