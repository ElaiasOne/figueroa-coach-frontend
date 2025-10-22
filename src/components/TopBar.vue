<template>
  <!-- Fondo sólido para asegurar contraste -->
  <ion-header :translucent="false" class="topbar">
    <ion-toolbar color="light">
      <ion-title class="topbar-title">FIGUEROA COACH</ion-title>

      <div slot="end" class="topbar-actions">
        <ion-button color="dark" fill="solid" size="small" class="topbar-btn" @click="goHome">
          <ion-icon :icon="homeOutline" slot="start" />
          <span class="btn-text">Inicio</span>
        </ion-button>

        <ion-button color="danger" fill="solid" size="small" class="topbar-btn" @click="logout">
          <ion-icon :icon="logOutOutline" slot="start" />
          <span class="btn-text">Salir</span>
        </ion-button>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/api'
import { homeOutline, logOutOutline } from 'ionicons/icons'

const router = useRouter()

const goHome = () => {
  const role = localStorage.getItem('role')
  router.push(role === 'ENTRENADOR' ? { name: 'Coach' } : { name: 'Alumno' })
}

const logout = () => {
  auth.logout()
  router.replace({ name: 'Login' })
}
</script>

<style scoped>
.topbar-title { font-weight: 700; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-btn {
  --border-radius: 10px;
  min-height: 36px;
  padding-inline: 10px;
}

.btn-text { margin-left: 6px; }

/* En pantallas muy chicas mostramos solo el ícono */
@media (max-width: 380px) {
  .btn-text { display: none; }
}

/* Asegurar que los íconos tomen el color del botón */
ion-icon { color: currentColor; }
</style>
