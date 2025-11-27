import { authApi } from '@/lib/api/auth';

export async function logout() {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
