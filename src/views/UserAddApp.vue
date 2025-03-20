<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold dark:text-white">{{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
      <button 
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <span class="sr-only">Fechar</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <form @submit.prevent="saveUser" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
        <input type="text" id="name" v-model="userData.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input type="email" id="email" v-model="userData.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>

      <!-- Password fields for new users -->
      <div v-if="!isEditing">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
        <input type="password" id="password" v-model="userData.password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>

      <div v-if="!isEditing">
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmação de Senha</label>
        <input type="password" id="password_confirmation" v-model="userData.password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
      </div>
      
      <!-- Optional password change for editing users -->
      <div v-if="isEditing" class="mt-8">
        <div class="flex items-center mb-3">
          <input 
            id="change-password" 
            type="checkbox" 
            v-model="changePassword" 
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="change-password" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Alterar senha
          </label>
        </div>
        
        <div v-if="changePassword" class="space-y-4">
          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
            <input type="password" id="new-password" v-model="userData.password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>

          <div>
            <label for="new-password-confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
            <input type="password" id="new-password-confirmation" v-model="userData.password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>
        </div>
      </div>

      <div>
        <label for="company_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
        <select id="company_id" v-model="userData.company_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
          <option value="">Selecione uma empresa</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.name }}</option>
        </select>
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
        <input type="text" id="phone" v-model="userData.phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>

      <div class="pt-4">
        <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'user-saved']);

const companies = ref([]);
const userData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  company_id: '',
  phone: ''
});

// Add a flag for password change option
const changePassword = ref(false);

// Watch for changes to the user prop for editing mode
watch(() => props.user, (newUser) => {
  if (newUser && Object.keys(newUser).length > 0) {
    // When editing, don't include password fields initially
    // Use object spread to copy without password fields
    const userCopy = { ...newUser };
    delete userCopy.password;
    delete userCopy.password_confirmation;
    userData.value = userCopy;
  } else {
    // Reset form for new user
    userData.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      company_id: '',
      phone: ''
    };
  }
}, { immediate: true });

// Watch for changes to changePassword toggle
watch(changePassword, (value) => {
  if (!value) {
    // Clear password fields when user decides not to change password
    userData.value.password = '';
    userData.value.password_confirmation = '';
  }
});

const saveUser = async () => {
  try {
    const url = process.env.VUE_APP_BACKEND_URL + '/users';
    const method = props.isEditing ? 'PUT' : 'POST';
    const endpoint = props.isEditing ? `${url}/${userData.value.id}` : url;
    
    // Create a copy of userData to manipulate
    const dataToSend = { ...userData.value };
    
    // If editing and not changing password, remove password fields
    if (props.isEditing && !changePassword.value) {
      delete dataToSend.password;
      delete dataToSend.password_confirmation;
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });
    
    if (response.ok) {
      const savedUser = await response.json();
      emit('user-saved', savedUser);
    } else {
      console.error('Failed to save user');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getCompanies();
});

const getCompanies = async () => {
  try {
    const response = await fetch(process.env.VUE_APP_BACKEND_URL + '/company');
    const result  = await response.json();
    companies.value = result.data.companies;

  } catch (error) {
    console.error(error);
  }
};
</script>