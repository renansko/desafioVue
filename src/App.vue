<template>
  <MainApp v-if="$route.meta.layout === 'default'">
    <router-view />
  </MainApp>
  
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import MainApp from './components/MainApp.vue'
</script>

