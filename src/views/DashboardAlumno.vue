<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container">
        <!-- DATOS DEL ALUMNO -->
        <div class="card" v-if="me">
          <h2 class="title">Mis datos</h2>
          <ion-list class="list-inset">
            <ion-item><ion-label><b>Nombre:</b> {{ me.nombre }}</ion-label></ion-item>
            <ion-item><ion-label><b>Email:</b> {{ me.email }}</ion-label></ion-item>
            <ion-item v-if="me.sexo"><ion-label><b>Sexo:</b> {{ me.sexo }}</ion-label></ion-item>
            <ion-item v-if="me.edad !== null"><ion-label><b>Edad:</b> {{ me.edad }} años</ion-label></ion-item>
            <ion-item v-if="me.altura_cm !== null"><ion-label><b>Altura:</b> {{ me.altura_cm }} cm</ion-label></ion-item>
            <ion-item v-if="me.peso_actual_kg !== null"><ion-label><b>Peso actual:</b> {{ me.peso_actual_kg }} kg</ion-label></ion-item>
            <ion-item v-if="me.peso_objetivo_kg !== null"><ion-label><b>Peso objetivo:</b> {{ me.peso_objetivo_kg }} kg</ion-label></ion-item>
          </ion-list>
        </div>

        <!-- MIS PLANIFICACIONES -->
        <div class="card">
          <h2 class="title">Mis planificaciones</h2>
          <ion-list class="list-inset">
            <ion-item
  v-for="p in planes" :key="p.id"
  button detail
  @click="$router.push({ name: 'PlanDetalle', params: { id: p.id } })">
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
import { planificaciones as apiPlanif, usuario as apiUser } from '@/services/api'

const planes = ref([])
const loading = ref(false)
const me = ref(null)

const fetchPlanes = async () => {
  loading.value = true
  try { planes.value = await apiPlanif.listar() } finally { loading.value = false }
}
const fetchMe = async () => { me.value = await apiUser.me() }

const rango = (ini, fin) => {
  if (!ini && !fin) return 'Sin fechas'
  const f = (d) => new Date(d).toLocaleDateString()
  return `${ini ? f(ini) : '¿?'} — ${fin ? f(fin) : '¿?'}`
}

fetchMe()
fetchPlanes()
</script>
