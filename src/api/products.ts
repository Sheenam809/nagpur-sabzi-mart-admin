import { apiRequest, buildQuery } from './client';
import type { Product, LowStockItem } from '../admin/types';

export interface ProductFilters {
  category?: string;
  status?: string;
  trending?: boolean;
  search?: string;
}

export const productsApi = {
  getAll(filters?: ProductFilters) {
    return apiRequest<Product[]>(
      `/api/products${buildQuery({
        category: filters?.category,
        status: filters?.status,
        trending: filters?.trending,
        search: filters?.search,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<Product>(`/api/products/${id}`);
  },

  getLowStock() {
    return apiRequest<LowStockItem[]>('/api/products/low-stock');
  },

  create(data: Omit<Product, 'id'>) {
    return apiRequest<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Product>) {
    return apiRequest<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};
