import { apiRequest, buildQuery } from './client';
import type { Payment } from '../admin/types';

export interface PaymentFilters {
  status?: Payment['status'];
  method?: Payment['method'];
  orderId?: string;
}

export const paymentsApi = {
  getAll(filters?: PaymentFilters) {
    return apiRequest<Payment[]>(
      `/api/payments${buildQuery({
        status: filters?.status,
        method: filters?.method,
        orderId: filters?.orderId,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<Payment>(`/api/payments/${id}`);
  },

  create(data: Omit<Payment, 'id'>) {
    return apiRequest<Payment>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Payment>) {
    return apiRequest<Payment>(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/payments/${id}`, {
      method: 'DELETE',
    });
  },
};
