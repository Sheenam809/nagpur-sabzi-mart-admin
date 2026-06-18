import { apiRequest, buildQuery } from './client';
import type { Customer } from '../admin/types';

export interface CustomerFilters {
  status?: Customer['status'];
  search?: string;
}

export const customersApi = {
  getAll(filters?: CustomerFilters) {
    return apiRequest<Customer[]>(
      `/api/customers${buildQuery({
        status: filters?.status,
        search: filters?.search,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<Customer>(`/api/customers/${id}`);
  },

  create(data: Omit<Customer, 'id'>) {
    return apiRequest<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Customer>) {
    return apiRequest<Customer>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  },
};
