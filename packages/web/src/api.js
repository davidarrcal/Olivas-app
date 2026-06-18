const API_BASE = 'https://olivas-api.onrender.com/api';
const TIMEOUT = 15000;

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const config = { headers, signal: controller.signal, ...options };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem('olivas_token');
      localStorage.removeItem('olivas_user');
      window.dispatchEvent(new Event('auth-logout'));
      throw new Error('Sesion expirada. Vuelve a iniciar sesion.');
    }

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error || data.message || `Error ${response.status}`;
      const details = data.detalles ? data.detalles.join('. ') : '';
      throw new Error(details ? `${msg}: ${details}` : msg);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('El servidor esta tardando en responder. Esto es normal si lleva tiempo sin usarse. Intentalo de nuevo en 30 segundos.');
    }
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