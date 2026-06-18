import { apiRequest, buildQuery } from './client';
import type { Order, OrderStatus, PaymentStatus } from '../admin/types';

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  isBulk?: boolean;
  search?: string;
  limit?: number;
}

export const ordersApi = {
  getAll(filters?: OrderFilters) {
    return apiRequest<Order[]>(
      `/api/orders${buildQuery({
        status: filters?.status,
        paymentStatus: filters?.paymentStatus,
        isBulk: filters?.isBulk,
        search: filters?.search,
        limit: filters?.limit,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<Order>(`/api/orders/${id}`);
  },

  create(data: Omit<Order, 'id'>) {
    return apiRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Order>) {
    return apiRequest<Order>(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  },
};
