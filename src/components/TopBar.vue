<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>FIGUEROA COACH</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="salir">Salir</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/api'

const router = useRouter()
const salir = () => {
  auth.logout()
  router.replace('/login')
}
</script>
