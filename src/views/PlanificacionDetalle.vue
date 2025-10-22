<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container" v-if="plan">
        <!-- ======= Planificación general ======= -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              <div class="flex-between">
                <span>{{ plan.titulo }}</span>
                <ion-button
                  v-if="isCoach"
                  size="small"
                  fill="clear"
                  color="medium"
                  @click="editando = !editando"
                  aria-label="Editar planificación"
                >
                  <ion-icon :name="editando ? 'close-outline' : 'create-outline'" />
                </ion-button>
              </div>
            </ion-card-title>
            <ion-card-subtitle>{{ rangoFechas }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content v-if="!editando" class="multiline">
            {{ plan.descripcion || 'Sin descripción' }}
          </ion-card-content>

          <!-- Formulario de edición de la planificación -->
          <ion-card-content v-else>
            <ion-list class="list-inset">
              <ion-item>
                <ion-label position="stacked">Título</ion-label>
                <ion-input v-model="formPlan.titulo" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Descripción</ion-label>
                <ion-textarea v-model="formPlan.descripcion" auto-grow />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Inicio</ion-label>
                <ion-input type="date" v-model="formPlan.fecha_inicio" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Fin</ion-label>
                <ion-input type="date" v-model="formPlan.fecha_fin" />
              </ion-item>
            </ion-list>
            <ion-button expand="block" class="ion-margin-top" @click="guardarPlan">
              Guardar cambios
            </ion-button>
            <ion-button expand="block" color="danger" fill="outline" @click="eliminarPlan">
              Eliminar planificación
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- ======= Secciones ======= -->
        <ion-accordion-group>

          <!-- RUTINAS -->
          <ion-accordion value="rutinas">
            <ion-item slot="header">
              <ion-label>Rutinas</ion-label>
              <ion-button
                v-if="isCoach"
                slot="end"
                fill="clear"
                color="primary"
                @click.stop="abrirModal('rutina')"
              >
                <ion-icon name="add-outline" />
              </ion-button>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.rutinas?.length">
                <ion-item-sliding v-for="r in plan.rutinas" :key="r.id">
                  <ion-item>
                    <ion-label>
                      <h3>{{ r.dia_semana }}</h3>
                      <p class="multiline">{{ r.descripcion }}</p>
                    </ion-label>
                    <ion-buttons slot="end" v-if="isCoach">
                      <ion-button fill="clear" color="primary" @click="editarRutina(r)">
                        <ion-icon name="create-outline" />
                      </ion-button>
                      <ion-button fill="clear" color="danger" @click="borrarRutina(r)">
                        <ion-icon name="trash-outline" />
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-item-sliding>
              </ion-list>
              <ion-text v-else>Sin rutinas</ion-text>
            </div>
          </ion-accordion>

          <!-- ALIMENTACIÓN -->
          <ion-accordion value="alimentacion">
            <ion-item slot="header">
              <ion-label>Alimentación</ion-label>
              <ion-button
                v-if="isCoach"
                slot="end"
                fill="clear"
                color="primary"
                @click.stop="abrirModal('alimentacion')"
              >
                <ion-icon name="add-outline" />
              </ion-button>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.alimentaciones?.length">
                <ion-item v-for="a in plan.alimentaciones" :key="a.id">
                  <ion-label>
                    <h3>{{ a.comida }}</h3>
                    <p class="multiline">{{ a.descripcion }}</p>
                  </ion-label>
                  <ion-buttons slot="end" v-if="isCoach">
                    <ion-button fill="clear" color="primary" @click="editarAlimentacion(a)">
                      <ion-icon name="create-outline" />
                    </ion-button>
                    <ion-button fill="clear" color="danger" @click="borrarAlimentacion(a)">
                      <ion-icon name="trash-outline" />
                    </ion-button>
                  </ion-buttons>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin guías de alimentación</ion-text>
            </div>
          </ion-accordion>

          <!-- SUPLEMENTACIÓN -->
          <ion-accordion value="suplementacion">
            <ion-item slot="header">
              <ion-label>Suplementación</ion-label>
              <ion-button
                v-if="isCoach"
                slot="end"
                fill="clear"
                color="primary"
                @click.stop="abrirModal('suplementacion')"
              >
                <ion-icon name="add-outline" />
              </ion-button>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.suplementaciones?.length">
                <ion-item v-for="s in plan.suplementaciones" :key="s.id">
                  <ion-label><p class="multiline">{{ s.descripcion }}</p></ion-label>
                  <ion-buttons slot="end" v-if="isCoach">
                    <ion-button fill="clear" color="primary" @click="editarSuplementacion(s)">
                      <ion-icon name="create-outline" />
                    </ion-button>
                    <ion-button fill="clear" color="danger" @click="borrarSuplementacion(s)">
                      <ion-icon name="trash-outline" />
                    </ion-button>
                  </ion-buttons>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin suplementación</ion-text>
            </div>
          </ion-accordion>
        </ion-accordion-group>

        <!-- MODAL DE EDICIÓN -->
        <ion-modal :is-open="showModal" @didDismiss="cerrarModal">
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>{{ modalTitle }}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="cerrarModal">Cerrar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-list class="list-inset">
              <ion-item v-if="modalType==='rutina'">
                <ion-label position="stacked">Día</ion-label>
                <ion-input v-model="form.dia_semana" placeholder="Ej: Lunes" />
              </ion-item>
              <ion-item v-if="modalType==='alimentacion'">
                <ion-label position="stacked">Comida</ion-label>
                <ion-input v-model="form.comida" placeholder="Desayuno / Almuerzo..." />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Descripción</ion-label>
                <ion-textarea v-model="form.descripcion" auto-grow />
              </ion-item>
            </ion-list>
            <ion-button expand="block" @click="guardarItem">Guardar</ion-button>
          </ion-content>
        </ion-modal>
      </div>

      <ion-skeleton-text v-else :animated="true" style="height: 160px" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonText,
  IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonInput, IonTextarea, IonItemSliding
} from '@ionic/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { planificaciones as apiPlanif } from '@/services/api'

const route = useRoute()
const router = useRouter()
const plan = ref(null)
const editando = ref(false)
const isCoach = localStorage.getItem('role') === 'ENTRENADOR'

// form edición planificación
const formPlan = ref({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })

// modal genérico para rutinas / alimentaciones / suplementaciones
const showModal = ref(false)
const modalType = ref('')
const form = ref({})
const modalTitle = computed(() => {
  if (modalType.value === 'rutina') return 'Rutina'
  if (modalType.value === 'alimentacion') return 'Alimentación'
  if (modalType.value === 'suplementacion') return 'Suplementación'
  return ''
})

const abrirModal = (tipo) => {
  modalType.value = tipo
  form.value = { descripcion: '', dia_semana: '', comida: '' }
  showModal.value = true
}
const cerrarModal = () => { showModal.value = false }

const rangoFechas = computed(() => {
  if (!plan.value) return ''
  const f = (d) => d ? new Date(d).toLocaleDateString() : '¿?'
  return `${f(plan.value.fecha_inicio)} — ${f(plan.value.fecha_fin)}`
})

onMounted(async () => { await cargar() })

const cargar = async () => {
  try { plan.value = await apiPlanif.detalle(route.params.id) } catch { alert('Error al cargar') }
  if (plan.value) {
    formPlan.value = {
      titulo: plan.value.titulo,
      descripcion: plan.value.descripcion,
      fecha_inicio: plan.value.fecha_inicio,
      fecha_fin: plan.value.fecha_fin
    }
  }
}

/* ======= ACCIONES ======= */

// GUARDAR planificación
const guardarPlan = async () => {
  try {
    await apiPlanif.actualizar(plan.value.id, formPlan.value)
    alert('Planificación actualizada')
    editando.value = false
    await cargar()
  } catch (e) { alert('Error al guardar') }
}

// ELIMINAR planificación
const eliminarPlan = async () => {
  if (!confirm('¿Eliminar esta planificación y todo su contenido?')) return
  try {
    await apiPlanif.eliminar(plan.value.id)
    alert('Planificación eliminada')
    router.push('/coach')
  } catch { alert('Error al eliminar') }
}

/* ======= CRUD de items ======= */
const guardarItem = async () => {
  try {
    if (modalType.value === 'rutina') {
      await apiPlanif.addRutina({ planificacion_id: plan.value.id, ...form.value })
    } else if (modalType.value === 'alimentacion') {
      await apiPlanif.addAlimentacion({ planificacion_id: plan.value.id, ...form.value })
    } else if (modalType.value === 'suplementacion') {
      await apiPlanif.addSuplementacion({ planificacion_id: plan.value.id, ...form.value })
    }
    showModal.value = false
    await cargar()
  } catch { alert('Error al guardar') }
}

const editarRutina = async (r) => {
  const desc = prompt('Editar rutina:', r.descripcion)
  if (desc === null) return
  await apiPlanif.updRutina(r.id, { dia_semana: r.dia_semana, descripcion: desc })
  await cargar()
}
const borrarRutina = async (r) => {
  if (confirm('¿Eliminar rutina?')) { await apiPlanif.delRutina(r.id); await cargar() }
}

const editarAlimentacion = async (a) => {
  const desc = prompt('Editar alimentación:', a.descripcion)
  if (desc === null) return
  await apiPlanif.updAlimentacion(a.id, { comida: a.comida, descripcion: desc })
  await cargar()
}
const borrarAlimentacion = async (a) => {
  if (confirm('¿Eliminar alimentación?')) { await apiPlanif.delAlimentacion(a.id); await cargar() }
}

const editarSuplementacion = async (s) => {
  const desc = prompt('Editar suplementación:', s.descripcion)
  if (desc === null) return
  await apiPlanif.updSuplementacion(s.id, { descripcion: desc })
  await cargar()
}
const borrarSuplementacion = async (s) => {
  if (confirm('¿Eliminar suplementación?')) { await apiPlanif.delSuplementacion(s.id); await cargar() }
}
</script>

<style scoped>
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
