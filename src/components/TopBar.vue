<!--// frontend_figueroa_coach/src/components/TopBar.vue-->

<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title size="large">FIGUEROA COACH</ion-title>
      <ion-buttons slot="end">
        <ion-button aria-label="Perfil" @click="goHome">
          <ion-icon name="person-circle-outline"></ion-icon>
        </ion-button>
        <ion-button aria-label="Salir" @click="logout">
          <ion-icon name="log-out-outline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/api'

const router = useRouter()
const goHome = () => {
  const role = localStorage.getItem('role')
  router.push(role === 'ENTRENADOR' ? '/coach' : '/alumno')
}
const logout = () => { auth.logout(); location.href = '/login' }
</script>
