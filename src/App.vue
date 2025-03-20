<template>
  <!-- Default layout with sidebar for authenticated pages -->
  <MainApp v-if="$route.meta.layout === 'default'">
    <router-view />
  </MainApp>
  
  <!-- Blank layout for login page -->
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import MainApp from './components/MainApp.vue'
</script>

