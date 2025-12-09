import axios from 'axios';

// Helper: read cookie value
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // send/receive cookies
});

// Attach CSRF token from cookie to requests that need it
api.interceptors.request.use((config) => {
  // Only attach for unsafe methods or when hitting protected endpoints.
  const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method) || config.url?.includes('/api/auth/me');
  if (needsCsrf) {
    const csrf = getCookie('csrf_token');
    if (csrf) {
      config.headers['x-csrf-token'] = csrf;
    }
  }
  return config;
});

export default api;
