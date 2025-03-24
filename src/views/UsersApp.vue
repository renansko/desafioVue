<template>
  <div class="px-4 sm:px-6 lg:px-8">

    <!-- Existing Header Section -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Usuários</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Lista de usuários cadastros no sistema.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          type="button" 
          @click="openUserSidebar"
          class="inline-flex items-center justify-center rounded-md border border-transparent 
          bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
          Novo usuário
        </button>
      </div>
    </div>
    
    <!-- Users table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Nome</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Empresa</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Telefones</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">E-mail</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data de cadastro</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                <tr v-for="user in users" :key="user.email" class="dark:text-gray-300">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6">{{ user.name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ getCompanyName(user.company_id) }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div v-if="user.contacts && user.contacts.length > 1" class="flex flex-col space-y-1">
                      <div v-for="(contact, index) in user.contacts" :key="index" class="text-xs">
                        {{ formatPhone(contact.phone) }}
                      </div>
                    </div>
                    <span v-else>{{ getUserPhoneDisplay(user) }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.created_at) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <a 
                      href="#" 
                      @click.prevent="openNewsSidebar(user)" 
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      Ver Notícias<span class="sr-only">, {{ user.name }}</span>
                    </a>
                    <a href="#" @click.prevent="editUser(user)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                      Editar<span class="sr-only">, {{ user.name }}</span>
                    </a>
                    <a href="#" @click.prevent="deleteUser(user)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Deletar<span class="sr-only">, {{ user.name }}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Global overlay for both sidebars -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
      v-if="isUserSidebarOpen || isNewsSidebarOpen"
      @click="closeAllSidebars"
    ></div>
    
    <!-- Side bar users -->
    <div 
      class="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="isUserSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <UserAddApp 
        :user="selectedUser" 
        :is-editing="!!selectedUser.id" 
        @close="closeUserSidebar" 
        @user-saved="handleUserSaved"
      />
    </div>
    
    <!-- Add User  Sidebar - wider for news display -->
    <div 
      class="fixed right-0 top-0 h-full w-4/5 md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="isNewsSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold dark:text-white">
          Notícias de {{ selectedUserForNews?.name || '' }}
        </h2>
        <button 
          @click="closeNewsSidebar"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span class="sr-only">Fechar</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Render the news component -->
      <div v-if="isNewsSidebarOpen && selectedUserForNews">
        <UserNewsApp :userId="selectedUserForNews.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import UserAddApp from "@/views/UserAddApp.vue";
import UserNewsApp from "@/views/UserNewsApp.vue";
import useAuth from '@/composables/useAuth';

const users = ref([]);
const companies = ref([]);

// Separate state for the two sidebars
const isUserSidebarOpen = ref(false);
const isNewsSidebarOpen = ref(false);

const selectedUser = ref({});
const selectedUserForNews = ref({});

const { api } = useAuth();

const getUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data.data.users;
    console.log(response.data.data.users)
  } catch (error) {
    console.error('Failed to fetch users:', error);
    users.value = [];
  }
}

const getCompanies = async () => {
  try {
    const response = await api.get('/company');
    companies.value = response.data.data.companies;
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    companies.value = [];
  }
}

const getCompanyName = (companyId) => {
  const company = companies.value.find(c => c.id === companyId);
  return company ? company.name : 'N/A';
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) { 
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  } else if (digits.length === 11) { // Brazilian format with 9 prefix
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  } else {
    return phone; 
  }
};

const getUserPhoneDisplay = (user) => {
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    
    const digits = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) { 
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    } else if (digits.length === 11) { 
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    } else {
      return phone;
    }
  };

  // Check contats for users
  if (user.contacts && Array.isArray(user.contacts) && user.contacts.length > 0) {
    if (user.contacts.length === 1) {
      return formatPhone(user.contacts[0].phone);
    }
    return user.contacts
      .filter(contact => contact.phone) // Filter out empty phones
      .map(contact => formatPhone(contact.phone))
      .join(', ');
  }
  
  return user.phone ? formatPhone(user.phone) : 'N/A';
};

onMounted(() => {
  getUsers();
  getCompanies();
})

// User sidebar functions
const openUserSidebar = () => {
  selectedUser.value = {}; 
  isUserSidebarOpen.value = true;
};

const closeUserSidebar = () => {
  isUserSidebarOpen.value = false;
  setTimeout(() => {
    selectedUser.value = {};
  }, 300);
};

const openNewsSidebar = (user) => {
  selectedUserForNews.value = { ...user };
  isNewsSidebarOpen.value = true;
};

const closeNewsSidebar = () => {
  isNewsSidebarOpen.value = false;
  setTimeout(() => {
    selectedUserForNews.value = {};
  }, 300);
};

// Close all sidebars (for the overlay click)
const closeAllSidebars = () => {
  closeUserSidebar();
  closeNewsSidebar();
};

// Edit user function
const editUser = (user) => {
  selectedUser.value = { ...user };
  isUserSidebarOpen.value = true;
};

// Add a delete user function
const deleteUser = async (user) => {
  if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
    try {
      const url = `${process.env.VUE_APP_BACKEND_URL}/user/${user.id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await getUsers();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const handleUserSaved = async () => {
  await getUsers();
  closeUserSidebar();
};
</script>