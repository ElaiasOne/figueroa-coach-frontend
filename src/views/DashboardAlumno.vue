<!--frontend_figueroa_coach/src/views/DashboardAlumno.vue-->
<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container">
        <div class="card">
          <h2 class="title">Mis planificaciones</h2>
          <ion-list class="list-inset">
            <ion-item
              v-for="p in planes" :key="p.id"
              button detail
              @click="$router.push(`/planificacion/${p.id}`)">
              <ion-label>
                <h3>{{ p.titulo }}</h3>
                <p>{{ rango(p.fecha_inicio, p.fecha_fin) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-skeleton-text v-if="loading" :animated="true" style="height: 80px" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonSkeletonText } from '@ionic/vue'
import { ref } from 'vue'
import { planificaciones as apiPlanif } from '@/services/api'

const planes = ref([])
const loading = ref(false)

const fetchPlanes = async () => {
  loading.value = true
  try { planes.value = await apiPlanif.listar() } finally { loading.value = false }
}
const rango = (ini, fin) => {
  if (!ini && !fin) return 'Sin fechas'
  const f = (d) => new Date(d).toLocaleDateString()
  return `${ini ? f(ini) : '¿?'} — ${fin ? f(fin) : '¿?'}`
}

fetchPlanes()
</script>
