export type Page =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'reviews'
  | 'bulk-orders'
  | 'payments'
  | 'analytics'
  | 'settings';

export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: 'green' | 'blue' | 'amber' | 'red' | 'violet';
  trend: 'up' | 'down' | 'neutral';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  phone?: string;
  customerAvatar?: string;
  items: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  createdAt: string;
  deliveryTime?: string;
  paymentMethod: string;
  isBulk: boolean;
  orderedProducts?: OrderedProduct[];
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Paid'
  | 'Pending'
  | 'Failed'
  | 'Refunded';

export interface OrderedProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  stock: number;
  sold: number;
  image: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'inactive';
  rating: number;
  reviews: number;
  trending: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'new';
  joinedAt: string;
  loyaltyPoints: number;
}

export interface Review {
  id: string;
  customer: string;
  customerAvatar?: string;
  product: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'published' | 'pending' | 'flagged';
  helpful: number;
}

export interface BulkOrder {
  id: string;
  orderNumber: string;
  customer: string;
  businessName: string;
  items: number;
  total: number;
  status: OrderStatus;
  deliveryDate: string;
  createdAt: string;
  contactPhone: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: 'UPI' | 'Card' | 'COD' | 'Wallet' | 'Net Banking';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
  gateway: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
  image: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'alert' | 'review' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  unit: string;
  image: string;
  category: string;
}
