import { request } from './api';

export async function getLogs() {
  return request('/logs');
}

export async function addLog(logData) {
  return request('/logs', {
    method: 'POST',
    body: JSON.stringify(logData)
  });
}
