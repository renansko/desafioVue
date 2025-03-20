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
      const response = await authService.login(email, password);
      user.value = response.user;
      router.push('/'); // Redirect to home after successful login
      return true;
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authService.logout();
    user.value = null;
    router.push('/login');
  };

  // Get the API client with auth header
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