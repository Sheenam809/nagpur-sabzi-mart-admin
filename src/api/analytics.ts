import { apiRequest, buildQuery } from './client';
import type {
  Order,
  TopProduct,
  LowStockItem,
  RevenueDataPoint,
} from '../admin/types';

export interface DashboardKpi {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  avgOrderValue: number;
}

export interface DashboardData {
  kpi: DashboardKpi;
  recentOrders: Order[];
  topProducts: TopProduct[];
  lowStockItems: LowStockItem[];
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface DeliveryZone {
  zone: string;
  orders: number;
  percentage: number;
}

export interface PaymentSummary {
  success: number;
  pending: number;
  failed: number;
  refunded: number;
  totalAmount: number;
}

export const analyticsApi = {
  getDashboard() {
    return apiRequest<DashboardData>('/api/analytics/dashboard');
  },

  getRevenue(months = 7) {
    return apiRequest<RevenueDataPoint[]>(
      `/api/analytics/revenue${buildQuery({ months })}`
    );
  },

  getCategories() {
    return apiRequest<CategoryBreakdown[]>('/api/analytics/categories');
  },

  getDeliveryZones() {
    return apiRequest<DeliveryZone[]>('/api/analytics/delivery-zones');
  },

  getPaymentsSummary() {
    return apiRequest<PaymentSummary>('/api/analytics/payments-summary');
  },
};
