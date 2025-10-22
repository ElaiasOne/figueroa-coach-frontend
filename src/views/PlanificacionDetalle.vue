<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container" v-if="plan">
        <!-- ======= Planificación general ======= -->
        <ion-card>
          <ion-card-header>
            <div class="header-row">
              <div class="title-wrap">
                <ion-card-title>{{ plan.titulo }}</ion-card-title>
                <ion-card-subtitle>{{ rangoFechas }}</ion-card-subtitle>
              </div>

              <!-- Botones visibles (solo ENTRENADOR) -->
              <div v-if="isCoach" class="action-wrap">
                <ion-button
                  size="small"
                  fill="outline"
                  color="dark"
                  class="icon-btn"
                  @click="toggleEditarPlan"
                >
                  <ion-icon :icon="editando ? closeOutline : createOutline" />
                  <span class="btn-text">{{ editando ? 'Cerrar' : 'Editar' }}</span>
                </ion-button>

                <ion-button
                  size="small"
                  fill="outline"
                  color="danger"
                  class="icon-btn"
                  @click="openConfirmPlanDelete"
                >
                  <ion-icon :icon="trashOutline" />
                  <span class="btn-text">Eliminar</span>
                </ion-button>
              </div>
            </div>
          </ion-card-header>

          <!-- Ver/Editar descripción -->
          <ion-card-content v-if="!editando" class="multiline">
            {{ plan.descripcion || 'Sin descripción' }}
          </ion-card-content>

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
            <ion-button expand="block" class="ion-margin-top" :disabled="savingPlan" @click="guardarPlan">
              {{ savingPlan ? 'Guardando...' : 'Guardar cambios' }}
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- ======= Secciones ======= -->
        <ion-accordion-group>

          <!-- RUTINAS -->
          <ion-accordion value="rutinas">
            <ion-item slot="header">
              <ion-label>Rutinas</ion-label>
              <div v-if="isCoach" class="header-actions" slot="end">
                <ion-button size="small" fill="outline" color="primary" class="icon-btn"
                            @click.stop="abrirModal('rutina','create')">
                  <ion-icon :icon="addOutline" />
                  <span class="btn-text">Agregar</span>
                </ion-button>
              </div>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.rutinas?.length">
                <ion-item v-for="r in plan.rutinas" :key="r.id">
                  <ion-label>
                    <h3>{{ r.dia_semana }}</h3>
                    <p class="multiline">{{ r.descripcion }}</p>
                  </ion-label>
                  <div v-if="isCoach" class="row-actions" slot="end">
                    <ion-button size="small" fill="clear" color="dark" class="icon-btn" @click="abrirModal('rutina','edit', r)">
                      <ion-icon :icon="createOutline" />
                      <span class="btn-text">Editar</span>
                    </ion-button>
                    <ion-button size="small" fill="clear" color="danger" class="icon-btn" @click="openConfirmItemDelete('rutina', r.id)">
                      <ion-icon :icon="trashOutline" />
                      <span class="btn-text">Borrar</span>
                    </ion-button>
                  </div>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin rutinas</ion-text>
            </div>
          </ion-accordion>

          <!-- ALIMENTACIÓN -->
          <ion-accordion value="alimentacion">
            <ion-item slot="header">
              <ion-label>Alimentación</ion-label>
              <div v-if="isCoach" class="header-actions" slot="end">
                <ion-button size="small" fill="outline" color="primary" class="icon-btn"
                            @click.stop="abrirModal('alimentacion','create')">
                  <ion-icon :icon="addOutline" />
                  <span class="btn-text">Agregar</span>
                </ion-button>
              </div>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.alimentaciones?.length">
                <ion-item v-for="a in plan.alimentaciones" :key="a.id">
                  <ion-label>
                    <h3>{{ a.comida }}</h3>
                    <p class="multiline">{{ a.descripcion }}</p>
                  </ion-label>
                  <div v-if="isCoach" class="row-actions" slot="end">
                    <ion-button size="small" fill="clear" color="dark" class="icon-btn" @click="abrirModal('alimentacion','edit', a)">
                      <ion-icon :icon="createOutline" />
                      <span class="btn-text">Editar</span>
                    </ion-button>
                    <ion-button size="small" fill="clear" color="danger" class="icon-btn" @click="openConfirmItemDelete('alimentacion', a.id)">
                      <ion-icon :icon="trashOutline" />
                      <span class="btn-text">Borrar</span>
                    </ion-button>
                  </div>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin guías de alimentación</ion-text>
            </div>
          </ion-accordion>

          <!-- SUPLEMENTACIÓN -->
          <ion-accordion value="suplementacion">
            <ion-item slot="header">
              <ion-label>Suplementación</ion-label>
              <div v-if="isCoach" class="header-actions" slot="end">
                <ion-button size="small" fill="outline" color="primary" class="icon-btn"
                            @click.stop="abrirModal('suplementacion','create')">
                  <ion-icon :icon="addOutline" />
                  <span class="btn-text">Agregar</span>
                </ion-button>
              </div>
            </ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.suplementaciones?.length">
                <ion-item v-for="s in plan.suplementaciones" :key="s.id">
                  <ion-label><p class="multiline">{{ s.descripcion }}</p></ion-label>
                  <div v-if="isCoach" class="row-actions" slot="end">
                    <ion-button size="small" fill="clear" color="dark" class="icon-btn" @click="abrirModal('suplementacion','edit', s)">
                      <ion-icon :icon="createOutline" />
                      <span class="btn-text">Editar</span>
                    </ion-button>
                    <ion-button size="small" fill="clear" color="danger" class="icon-btn" @click="openConfirmItemDelete('suplementacion', s.id)">
                      <ion-icon :icon="trashOutline" />
                      <span class="btn-text">Borrar</span>
                    </ion-button>
                  </div>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin suplementación</ion-text>
            </div>
          </ion-accordion>
        </ion-accordion-group>

        <!-- ======= MODAL CREAR/EDITAR ITEM ======= -->
        <ion-modal :is-open="showModal" @didDismiss="cerrarModal">
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>{{ modalTitle }}</ion-title>
              <ion-button slot="end" fill="clear" color="dark" @click="cerrarModal">Cerrar</ion-button>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-list class="list-inset">
              <ion-item v-if="modalType==='rutina'">
                <ion-label position="stacked">Día</ion-label>
                <ion-input v-model="formItem.dia_semana" placeholder="Ej: Lunes" />
              </ion-item>

              <ion-item v-if="modalType==='alimentacion'">
                <ion-label position="stacked">Comida</ion-label>
                <ion-input v-model="formItem.comida" placeholder="Desayuno / Almuerzo / Cena / Merienda / Colación" />
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Descripción</ion-label>
                <ion-textarea v-model="formItem.descripcion" auto-grow placeholder="Detalle del contenido" />
              </ion-item>
            </ion-list>

            <ion-button expand="block" class="ion-margin-top" :disabled="savingItem" @click="guardarItem">
              {{ savingItem ? 'Guardando...' : (modalMode==='create' ? 'Crear' : 'Guardar cambios') }}
            </ion-button>
          </ion-content>
        </ion-modal>

        <!-- ======= ALERTS DE CONFIRMACIÓN ======= -->
        <ion-alert
          :is-open="confirmPlanDelete"
          header="Eliminar planificación"
          message="Se eliminará la planificación y todos sus contenidos. ¿Continuar?"
          :buttons="[
            { text:'Cancelar', role:'cancel', handler:() => confirmPlanDelete=false },
            { text:'Eliminar', role:'destructive', handler: onConfirmPlanDelete }
          ]"
          @didDismiss="confirmPlanDelete=false"
        />
        <ion-alert
          :is-open="confirmItemDelete.isOpen"
          header="Eliminar elemento"
          message="Esta acción no se puede deshacer. ¿Eliminar?"
          :buttons="[
            { text:'Cancelar', role:'cancel', handler:() => confirmItemDelete.isOpen=false },
            { text:'Eliminar', role:'destructive', handler: onConfirmItemDelete }
          ]"
          @didDismiss="confirmItemDelete.isOpen=false"
        />
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
  IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle,
  IonInput, IonTextarea, IonAlert, IonSkeletonText
} from '@ionic/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { planificaciones as apiPlanif } from '@/services/api'
import { addOutline, createOutline, trashOutline, closeOutline } from 'ionicons/icons'

const route = useRoute()
const router = useRouter()
const plan = ref(null)
const isCoach = localStorage.getItem('role') === 'ENTRENADOR'

/* -------- plan (editar / eliminar) -------- */
const editando = ref(false)
const savingPlan = ref(false)
const formPlan = ref({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '' })
const confirmPlanDelete = ref(false)

/* -------- modal crear/editar item -------- */
const showModal = ref(false)
const modalType = ref('')            // 'rutina' | 'alimentacion' | 'suplementacion'
const modalMode = ref('create')      // 'create' | 'edit'
const currentItemId = ref(null)
const savingItem = ref(false)
const formItem = ref({ descripcion: '', dia_semana: '', comida: '' })

/* -------- alert eliminar item -------- */
const confirmItemDelete = ref({ isOpen: false, type: '', id: null })

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
      titulo: plan.value.titulo ?? '',
      descripcion: plan.value.descripcion ?? '',
      fecha_inicio: plan.value.fecha_inicio ?? '',
      fecha_fin: plan.value.fecha_fin ?? ''
    }
  }
}

const toggleEditarPlan = () => { editando.value = !editando.value }
const openConfirmPlanDelete = () => { confirmPlanDelete.value = true }
const onConfirmPlanDelete = async () => {
  try {
    await apiPlanif.eliminar(plan.value.id)
    alert('Planificación eliminada')
    router.push('/coach')
  } catch { alert('Error al eliminar') }
}

/* ======= GUARDAR PLAN ======= */
const guardarPlan = async () => {
  savingPlan.value = true
  try {
    await apiPlanif.actualizar(plan.value.id, formPlan.value)
    editando.value = false
    await cargar()
    alert('Planificación actualizada')
  } catch { alert('Error al guardar') }
  finally { savingPlan.value = false }
}

/* ======= MODAL (crear/editar) ======= */
const modalTitle = computed(() => {
  const map = { rutina: 'Rutina', alimentacion: 'Alimentación', suplementacion: 'Suplementación' }
  return `${modalMode.value === 'create' ? 'Agregar' : 'Editar'} ${map[modalType.value] || ''}`
})
const abrirModal = (tipo, modo, item = null) => {
  modalType.value = tipo
  modalMode.value = modo
  if (modo === 'edit' && item) {
    currentItemId.value = item.id
    formItem.value = {
      descripcion: item.descripcion ?? '',
      dia_semana: item.dia_semana ?? '',
      comida: item.comida ?? ''
    }
  } else {
    currentItemId.value = null
    formItem.value = { descripcion: '', dia_semana: '', comida: '' }
  }
  showModal.value = true
}
const cerrarModal = () => { showModal.value = false }

/* ======= CRUD ITEMS ======= */
const guardarItem = async () => {
  savingItem.value = true
  try {
    if (modalType.value === 'rutina') {
      if (modalMode.value === 'create') {
        await apiPlanif.addRutina({ planificacion_id: plan.value.id, ...formItem.value })
      } else {
        await apiPlanif.updRutina(currentItemId.value, {
          dia_semana: formItem.value.dia_semana,
          descripcion: formItem.value.descripcion
        })
      }
    } else if (modalType.value === 'alimentacion') {
      if (modalMode.value === 'create') {
        await apiPlanif.addAlimentacion({ planificacion_id: plan.value.id, ...formItem.value })
      } else {
        await apiPlanif.updAlimentacion(currentItemId.value, {
          comida: formItem.value.comida,
          descripcion: formItem.value.descripcion
        })
      }
    } else if (modalType.value === 'suplementacion') {
      if (modalMode.value === 'create') {
        await apiPlanif.addSuplementacion({ planificacion_id: plan.value.id, ...formItem.value })
      } else {
        await apiPlanif.updSuplementacion(currentItemId.value, { descripcion: formItem.value.descripcion })
      }
    }
    showModal.value = false
    await cargar()
  } catch { alert('Error al guardar') }
  finally { savingItem.value = false }
}

/* ======= ELIMINAR ITEMS (con alert) ======= */
const openConfirmItemDelete = (type, id) => { confirmItemDelete.value = { isOpen: true, type, id } }
const onConfirmItemDelete = async () => {
  const { type, id } = confirmItemDelete.value
  try {
    if (type === 'rutina')         await apiPlanif.delRutina(id)
    if (type === 'alimentacion')   await apiPlanif.delAlimentacion(id)
    if (type === 'suplementacion') await apiPlanif.delSuplementacion(id)
    await cargar()
  } catch { alert('No se pudo eliminar') }
  finally { confirmItemDelete.value = { isOpen: false, type: '', id: null } }
}
</script>

<style scoped>
.header-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.title-wrap { min-width: 0; }
.action-wrap, .header-actions, .row-actions {
  display: flex; gap: 8px; align-items: center;
}
.icon-btn ion-icon { margin-right: 6px; }
.btn-text { display: inline-block; }
@media (max-width: 360px) {
  .btn-text { display: none; } /* en pantallas súper chicas, solo iconos */
}
</style>
