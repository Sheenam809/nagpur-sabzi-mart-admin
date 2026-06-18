import { apiRequest, buildQuery } from './client';
import type { Review } from '../admin/types';

export interface ReviewFilters {
  status?: Review['status'];
  productId?: string;
  rating?: number;
}

export const reviewsApi = {
  getAll(filters?: ReviewFilters) {
    return apiRequest<Review[]>(
      `/api/reviews${buildQuery({
        status: filters?.status,
        productId: filters?.productId,
        rating: filters?.rating,
      })}`
    );
  },

  getById(id: string) {
    return apiRequest<Review>(`/api/reviews/${id}`);
  },

  create(data: Omit<Review, 'id'>) {
    return apiRequest<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Review>) {
    return apiRequest<Review>(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string; id: string }>(`/api/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};
