 <!--frontend_figueroa_coach/src/views/PlanificacionDetalle.vue-->
<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container" v-if="plan">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ plan.titulo }}</ion-card-title>
            <ion-card-subtitle>{{ rangoFechas }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content class="multiline">
            {{ plan.descripcion || 'Sin descripción' }}
          </ion-card-content>
        </ion-card>

        <ion-accordion-group>
          <ion-accordion value="rutinas">
            <ion-item slot="header"><ion-label>Rutinas</ion-label></ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.rutinas?.length">
                <ion-item v-for="r in plan.rutinas" :key="r.id">
                  <ion-label>
                    <h3>{{ r.dia_semana }}</h3>
                    <p class="multiline">{{ r.descripcion }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin rutinas</ion-text>
            </div>
          </ion-accordion>

          <ion-accordion value="alimentacion">
            <ion-item slot="header"><ion-label>Alimentación</ion-label></ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.alimentaciones?.length">
                <ion-item v-for="a in plan.alimentaciones" :key="a.id">
                  <ion-label>
                    <h3>{{ a.comida }}</h3>
                    <p class="multiline">{{ a.descripcion }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin guías de alimentación</ion-text>
            </div>
          </ion-accordion>

          <ion-accordion value="suplementacion">
            <ion-item slot="header"><ion-label>Suplementación</ion-label></ion-item>
            <div slot="content" class="ion-padding">
              <ion-list class="list-inset" v-if="plan.suplementaciones?.length">
                <ion-item v-for="s in plan.suplementaciones" :key="s.id">
                  <ion-label>
                    <p class="multiline">{{ s.descripcion }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
              <ion-text v-else>Sin suplementación</ion-text>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>

      <ion-skeleton-text v-else :animated="true" style="height: 160px" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonText, IonSkeletonText
} from '@ionic/vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { planificaciones as apiPlanif } from '@/services/api'

const route = useRoute()
const plan = ref(null)
const rangoFechas = computed(() => {
  if (!plan.value) return ''
  const f = (d) => d ? new Date(d).toLocaleDateString() : '¿?'
  return `${f(plan.value.fecha_inicio)} — ${f(plan.value.fecha_fin)}`
})

onMounted(async () => {
  try { plan.value = await apiPlanif.detalle(route.params.id) } catch (e) { alert('No se pudo cargar') }
})
</script>
