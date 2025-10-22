<!--frontend_figueroa_coach/src/views/DashboardEntrenador.vue-->

<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container">
        <!-- Tabs/segment scrollable -->
        <ion-segment v-model="tab" class="seg" scrollable>
          <ion-segment-button value="alumnos"><ion-label>Alumnos</ion-label></ion-segment-button>
          <ion-segment-button value="planes"><ion-label>Planes</ion-label></ion-segment-button>
          <ion-segment-button value="plan-nuevo"><ion-label>Plan nuevo</ion-label></ion-segment-button>
        </ion-segment>

        <ion-grid class="res-grid">
          <ion-row v-if="tab==='alumnos'">
            <ion-col size="12" size-md="6">
              <div class="card">
                <h2 class="title">Alumnos</h2>
                <ion-searchbar placeholder="Buscar" v-model="search" @ionInput="fetchAlumnosDebounced" />
                <ion-list class="list-inset">
                  <ion-item
                    v-for="al in alumnos" :key="al.id"
                    button detail
                    @click="filtrarPorAlumno(al.id)">
                    <ion-label>
                      <h3>{{ al.nombre }}</h3>
                      <p>{{ al.email }}</p>
                    </ion-label>
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
                <ion-button expand="block" class="ion-margin-top" :disabled="saving" @click="crearPlan">
                  {{ saving ? 'Creando...' : 'Crear planificación' }}
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- FAB acción rápida -->
      <ion-fab slot="fixed" horizontal="end" vertical="bottom">
        <ion-fab-button @click="tab='plan-nuevo'" aria-label="Crear plan">
          <ion-icon name="add-outline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
  IonSegment, IonSegmentButton, IonSearchbar, IonSkeletonText, IonFab, IonFabButton, IonIcon,
  IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/vue'
import { ref } from 'vue'
import { alumnos as apiAlumnos, planificaciones as apiPlanif } from '@/services/api'

const tab = ref('alumnos')

const alumnos = ref([])
const planes = ref([])
const loadingAlumnos = ref(false)
const loadingPlanes = ref(false)
const search = ref('')

const nuevo = ref({ user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })
const saving = ref(false)

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

const crearPlan = async () => {
  if (!nuevo.value.user_id || !nuevo.value.titulo) return alert('Alumno y título son obligatorios')
  saving.value = true
  try {
    await apiPlanif.crear({ ...nuevo.value })
    alert('Planificación creada')
    nuevo.value = { user_id: null, titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' }
    tab.value = 'planes'
    await fetchPlanes()
  } catch (e) {
    alert(e?.response?.data?.message || 'Error al crear')
  } finally {
    saving.value = false
  }
}

fetchAlumnos()
fetchPlanes()
</script>
