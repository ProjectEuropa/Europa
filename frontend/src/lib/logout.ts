export function logout() {
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}
