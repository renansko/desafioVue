import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

export default function useAuth() {
  const router = useRouter();
  const user = ref(authService.getCurrentUser());
  const isAuthenticated = computed(() => authService.isAuthenticated());
  const error = ref(null);
  const loading = ref(false);

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log(response)
        localStorage.setItem('user', JSON.stringify(response.data || {}));
        user.value = response.user;
        router.push('/home');
        return response.data;
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle Laravel error messages
      if (err.response && err.response.data) {
        if (err.response.status === 422) {
          // This is a validation error, let the component handle it
          throw err;
        } else {
          // This is a general error
          error.value = err.response.data.message || 'Login failed';
        }
      } else {
        error.value = 'Network error occurred';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authService.logout();
    user.value = null;
    router.push('/login');
  };

  const api = authService.getApiClient();

  return {
    user,
    isAuthenticated,
    error,
    loading,
    login,
    logout,
    api
  };
}