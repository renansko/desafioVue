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
        <p v-if="validationErrors?.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ validationErrors.name[0] }}
        </p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input type="email" id="email" v-model="userData.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        <p v-if="validationErrors?.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ validationErrors.email[0] }}
        </p>
      </div>

      <!-- Password fields for new users -->
      <div v-if="!isEditing">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
        <input type="password" id="password" v-model="userData.password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        <p v-if="validationErrors?.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ validationErrors.password[0] }}
        </p>
      </div>

      <div v-if="!isEditing">
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmação de Senha</label>
        <input type="password" id="password_confirmation" v-model="userData.password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        <p v-if="validationErrors?.password_confirmation" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ validationErrors.password_confirmation[0] }}
        </p>
      </div>
      
      <!-- Company field - hide in registration context if isRegistrationForm prop is true -->
      <div v-if="!isRegistrationForm">
        <label for="company_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
        <select 
          id="company_id" 
          v-model="userData.company_id" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione uma empresa</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.name }}</option>
        </select>
        <p v-if="validationErrors?.company_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ validationErrors.company_id[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefones</label>
        
        <div v-for="(phone, index) in phoneNumbers" :key="index" class="flex mt-2">
          <input 
            type="text" 
            v-model="phoneNumbers[index]" 
            @input="formatPhoneNumber(index)"
            class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            placeholder="(00) 00000-0000"
            maxlength="15"
          />
          <button 
            type="button" 
            @click="removePhone(index)" 
            class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-r-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <button 
          type="button" 
          @click="addPhone" 
          class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Adicionar Telefone
        </button>
        
        <p v-if="validationErrors?.phones" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ Array.isArray(validationErrors.phones) ? validationErrors.phones[0] : validationErrors.phones }}
        </p>
      </div>

      <div class="pt-4">
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Processando...' : (isEditing ? 'Salvar' : 'Registrar') }}
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
  },
  validationErrors: {
    type: Object,
    default: () => ({})
  },
  isRegistrationForm: {
    type: Boolean,
    default: false
  }
});

// Add a new event for validation errors
const emit = defineEmits(['close', 'user-saved', 'register', 'validation-errors']);

const companies = ref([]);
const userData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  company_id: ''
});

const phoneNumbers = ref(['']);
const rawPhoneNumbers = ref(['']);
const loading = ref(false);

const changePassword = ref(false);

// Format phone number as user types
const formatPhoneNumber = (index) => {
  let phone = phoneNumbers.value[index];
  
  const digits = phone.replace(/\D/g, '');
  
  rawPhoneNumbers.value[index] = digits;
  
  let formatted = '';
  
  if (digits.length <= 2) {
    formatted = digits.length ? `(${digits}` : '';
  } else if (digits.length <= 6) {
    formatted = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else {
    formatted = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
  
  phoneNumbers.value[index] = formatted;
};

const addPhone = () => {
  phoneNumbers.value.push('');
  rawPhoneNumbers.value.push('');
};

const removePhone = (index) => {
  phoneNumbers.value.splice(index, 1);
  rawPhoneNumbers.value.splice(index, 1);
  if (phoneNumbers.value.length === 0) {
    phoneNumbers.value.push('');
    rawPhoneNumbers.value.push('');
  }
};

// Update the watch function to handle contacts array
watch(() => props.user, (newUser) => {
  if (newUser && Object.keys(newUser).length > 0) {
    const userCopy = { ...newUser };
    delete userCopy.password;
    delete userCopy.password_confirmation;
    userData.value = userCopy;
    
    if (newUser.contacts && Array.isArray(newUser.contacts) && newUser.contacts.length > 0) {
      rawPhoneNumbers.value = newUser.contacts.map(contact => contact.phone || '');
      
      phoneNumbers.value = newUser.contacts.map(contact => {
        const phone = contact.phone || '';
        if (!phone) return '';
        
        const digits = phone.replace(/\D/g, '');
        if (digits.length <= 2) {
          return digits.length ? `(${digits}` : '';
        } else if (digits.length <= 6) {
          return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
        } else {
          return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
        }
      });
    } else if (newUser.phone) {
      rawPhoneNumbers.value = [newUser.phone];
      
      const digits = newUser.phone.replace(/\D/g, '');
      let formatted = '';
      if (digits.length <= 2) {
        formatted = digits.length ? `(${digits}` : '';
      } else if (digits.length <= 6) {
        formatted = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
      } else {
        formatted = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
      }
      
      phoneNumbers.value = [formatted];
    } else {
      phoneNumbers.value = [''];
      rawPhoneNumbers.value = [''];
    }
  } else {
    // Reset form for new user
    userData.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      company_id: ''
    };
    phoneNumbers.value = [''];
    rawPhoneNumbers.value = [''];
  }
}, { immediate: true });

watch(changePassword, (value) => {
  if (!value) {
    userData.value.password = '';
    userData.value.password_confirmation = '';
  }
});

// Update the saveUser function
const saveUser = async () => {
  loading.value = true;
  
  try {
    const dataToSend = { ...userData.value };
    
    if (dataToSend.company_id === '') {
      delete dataToSend.company_id;
    }
    
    const validPhones = rawPhoneNumbers.value.filter(phone => phone.trim() !== '');
    console.log('Valid phones:', validPhones);
    
    const url = process.env.VUE_APP_BACKEND_URL + '/user';
    const method = props.isEditing ? 'PUT' : 'POST';
    const endpoint = props.isEditing ? `${url}/${userData.value.id}` : url;
    
    if (props.isEditing && !changePassword.value) {
      delete dataToSend.password;
      delete dataToSend.password_confirmation;
    }
    
    // Create base JSON data with cleaned user data
    const jsonData = {
      ...dataToSend
    };
    
    // Only add phones array if there are valid phone numbers
    if (validPhones.length > 0) {
      jsonData.phones = validPhones;
    }
    
    // Remove any properties that shouldn't be sent
    delete jsonData.contacts;
    
    console.log('Sending data to API:', jsonData);
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });

    const data = await response.json();
    
    if (response.ok) {
      emit('user-saved', data);
    } else {
      // Handle Laravel validation errors
      if (response.status === 422) {
        emit('validation-errors', data.errors || {});
        throw new Error(data.message || 'Validation failed');
      }
      throw new Error('Failed to save user');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!props.isRegistrationForm) {
    getCompanies();
  }
});

const getCompanies = async () => {
  try {
    const response = await fetch(process.env.VUE_APP_BACKEND_URL + '/company');
    const result = await response.json();
    companies.value = result.data.companies;
  } catch (error) {
    console.error(error);
  }
};
</script>