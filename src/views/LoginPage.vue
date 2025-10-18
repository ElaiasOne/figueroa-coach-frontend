<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="card" style="max-width:480px; margin: 40px auto;">
        <h2 style="margin-bottom:12px;">Ingresar</h2>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="email" type="email" autocomplete="username" />
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input v-model="password" type="password" autocomplete="current-password" />
        </ion-item>
        <ion-button expand="block" class="ion-margin-top" @click="doLogin" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Entrar' }}
        </ion-button>
        <ion-text color="danger" v-if="error" class="ion-margin-top">{{ error }}</ion-text>
        <ion-note class="ion-margin-top">Ingrese con su usuario otorgado por el entrenador</ion-note>
        <!--<ion-note class="ion-margin-top">Usuario entrenador: coach@figueroa.coach</ion-note>-->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonNote } from '@ionic/vue'
import { auth } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const doLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const user = await auth.login(email.value, password.value)
    if (user.rol === 'ENTRENADOR') router.replace('/coach')
    else router.replace('/alumno')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Error de login'
  } finally {
    loading.value = false
  }
}
</script>
