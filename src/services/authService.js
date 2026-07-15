import { request } from './api';

export async function login(identity, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identity, password })
  });
}

export async function register(username, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
}
