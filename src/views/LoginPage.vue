 <!--frontend_figueroa_coach/src/views/LoginPage.vue-->
<template>
  <ion-page>
    <TopBar />
    <ion-content class="ion-padding">
      <div class="page-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Ingresar</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list class="list-inset">
              <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  v-model="email" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Contraseña</ion-label>
                <ion-input
                  :type="show ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  v-model="password" />
                <ion-button fill="clear" slot="end" @click="show = !show" aria-label="Ver contraseña">
                  <ion-icon :name="show ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-list>

            <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="onLogin">
              {{ loading ? 'Ingresando...' : 'Entrar' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon
} from '@ionic/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)

const onLogin = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const user = await auth.login(email.value, password.value)
    router.push(user.rol === 'ENTRENADOR' ? '/coach' : '/alumno')
  } catch (e) {
    alert(e?.response?.data?.message || 'Error de login')
  } finally {
    loading.value = false
  }
}
</script>
