import { request } from './api';

export async function login(identity, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identity, password })
  });
}

export async function register(username, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin, password })
  });
}

export async function getMe() {
  return request('/auth/me', {
    method: 'GET'
  });
}

export async function getUnverifiedUsers() {
  return request('/auth/unverified', {
    method: 'GET'
  });
}

export async function verifyUser(id) {
  return request(`/auth/verify/${id}`, {
    method: 'POST'
  });
}



