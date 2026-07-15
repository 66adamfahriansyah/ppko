import { request } from './api';

export async function getMonitoring() {
  return request('/monitoring');
}

export async function updateControl(controlData) {
  return request('/monitoring/control', {
    method: 'POST',
    body: JSON.stringify(controlData)
  });
}
