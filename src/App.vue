<template>
  <ion-app>
    <router-view v-slot="{ Component, route }">
      <!-- TopBar global, oculto cuando la ruta tiene meta.hideTopBar -->
      <TopBar v-if="!route.meta?.hideTopBar" />
      <component :is="Component" />
    </router-view>
  </ion-app>
</template>

<script setup>
import { IonApp } from '@ionic/vue'
import TopBar from '@/components/TopBar.vue'
</script>
