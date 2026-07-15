import { request } from './api';

export async function getPublicProducts() {
  return request('/products', {
    method: 'GET'
  });
}

export async function getMyProducts() {
  return request('/products/my-products', {
    method: 'GET'
  });
}

export async function createProduct(productData) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
}

export async function updateProduct(id, productData) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE'
  });
}

export async function getProductById(id) {
  return request(`/products/${id}`, {
    method: 'GET'
  });
}

