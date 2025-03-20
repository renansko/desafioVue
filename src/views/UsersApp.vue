<template>

  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Usuários</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Lista de usuários cadastros no sistema.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          type="button" 
          @click="openSidebar"
          class="inline-flex items-center justify-center rounded-md border border-transparent 
          bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
          Novo usuário
        </button>
      </div>
    </div>
    
    <!-- Users table -->
    <div class="mt-8 flex flex-col">
      <!-- Table content stays the same -->
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Nome</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Empresa</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Telefone</th>
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
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ user.phone || 'N/A' }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.created_at) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
    
    <!-- Sidebar overlay -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
      v-if="isSidebarOpen"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <div 
      class="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Import and use the UserAddApp component -->
      <UserAddApp 
        :user="selectedUser" 
        :is-editing="!!selectedUser.id" 
        @close="closeSidebar" 
        @user-saved="handleUserSaved"
      />
    </div>
  </div>

</template>

<script setup>

import {onMounted, ref} from "vue";
import UserAddApp from "@/views/UserAddApp.vue";
import useAuth from '@/composables/useAuth';

const users = ref([]);
const companies = ref([]); // Add this to store companies for lookup
const isSidebarOpen = ref(false);
const selectedUser = ref({});

const { api } = useAuth();

// Update getUsers function to correctly access nested data
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    // Access the nested users array correctly
    users.value = response.data.data.users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    users.value = [];
  }
}

// Add a function to get companies for lookup
const getCompanies = async () => {
  try {
    const response = await api.get('/company');
    companies.value = response.data.data.companies;
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    companies.value = [];
  }
}

// Function to get company name by ID
const getCompanyName = (companyId) => {
  const company = companies.value.find(c => c.id === companyId);
  return company ? company.name : 'N/A';
}

// Add a date formatter
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

onMounted(() => {
  getUsers();
  getCompanies(); // Fetch companies on mount
})

const openSidebar = () => {
  selectedUser.value = {}; // Reset selected user for "new" mode
  isSidebarOpen.value = true;
};

// Open sidebar for editing a user
const editUser = (user) => {
  selectedUser.value = { ...user };
  isSidebarOpen.value = true;
};

// Add a delete user function
const deleteUser = async (user) => {
  if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
    try {
      const url = `${process.env.VUE_APP_BACKEND_URL}/users/${user.id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the users list
        await getUsers();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  // Give time for animation to complete before resetting the form
  setTimeout(() => {
    selectedUser.value = {};
  }, 300);
};

const handleUserSaved = async () => {
  await getUsers();
  closeSidebar();
};

</script>