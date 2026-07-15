const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const BASE_URL = `http://${hostname}:3001/api`;

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };


  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Terjadi kesalahan pada server');
  }
  return data;
}
