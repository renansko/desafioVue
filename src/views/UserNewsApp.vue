<template>
  <div class="px-4 sm:px-6 py-4">
    <div v-if="!effectiveUserId" class="text-center py-10 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div class="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-500 dark:text-gray-400">ID de usuário não disponível.</p>
    </div>
    
    <div v-else>
      <!-- User information header -->
      <div v-if="user" class="mb-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Notícias de {{ user.name }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {{ user.email }}
            </p>
          </div>
          <router-link 
            to="/users" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
          >
            Voltar para Lista
          </router-link>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ user.email }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Empresa</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ user.companies ? user.companies.name : 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de cadastro</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ formatDate(user.created_at) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- News filters and pagination controls -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div class="w-full sm:w-auto mb-4 sm:mb-0">
          <label for="per-page" class="sr-only">Itens por página</label>
          <select 
            id="per-page" 
            v-model="perPage" 
            @change="fetchUserNews"
            class="h-full rounded-md border-gray-300 py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="15">15 por página</option>
            <option value="25">25 por página</option>
          </select>
        </div>
        
        <div class="flex justify-center">
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              <span class="sr-only">Anterior</span>
              &laquo;
            </button>
            
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                currentPage === page 
                  ? 'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              <span class="sr-only">Próxima</span>
              &raquo;
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading, error, and empty states -->
      <div v-if="loading" class="flex justify-center my-10">
        <svg class="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="text-center py-10 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400">{{ error }}</p>
        <button
          @click="fetchUserNews"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Tentar novamente
        </button>
      </div>

      <div v-else-if="news.length === 0" class="text-center py-10 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <p class="text-gray-500 dark:text-gray-400">Nenhuma notícia encontrada para este usuário.</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2">
        <div 
          v-for="item in news" 
          :key="item.id" 
          class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg flex flex-col"
        >
          <div class="bg-gray-200 dark:bg-gray-700 h-40 relative">
            <img 
              v-if="item.image_url" 
              :src="item.image_url" 
              :alt="item.title" 
              class="w-full h-full object-cover"
            />
            <div 
              v-else 
              class="bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center h-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-500 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
              {{ formatDate(item.pubDate) }}
            </div>
          </div>
          
          <div class="px-4 py-4 flex-grow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{{ item.description }}</p>
          </div>
          
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right">
            <a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Ler notícia &rarr;
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination info -->
      <div v-if="totalItems > 0" class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Mostrando {{ (currentPage - 1) * perPage + 1 }} - {{ Math.min(currentPage * perPage, totalItems) }} de {{ totalItems }} notícias
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import useAuth from '@/composables/useAuth';

// eslint-disable-next-line no-undef
const props = defineProps({
  userId: {
    type: String,
    default: null
  }
});

const route = useRoute();
const { api } = useAuth();

const user = ref(null);
const news = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = ref(0);
const perPage = ref(15);
const error = ref(null);

const effectiveUserId = computed(() => {
  if (props.userId) {
    return props.userId;
  }
  
  return route.params.id;
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  } catch (e) {
    console.error('Date formatting error:', e);
    return dateString || 'N/A';
  }
};

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  
  currentPage.value = page;
  fetchUserNews();
};

// Fetch user news from API
const fetchUserNews = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const userId = effectiveUserId.value;
    
    if (!userId) {
      throw new Error('User ID is missing');
    }
    
    console.log('Fetching news for user ID:', userId);
    
    const response = await api.get(`/user/${userId}/news`, {
      params: {
        page: currentPage.value,
        per_page: perPage.value
      }
    });
    
    console.log('API response:', response);
    const data = response.data;
    
    user.value = data.user;
    
    news.value = Array.isArray(data.news.data) ? data.news.data : [];
    
    totalItems.value = data.news.total;
    totalPages.value = data.news.last_page;
    currentPage.value = data.news.current_page;
    
  } catch (err) {
    console.error('Error fetching user news:', err);
    error.value = err.message || 'Erro ao carregar notícias';
    news.value = [];
  } finally {
    loading.value = false;
  }
};

watch(effectiveUserId, (newId) => {
  console.log('User ID changed:', newId);
  if (newId) {
    fetchUserNews();
  }
}, { immediate: true });

onMounted(() => {
  console.log('UserNewsApp component mounted');
  console.log('Route params:', route.params);
  console.log('Props userId:', props.userId);
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>