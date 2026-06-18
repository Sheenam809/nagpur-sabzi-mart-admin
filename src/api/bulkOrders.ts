import { apiRequest, buildQuery } from './client';
import type { BulkOrder, OrderStatus } from '../admin/types';

export interface BulkOrderFilters {
  status?: OrderStatus;
  search?: string;
}

export const bulkOrdersApi = {
  getAll(filters?: BulkOrderFilters) {
    return apiRequest<BulkOrder[]>(
      `/api/bulk-orders${buildQuery({
        status: filters?.status,
        search: filters?.search,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<BulkOrder>(`/api/bulk-orders/${id}`);
  },

  create(data: Omit<BulkOrder, 'id'>) {
    return apiRequest<BulkOrder>('/api/bulk-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<BulkOrder>) {
    return apiRequest<BulkOrder>(`/api/bulk-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/bulk-orders/${id}`, {
      method: 'DELETE',
    });
  },
};
