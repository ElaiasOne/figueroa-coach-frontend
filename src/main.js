// frontend_figueroa_coach/src/main.js
import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import router from './router'

/* Ionic core css */
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/display.css'

/* Optional utilities */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'

/* Theme variables */
import './assets/theme.css'

import App from './App.vue'

document.body.classList.remove('dark')

const app = createApp(App).use(IonicVue).use(router)

router.isReady().then(() => {
  // Restablecer scroll al montar (mejora UX móvil al navegar entre vistas)
  window.scrollTo({ top: 0, behavior: 'instant' })
  app.mount('#app')
})
