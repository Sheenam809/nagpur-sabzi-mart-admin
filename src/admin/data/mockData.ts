import type {
  Order, Product, Customer, Review, BulkOrder, Payment,
  RevenueDataPoint, TopProduct, Notification, LowStockItem, KPIMetric
} from '../types';

export const kpiMetrics: KPIMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '₹4,82,350',
    change: 18.4,
    changeLabel: 'vs last month',
    icon: 'TrendingUp',
    color: 'green',
    trend: 'up',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '2,847',
    change: 12.1,
    changeLabel: 'vs last month',
    icon: 'ShoppingCart',
    color: 'blue',
    trend: 'up',
  },
  {
    id: 'customers',
    label: 'Active Customers',
    value: '1,234',
    change: 8.7,
    changeLabel: 'vs last month',
    icon: 'Users',
    color: 'amber',
    trend: 'up',
  },
  {
    id: 'aov',
    label: 'Avg. Order Value',
    value: '₹169',
    change: -2.3,
    changeLabel: 'vs last month',
    icon: 'Receipt',
    color: 'violet',
    trend: 'down',
  },
];

export const revenueData: RevenueDataPoint[] = [
  { date: 'Jan', revenue: 280000, orders: 1420, customers: 640 },
  { date: 'Feb', revenue: 320000, orders: 1680, customers: 720 },
  { date: 'Mar', revenue: 295000, orders: 1520, customers: 680 },
  { date: 'Apr', revenue: 380000, orders: 1920, customers: 840 },
  { date: 'May', revenue: 420000, orders: 2180, customers: 920 },
  { date: 'Jun', revenue: 465000, orders: 2340, customers: 1020 },
  { date: 'Jul', revenue: 482350, orders: 2847, customers: 1234 },
];

export const topProducts: TopProduct[] = [
  { name: 'Tomatoes', sales: 1240, revenue: 62000, percentage: 28, image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?w=60&h=60&fit=crop' },
  { name: 'Onions', sales: 980, revenue: 49000, percentage: 22, image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=60&h=60&fit=crop' },
  { name: 'Potatoes', sales: 860, revenue: 43000, percentage: 19, image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-wood-144248.jpeg?w=60&h=60&fit=crop' },
  { name: 'Spinach', sales: 640, revenue: 32000, percentage: 14, image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?w=60&h=60&fit=crop' },
  { name: 'Capsicum', sales: 480, revenue: 24000, percentage: 11, image: 'https://images.pexels.com/photos/175834/pexels-photo-175834.jpeg?w=60&h=60&fit=crop' },
  { name: 'Cucumber', sales: 280, revenue: 14000, percentage: 6, image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?w=60&h=60&fit=crop' },
];

export const recentOrders: Order[] = [
  { id: '1', orderNumber: 'NSM-2847', customer: 'Priya Sharma', items: 4, total: 248, status: 'Delivered', deliveryAddress: 'Dharampeth, Nagpur', createdAt: '2026-06-15T09:30:00', paymentMethod: 'UPI', isBulk: false },
  { id: '2', orderNumber: 'NSM-2846', customer: 'Rahul Deshmukh', items: 2, total: 89, status: 'Out for Delivery', deliveryAddress: 'Sitabuldi, Nagpur', createdAt: '2026-06-15T09:10:00', paymentMethod: 'COD', isBulk: false },
  { id: '3', orderNumber: 'NSM-2845', customer: 'Anita Wankhede', items: 7, total: 432, status: 'Packed', deliveryAddress: 'Civil Lines, Nagpur', createdAt: '2026-06-15T08:55:00', paymentMethod: 'Card', isBulk: false },
  { id: '4', orderNumber: 'NSM-2844', customer: 'Vikram Nair', items: 1, total: 45, status: 'Placed', deliveryAddress: 'Ramdaspeth, Nagpur', createdAt: '2026-06-15T08:40:00', paymentMethod: 'Wallet', isBulk: false },
  { id: '5', orderNumber: 'NSM-2843', customer: 'Sunita Patel', items: 3, total: 176, status: 'Cancelled', deliveryAddress: 'Pratap Nagar, Nagpur', createdAt: '2026-06-15T08:20:00', paymentMethod: 'UPI', isBulk: false },
  { id: '6', orderNumber: 'NSM-2842', customer: 'Deepak Joshi', items: 5, total: 315, status: 'Delivered', deliveryAddress: 'Manewada, Nagpur', createdAt: '2026-06-15T07:55:00', paymentMethod: 'UPI', isBulk: false },
];

export const allOrders: Order[] = [
  ...recentOrders,
  { id: '7', orderNumber: 'NSM-2841', customer: 'Kavita Rane', items: 6, total: 389, status: 'Delivered', deliveryAddress: 'Shankar Nagar, Nagpur', createdAt: '2026-06-14T18:30:00', paymentMethod: 'Card', isBulk: false },
  { id: '8', orderNumber: 'NSM-2840', customer: 'Ajay Bhosle', items: 3, total: 167, status: 'Delivered', deliveryAddress: 'Trimurti Nagar, Nagpur', createdAt: '2026-06-14T16:10:00', paymentMethod: 'UPI', isBulk: false },
  { id: '9', orderNumber: 'NSM-2839', customer: 'Meera Kulkarni', items: 8, total: 521, status: 'Delivered', deliveryAddress: 'Sadar, Nagpur', createdAt: '2026-06-14T14:45:00', paymentMethod: 'Net Banking', isBulk: false },
  { id: '10', orderNumber: 'NSM-2838', customer: 'Ravi Thakur', items: 2, total: 94, status: 'Cancelled', deliveryAddress: 'Wardhaman Nagar, Nagpur', createdAt: '2026-06-14T12:30:00', paymentMethod: 'COD', isBulk: false },
  { id: '11', orderNumber: 'NSM-B0124', customer: 'Ganesh Traders', items: 24, total: 4200, status: 'Delivered', deliveryAddress: 'Itwari Market, Nagpur', createdAt: '2026-06-14T08:00:00', paymentMethod: 'Net Banking', isBulk: true },
  { id: '12', orderNumber: 'NSM-2837', customer: 'Pooja Mishra', items: 5, total: 298, status: 'Delivered', deliveryAddress: 'Laxmi Nagar, Nagpur', createdAt: '2026-06-13T17:20:00', paymentMethod: 'UPI', isBulk: false },
];

export const products: Product[] = [
  { id: 'p1', name: 'Fresh Tomatoes', category: 'Vegetables', price: 40, originalPrice: 55, unit: '1 kg', stock: 245, sold: 1240, image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.5, reviews: 142, trending: true },
  { id: 'p2', name: 'Yellow Onions', category: 'Vegetables', price: 35, originalPrice: 45, unit: '1 kg', stock: 18, sold: 980, image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=80&h=80&fit=crop', status: 'low_stock', rating: 4.3, reviews: 98, trending: false },
  { id: 'p3', name: 'Potatoes', category: 'Vegetables', price: 30, originalPrice: 38, unit: '1 kg', stock: 320, sold: 860, image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-wood-144248.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.4, reviews: 76, trending: false },
  { id: 'p4', name: 'Baby Spinach', category: 'Leafy Greens', price: 25, originalPrice: 35, unit: '250 g', stock: 0, sold: 640, image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?w=80&h=80&fit=crop', status: 'out_of_stock', rating: 4.7, reviews: 210, trending: true },
  { id: 'p5', name: 'Green Capsicum', category: 'Vegetables', price: 60, originalPrice: 80, unit: '500 g', stock: 92, sold: 480, image: 'https://images.pexels.com/photos/175834/pexels-photo-175834.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.2, reviews: 54, trending: false },
  { id: 'p6', name: 'English Cucumber', category: 'Vegetables', price: 20, originalPrice: 28, unit: '1 pc', stock: 156, sold: 280, image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.1, reviews: 32, trending: false },
  { id: 'p7', name: 'Alphonso Mango', category: 'Fruits', price: 180, originalPrice: 220, unit: '1 kg', stock: 8, sold: 420, image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=80&h=80&fit=crop', status: 'low_stock', rating: 4.9, reviews: 312, trending: true },
  { id: 'p8', name: 'Bananas', category: 'Fruits', price: 45, originalPrice: 55, unit: '12 pcs', stock: 200, sold: 560, image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.6, reviews: 128, trending: false },
  { id: 'p9', name: 'Karela (Bitter Gourd)', category: 'Vegetables', price: 35, originalPrice: 42, unit: '500 g', stock: 0, sold: 180, image: 'https://images.pexels.com/photos/5938/food-salad-healthy-colorful.jpg?w=80&h=80&fit=crop', status: 'out_of_stock', rating: 3.9, reviews: 24, trending: false },
  { id: 'p10', name: 'Fresh Ginger', category: 'Spices', price: 80, originalPrice: 100, unit: '250 g', stock: 65, sold: 340, image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?w=80&h=80&fit=crop', status: 'active', rating: 4.5, reviews: 88, trending: false },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya.sharma@gmail.com', location: 'Dharampeth, Nagpur', totalOrders: 24, totalSpent: 4820, lastOrder: '2026-06-15', status: 'active', joinedAt: '2025-08-12', loyaltyPoints: 482 },
  { id: 'c2', name: 'Rahul Deshmukh', phone: '+91 87654 32109', email: 'rahul.deshmukh@gmail.com', location: 'Sitabuldi, Nagpur', totalOrders: 8, totalSpent: 1240, lastOrder: '2026-06-15', status: 'active', joinedAt: '2026-01-05', loyaltyPoints: 124 },
  { id: 'c3', name: 'Anita Wankhede', phone: '+91 76543 21098', email: 'anita.wankhede@yahoo.com', location: 'Civil Lines, Nagpur', totalOrders: 42, totalSpent: 9840, lastOrder: '2026-06-15', status: 'active', joinedAt: '2025-04-18', loyaltyPoints: 984 },
  { id: 'c4', name: 'Vikram Nair', phone: '+91 65432 10987', email: 'vikram.nair@gmail.com', location: 'Ramdaspeth, Nagpur', totalOrders: 3, totalSpent: 340, lastOrder: '2026-06-15', status: 'new', joinedAt: '2026-06-01', loyaltyPoints: 34 },
  { id: 'c5', name: 'Sunita Patel', phone: '+91 54321 09876', email: 'sunita.patel@gmail.com', location: 'Pratap Nagar, Nagpur', totalOrders: 0, totalSpent: 0, lastOrder: '2026-05-20', status: 'inactive', joinedAt: '2025-11-10', loyaltyPoints: 0 },
  { id: 'c6', name: 'Ganesh Traders', phone: '+91 99887 76655', email: 'ganesh.traders@business.com', location: 'Itwari, Nagpur', totalOrders: 18, totalSpent: 84200, lastOrder: '2026-06-14', status: 'active', joinedAt: '2025-06-22', loyaltyPoints: 8420 },
  { id: 'c7', name: 'Meera Kulkarni', phone: '+91 88776 65544', email: 'meera.kulkarni@gmail.com', location: 'Sadar, Nagpur', totalOrders: 31, totalSpent: 6240, lastOrder: '2026-06-14', status: 'active', joinedAt: '2025-07-08', loyaltyPoints: 624 },
  { id: 'c8', name: 'Deepak Joshi', phone: '+91 77665 54433', email: 'deepak.joshi@gmail.com', location: 'Manewada, Nagpur', totalOrders: 15, totalSpent: 2980, lastOrder: '2026-06-15', status: 'active', joinedAt: '2025-09-30', loyaltyPoints: 298 },
];

export const reviews: Review[] = [
  { id: 'r1', customer: 'Priya Sharma', product: 'Fresh Tomatoes', productImage: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?w=60&h=60&fit=crop', rating: 5, comment: 'Super fresh tomatoes! Arrived in perfect condition. Will definitely order again.', createdAt: '2026-06-14T15:30:00', status: 'published', helpful: 12 },
  { id: 'r2', customer: 'Rahul Deshmukh', product: 'Baby Spinach', productImage: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?w=60&h=60&fit=crop', rating: 4, comment: 'Very fresh and crispy. Quantity was less than expected but quality is excellent.', createdAt: '2026-06-14T12:00:00', status: 'published', helpful: 8 },
  { id: 'r3', customer: 'Anita Wankhede', product: 'Alphonso Mango', productImage: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=60&h=60&fit=crop', rating: 5, comment: 'Best Alphonso mangoes in Nagpur! Sweet and perfectly ripe. NagpurSabziMart is amazing!', createdAt: '2026-06-13T18:45:00', status: 'published', helpful: 24 },
  { id: 'r4', customer: 'Vikram Nair', product: 'Yellow Onions', productImage: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=60&h=60&fit=crop', rating: 3, comment: 'Delivery was late by 2 hours. Onions were fine but not the best quality this time.', createdAt: '2026-06-13T10:20:00', status: 'pending', helpful: 2 },
  { id: 'r5', customer: 'Meera Kulkarni', product: 'Fresh Ginger', productImage: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?w=60&h=60&fit=crop', rating: 5, comment: 'Fresh ginger with a strong aroma. Perfect for chai! Love the packaging too.', createdAt: '2026-06-12T09:15:00', status: 'published', helpful: 6 },
  { id: 'r6', customer: 'Deepak Joshi', product: 'Green Capsicum', productImage: 'https://images.pexels.com/photos/175834/pexels-photo-175834.jpeg?w=60&h=60&fit=crop', rating: 2, comment: 'Capsicum was not fresh. Some pieces were already soft. Very disappointed.', createdAt: '2026-06-11T20:30:00', status: 'flagged', helpful: 0 },
];

export const bulkOrders: BulkOrder[] = [
  { id: 'b1', orderNumber: 'NSM-B0124', customer: 'Ganesh Traders', businessName: 'Ganesh Wholesale Mart', items: 24, total: 42000, status: 'Delivered', deliveryDate: '2026-06-14', createdAt: '2026-06-13T08:00:00', contactPhone: '+91 99887 76655' },
  { id: 'b2', orderNumber: 'NSM-B0123', customer: 'Lakshmi Hotel Supplies', businessName: 'Lakshmi Hotel Chain', items: 48, total: 78500, status: 'Out for Delivery', deliveryDate: '2026-06-15', createdAt: '2026-06-14T09:30:00', contactPhone: '+91 88776 65544' },
  { id: 'b3', orderNumber: 'NSM-B0122', customer: 'Shri Ram Caterers', businessName: 'Shri Ram Events', items: 32, total: 56200, status: 'Packed', deliveryDate: '2026-06-16', createdAt: '2026-06-14T14:00:00', contactPhone: '+91 77665 54433' },
  { id: 'b4', orderNumber: 'NSM-B0121', customer: 'City Canteen', businessName: 'City Corporate Canteen', items: 18, total: 28400, status: 'Placed', deliveryDate: '2026-06-17', createdAt: '2026-06-15T07:00:00', contactPhone: '+91 66554 43322' },
  { id: 'b5', orderNumber: 'NSM-B0120', customer: 'Orange City Diner', businessName: 'Orange City Restaurants', items: 60, total: 95000, status: 'Delivered', deliveryDate: '2026-06-12', createdAt: '2026-06-11T10:00:00', contactPhone: '+91 55443 32211' },
];

export const payments: Payment[] = [
  { id: 'pay1', orderId: 'NSM-2847', customer: 'Priya Sharma', amount: 248, method: 'UPI', status: 'success', transactionId: 'UPI2847PRY', createdAt: '2026-06-15T09:30:00', gateway: 'Razorpay' },
  { id: 'pay2', orderId: 'NSM-2846', customer: 'Rahul Deshmukh', amount: 89, method: 'COD', status: 'pending', transactionId: 'COD2846RHL', createdAt: '2026-06-15T09:10:00', gateway: 'Cash' },
  { id: 'pay3', orderId: 'NSM-2845', customer: 'Anita Wankhede', amount: 432, method: 'Card', status: 'success', transactionId: 'CRD2845ANT', createdAt: '2026-06-15T08:55:00', gateway: 'Razorpay' },
  { id: 'pay4', orderId: 'NSM-2844', customer: 'Vikram Nair', amount: 45, method: 'Wallet', status: 'success', transactionId: 'WLT2844VKR', createdAt: '2026-06-15T08:40:00', gateway: 'Internal' },
  { id: 'pay5', orderId: 'NSM-2843', customer: 'Sunita Patel', amount: 176, method: 'UPI', status: 'refunded', transactionId: 'UPI2843SNT', createdAt: '2026-06-15T08:20:00', gateway: 'Razorpay' },
  { id: 'pay6', orderId: 'NSM-2842', customer: 'Deepak Joshi', amount: 315, method: 'UPI', status: 'success', transactionId: 'UPI2842DPK', createdAt: '2026-06-15T07:55:00', gateway: 'Razorpay' },
  { id: 'pay7', orderId: 'NSM-B0124', customer: 'Ganesh Traders', amount: 42000, method: 'Net Banking', status: 'success', transactionId: 'NB0124GNS', createdAt: '2026-06-13T08:15:00', gateway: 'HDFC' },
  { id: 'pay8', orderId: 'NSM-2841', customer: 'Kavita Rane', amount: 389, method: 'Card', status: 'failed', transactionId: 'CRD2841KVT', createdAt: '2026-06-14T18:30:00', gateway: 'Razorpay' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'New Order', message: 'Order NSM-2847 placed by Priya Sharma for ₹248', type: 'order', read: false, createdAt: '2026-06-15T09:30:00' },
  { id: 'n2', title: 'Low Stock Alert', message: 'Alphonso Mango stock is critically low (8 units remaining)', type: 'alert', read: false, createdAt: '2026-06-15T09:00:00' },
  { id: 'n3', title: 'New Review', message: 'Anita Wankhede gave 5 stars to Alphonso Mango', type: 'review', read: false, createdAt: '2026-06-15T08:30:00' },
  { id: 'n4', title: 'Payment Failed', message: 'Payment for order NSM-2841 failed. Customer notified.', type: 'payment', read: true, createdAt: '2026-06-14T18:35:00' },
  { id: 'n5', title: 'Bulk Order', message: 'New bulk order NSM-B0124 from Ganesh Traders worth ₹42,000', type: 'order', read: true, createdAt: '2026-06-13T08:05:00' },
  { id: 'n6', title: 'Out of Stock', message: 'Baby Spinach and Karela are now out of stock', type: 'alert', read: true, createdAt: '2026-06-12T10:00:00' },
];

export const lowStockItems: LowStockItem[] = [
  { id: 'p7', name: 'Alphonso Mango', stock: 8, threshold: 20, unit: 'kg', image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=60&h=60&fit=crop', category: 'Fruits' },
  { id: 'p2', name: 'Yellow Onions', stock: 18, threshold: 50, unit: 'kg', image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=60&h=60&fit=crop', category: 'Vegetables' },
  { id: 'p4', name: 'Baby Spinach', stock: 0, threshold: 30, unit: 'bundles', image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?w=60&h=60&fit=crop', category: 'Leafy Greens' },
  { id: 'p9', name: 'Karela', stock: 0, threshold: 15, unit: 'kg', image: 'https://images.pexels.com/photos/5938/food-salad-healthy-colorful.jpg?w=60&h=60&fit=crop', category: 'Vegetables' },
];

export const categoryBreakdown = [
  { name: 'Vegetables', value: 45, color: '#16a34a' },
  { name: 'Fruits', value: 28, color: '#2563eb' },
  { name: 'Leafy Greens', value: 15, color: '#d97706' },
  { name: 'Spices', value: 8, color: '#dc2626' },
  { name: 'Others', value: 4, color: '#7c3aed' },
];

export const deliveryZones = [
  { zone: 'Dharampeth', orders: 420, percentage: 18 },
  { zone: 'Civil Lines', orders: 380, percentage: 16 },
  { zone: 'Sitabuldi', orders: 340, percentage: 14 },
  { zone: 'Sadar', orders: 280, percentage: 12 },
  { zone: 'Ramdaspeth', orders: 240, percentage: 10 },
  { zone: 'Others', orders: 710, percentage: 30 },
];
