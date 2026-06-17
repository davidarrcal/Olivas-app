const API_BASE = 'https://olivas-api.onrender.com/api';

function getToken() {
  return localStorage.getItem('olivas_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { headers, ...options };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('olivas_token');
      localStorage.removeItem('olivas_user');
      window.location.href = '/';
      return;
    }

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `Error ${response.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con el servidor. Intentalo de nuevo en unos segundos.');
    }
    throw err;
  }
}

const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  del: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;