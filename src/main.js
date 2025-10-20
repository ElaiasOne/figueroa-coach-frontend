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
import { isPlatform } from '@ionic/vue'

import App from './App.vue'

const app = createApp(App).use(IonicVue).use(router)

if (isPlatform('mobile') || isPlatform('mobileweb')) {
  document.body.classList.remove('dark')  // fuerza modo claro
}
router.isReady().then(() => {
  app.mount('#app')
})
