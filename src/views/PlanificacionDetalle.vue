<template>
  <ion-page>
    <TopBar />

    <ion-content class="ion-padding">
      <div class="card" v-if="plan">
        <h2>{{ plan.titulo }}</h2>
        <p class="multiline">{{ plan.descripcion }}</p>
        <p><strong>Periodo:</strong> {{ plan.fecha_inicio }} → {{ plan.fecha_fin }}</p>

        <!-- Acciones de plan (solo entrenador) -->
        <div v-if="isCoach" class="ion-margin-bottom">
          <ion-button size="small" @click="editarTitulo">Editar título</ion-button>
          <ion-button size="small" @click="editarDescripcion">Editar descripción</ion-button>
          <ion-button color="danger" size="small" @click="eliminarPlan">Eliminar planificación</ion-button>
        </div>

        <!-- ================== RUTINAS ================== -->
        <ion-list class="ion-margin-top">
          <ion-item lines="full"><ion-label><strong>Rutinas</strong></ion-label></ion-item>

          <ion-item v-if="!plan.rutinas?.length">
            <ion-label>Sin rutinas cargadas</ion-label>
          </ion-item>

          <ion-item v-for="r in plan.rutinas" :key="r.id">
            <ion-label>
              <h3 style="margin-bottom:4px;">{{ r.dia_semana }}</h3>
              <div class="multiline">{{ r.descripcion }}</div>
            </ion-label>
            <div v-if="isCoach" slot="end">
              <ion-button size="small" @click="editarRutinaItem(r)">Editar</ion-button>
              <ion-button size="small" color="danger" @click="borrarRutinaItem(r)">Borrar</ion-button>
            </div>
          </ion-item>
        </ion-list>

        <!-- Form agregar Rutina (solo entrenador) -->
        <div v-if="isCoach" class="ion-margin-top card">
          <ion-item>
            <ion-label position="stacked">Día</ion-label>
            <ion-select v-model="rutina.dia_semana" interface="popover">
              <ion-select-option value="LUN">LUN</ion-select-option>
              <ion-select-option value="MAR">MAR</ion-select-option>
              <ion-select-option value="MIE">MIE</ion-select-option>
              <ion-select-option value="JUE">JUE</ion-select-option>
              <ion-select-option value="VIE">VIE</ion-select-option>
              <ion-select-option value="SAB">SAB</ion-select-option>
              <ion-select-option value="DOM">DOM</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="rutina.descripcion" rows="6" auto-grow />
          </ion-item>
          <ion-button class="ion-margin-top" @click="agregarRutina">Agregar rutina</ion-button>
        </div>

        <!-- ================== ALIMENTACIÓN ================== -->
        <ion-list class="ion-margin-top">
          <ion-item lines="full"><ion-label><strong>Alimentación</strong></ion-label></ion-item>

          <ion-item v-if="!plan.alimentaciones?.length">
            <ion-label>Sin alimentación cargada</ion-label>
          </ion-item>

          <ion-item v-for="a in plan.alimentaciones" :key="a.id">
            <ion-label>
              <h3 style="margin-bottom:4px;">{{ a.comida || '—' }}</h3>
              <div class="multiline">{{ a.descripcion }}</div>
            </ion-label>
            <div v-if="isCoach" slot="end">
              <ion-button size="small" @click="editarAlimItem(a)">Editar</ion-button>
              <ion-button size="small" color="danger" @click="borrarAlimItem(a)">Borrar</ion-button>
            </div>
          </ion-item>
        </ion-list>

        <!-- Form agregar Alimentación (solo entrenador) -->
        <div v-if="isCoach" class="ion-margin-top card">
          <ion-item>
            <ion-label position="stacked">Comida</ion-label>
            <ion-select v-model="alim.comida" placeholder="Seleccionar" interface="popover">
              <ion-select-option value="DESAYUNO">DESAYUNO</ion-select-option>
              <ion-select-option value="ALMUERZO">ALMUERZO</ion-select-option>
              <ion-select-option value="MERIENDA">MERIENDA</ion-select-option>
              <ion-select-option value="CENA">CENA</ion-select-option>
              <ion-select-option value="COLACION">COLACION</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="alim.descripcion" rows="6" auto-grow />
          </ion-item>
          <ion-button class="ion-margin-top" @click="agregarAlimentacion">Agregar alimentación</ion-button>
        </div>

        <!-- ================== SUPLEMENTACIÓN ================== -->
        <ion-list class="ion-margin-top">
          <ion-item lines="full"><ion-label><strong>Suplementación</strong></ion-label></ion-item>

          <ion-item v-if="!plan.suplementaciones?.length">
            <ion-label>Sin suplementación cargada</ion-label>
          </ion-item>

          <ion-item v-for="s in plan.suplementaciones" :key="s.id">
            <ion-label>
              <div class="multiline">{{ s.descripcion }}</div>
            </ion-label>
            <div v-if="isCoach" slot="end">
              <ion-button size="small" @click="editarSuplItem(s)">Editar</ion-button>
              <ion-button size="small" color="danger" @click="borrarSuplItem(s)">Borrar</ion-button>
            </div>
          </ion-item>
        </ion-list>

        <!-- Form agregar Suplementación (solo entrenador) -->
        <div v-if="isCoach" class="ion-margin-top card">
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="supl.descripcion" rows="6" auto-grow />
          </ion-item>
          <ion-button class="ion-margin-top" @click="agregarSuplementacion">Agregar suplementación</ion-button>
        </div>
      </div> <!-- cierre del card principal -->
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonTextarea,
  IonButton, IonSelect, IonSelectOption, IonInput,
  IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { planificaciones as planApi } from '@/services/api'

const route = useRoute()
const router = useRouter()
const plan = ref(null)

const rutina = ref({ dia_semana: 'LUN', descripcion: '' })
const alim   = ref({ comida: null, descripcion: '' })
const supl   = ref({ descripcion: '' })

const isCoach = computed(() => (localStorage.getItem('role') === 'ENTRENADOR'))

const cargar = async () => {
  plan.value = await planApi.detalle(route.params.id)
}

// ---- Acciones sobre la planificación ----
const editarTitulo = async () => {
  const t = prompt('Nuevo título', plan.value?.titulo || '')
  if (t === null) return
  await planApi.actualizar(route.params.id, { titulo: t })
  await cargar()
}
const editarDescripcion = async () => {
  const d = prompt('Nueva descripción', plan.value?.descripcion || '')
  if (d === null) return
  await planApi.actualizar(route.params.id, { descripcion: d })
  await cargar()
}
const eliminarPlan = async () => {
  if (!confirm('¿Eliminar esta planificación?')) return
  await planApi.eliminar(route.params.id)
  router.replace('/coach')
}

// ---- Rutinas ----
const agregarRutina = async () => {
  await planApi.addRutina({ planificacion_id: route.params.id, ...rutina.value })
  rutina.value = { dia_semana: 'LUN', descripcion: '' }
  await cargar()
}
const editarRutinaItem = async (it) => {
  const d = prompt('Descripción', it.descripcion || '')
  if (d === null) return
  const dia = prompt('Día (LUN/MAR/MIE/JUE/VIE/SAB/DOM)', it.dia_semana || 'LUN')
  if (dia === null) return
  await planApi.updRutina(it.id, { descripcion: d, dia_semana: dia })
  await cargar()
}
const borrarRutinaItem = async (it) => {
  if (!confirm('¿Borrar rutina?')) return
  await planApi.delRutina(it.id)
  await cargar()
}

// ---- Alimentación ----
const agregarAlimentacion = async () => {
  await planApi.addAlimentacion({ planificacion_id: route.params.id, ...alim.value })
  alim.value = { comida: null, descripcion: '' }
  await cargar()
}
const editarAlimItem = async (it) => {
  const comida = prompt('Comida (DESAYUNO/ALMUERZO/MERIENDA/CENA/COLACION)', it.comida || '')
  if (comida === null) return
  const d = prompt('Descripción', it.descripcion || '')
  if (d === null) return
  await planApi.updAlimentacion(it.id, { comida, descripcion: d })
  await cargar()
}
const borrarAlimItem = async (it) => {
  if (!confirm('¿Borrar ítem?')) return
  await planApi.delAlimentacion(it.id)
  await cargar()
}

// ---- Suplementación ----
const agregarSuplementacion = async () => {
  await planApi.addSuplementacion({ planificacion_id: route.params.id, ...supl.value })
  supl.value = { descripcion: '' }
  await cargar()
}
const editarSuplItem = async (it) => {
  const d = prompt('Descripción', it.descripcion || '')
  if (d === null) return
  await planApi.updSuplementacion(it.id, { descripcion: d })
  await cargar()
}
const borrarSuplItem = async (it) => {
  if (!confirm('¿Borrar ítem?')) return
  await planApi.delSuplementacion(it.id)
  await cargar()
}

onMounted(cargar)
</script>
