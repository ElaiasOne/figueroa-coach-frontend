<template>
  <ion-page>
    <TopBar />

    <ion-content class="ion-padding">
      <!-- ====== Datos personales ====== -->
      <div class="card ion-margin-bottom" v-if="perfil">
        <h2>Mis datos</h2>
        <ion-list>
          <ion-item>
            <ion-label>
              <strong>Nombre:</strong> {{ perfil.nombre }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <strong>Sexo:</strong> {{ perfil.sexo || '—' }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <strong>Edad:</strong> {{ perfil.edad ?? '—' }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <strong>Altura:</strong> {{ perfil.altura_cm ? (perfil.altura_cm + ' cm') : '—' }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <strong>Peso actual:</strong> {{ perfil.peso_actual_kg ? (perfil.peso_actual_kg + ' kg') : '—' }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <strong>Peso objetivo:</strong> {{ perfil.peso_objetivo_kg ? (perfil.peso_objetivo_kg + ' kg') : '—' }}
            </ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- ====== Mis planificaciones ====== -->
      <div class="card">
        <h2>Mis planificaciones</h2>
        <ion-list>
          <ion-item v-if="!planes.length">
            <ion-label>No tenés planificaciones por el momento</ion-label>
          </ion-item>

          <ion-item v-for="p in planes" :key="p.id" button @click="$router.push(`/planificacion/${p.id}`)">
            <ion-label>
              <h3>{{ p.titulo }}</h3>
              <p>{{ p.fecha_inicio }} → {{ p.fecha_fin }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button size="small" @click="cargarTodo">Actualizar</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/vue'
import { ref, onMounted } from 'vue'
import { planificaciones as planApi, usuario as usuarioApi } from '@/services/api'

const perfil = ref(null)
const planes = ref([])

const cargarTodo = async () => {
  // Perfil del alumno
  perfil.value = await usuarioApi.me()
  // Sus planificaciones (el backend ya filtra por el usuario del token)
  planes.value = await planApi.listar()
}

onMounted(cargarTodo)
</script>
