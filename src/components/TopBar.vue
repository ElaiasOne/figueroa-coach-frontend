<template>
  <ion-header :translucent="true">
    <ion-toolbar color="light">
      <ion-title size="large">FIGUEROA COACH</ion-title>

      <ion-buttons slot="end">
        <ion-button aria-label="Inicio" color="dark" @click="goHome">
          <ion-icon name="person-circle-outline"></ion-icon>
        </ion-button>
        <ion-button aria-label="Salir" color="dark" @click="logout">
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

const logout = () => {
  auth.logout()
  location.href = '/login'
}
</script>

<style scoped>
/* garantizamos contraste en iOS/Android */
ion-toolbar {
  --background: #ffffff;
  --color: #111111;
}
ion-icon {
  font-size: 22px;
}
</style>
