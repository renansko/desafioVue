<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-20 w-auto" src="../assets/einov.jpg" alt="E-Inov" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isRegistering ? 'Criar uma conta' : 'Entre na sua conta' }}
        </h2>
      </div>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-300 dark:border-red-800" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
      
      <div v-if="connectionError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-300 dark:border-red-800 mb-4" role="alert">
        <span class="block sm:inline">{{ connectionError }}</span>
      </div>

      <!-- Login Form -->
      <form v-if="!isRegistering" class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Email address"
            />
            <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.email[0] }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Password"
            />
            <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.password[0] }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Processando...' : 'Entrar' }}
          </button>
        </div>
        
        <!-- Registration Link -->
        <div class="text-center">
          <button 
            type="button" 
            @click="isRegistering = true"
            class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Não tem uma conta? Registre-se
          </button>
        </div>
      </form>
      
      <!-- Registration using UserAddApp component -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <UserAddApp 
          :is-editing="false"
          @close="isRegistering = false"
          @user-saved="handleRegistrationComplete"
          :validation-errors="validationErrors"
          @register="handleRegisterWithComponent"
          @validation-errors="validationErrors = $event"
          :is-registration-form="true"
        />
        
        <!-- Login Link -->
        <div class="text-center p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            @click="isRegistering = false"
            class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Já tem uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserAddApp from '@/views/UserAddApp.vue';
import useAuth from '@/composables/useAuth';

const { login, error, loading } = useAuth();
const email = ref('');
const password = ref('');
const isRegistering = ref(false);
const validationErrors = ref({});
const connectionError = ref('');

const handleLogin = async () => {
  validationErrors.value = {}; 
  try {
    await login(email.value, password.value);
  } catch (err) {
    if (err.response && err.response.status === 422) {
      validationErrors.value = err.response.data.errors || {};
    }
  }
};

const handleRegisterWithComponent = async (userData) => {
  validationErrors.value = {}; 
  connectionError.value = ''; 
  
  try {
    const apiUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:8000';
    
    const dataToSend = { ...userData };
    
    if (dataToSend.company_id === '' || dataToSend.company_id === null) {
      delete dataToSend.company_id;
    }
    
    console.log('Sending registration data:', dataToSend);
    
    const response = await fetch(`${apiUrl}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });
    
    const data = await response.json();

    console.log(data)
    
    if (!response.ok) {
      if (response.status === 422) {
        validationErrors.value = data.errors || {};
        console.log('Validation errors:', data);
        
        let errorMessage = 'Validation failed';
        if (data.errors) {
          const firstErrorField = Object.keys(data.errors)[0];
          if (firstErrorField && Array.isArray(data.errors[firstErrorField])) {
            errorMessage = data.errors[firstErrorField][0];
          }
        }
        
        throw new Error(data.message || errorMessage);
      }
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Failed to fetch') {
      connectionError.value = 'Could not connect to the server. Please check your internet connection or try again later.';
    } else {
      connectionError.value = error.message;
    }
    throw error;
  }
};

const handleRegistrationComplete = () => {
  isRegistering.value = false;

};
</script>
