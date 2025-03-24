<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <router-link 
        to="/users" 
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para Lista de Usuários
      </router-link>
    </div>
    
    <!-- Only render the component if route.params.id exists -->
    <div v-if="$route.params.id">
      <UserNewsApp />
    </div>
    <div v-else class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>ID de usuário não encontrado na URL. Volte para a lista de usuários e tente novamente.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UserNewsApp from '@/views/UserNewsApp.vue';

const route = useRoute();

onMounted(() => {
  console.log("UserNewsAppPage mounted, route params:", route.params);
});
</script>