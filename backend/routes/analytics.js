const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const { formatDocs } = require('../utils/formatResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [orders, customers, products, recentOrders, lowStockProducts] = await Promise.all([
      Order.find({ status: { $ne: 'Cancelled' } }),
      Customer.find({ status: 'active' }),
      Product.find().sort({ sold: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Product.find({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } }).sort({ stock: 1 }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const activeCustomers = customers.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const topProducts = products.map((product) => {
      const revenue = product.sold * product.price;
      const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
      return {
        name: product.name,
        sales: product.sold,
        revenue,
        percentage: totalSold > 0 ? Math.round((product.sold / totalSold) * 100) : 0,
        image: product.image,
      };
    });

    res.json({
      kpi: {
        totalRevenue,
        totalOrders,
        activeCustomers,
        avgOrderValue,
      },
      recentOrders: formatDocs(recentOrders),
      topProducts,
      lowStockItems: formatDocs(lowStockProducts).map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        threshold: product.lowStockThreshold,
        unit: product.unit,
        image: product.image,
        category: product.category,
      })),
    });
  })
);

router.get(
  '/revenue',
  asyncHandler(async (req, res) => {
    const months = parseInt(req.query.months, 10) || 7;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $ne: 'Cancelled' },
    });

    const monthlyData = {};

    orders.forEach((order) => {
      const key = order.createdAt.toLocaleString('en-US', { month: 'short' });
      if (!monthlyData[key]) {
        monthlyData[key] = { date: key, revenue: 0, orders: 0, customers: new Set() };
      }
      monthlyData[key].revenue += order.total;
      monthlyData[key].orders += 1;
      monthlyData[key].customers.add(order.customer);
    });

    const revenueData = Object.values(monthlyData).map((entry) => ({
      date: entry.date,
      revenue: entry.revenue,
      orders: entry.orders,
      customers: entry.customers.size,
    }));

    res.json(revenueData);
  })
);

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const products = await Product.find();
    const categoryMap = {};
    const colors = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

    products.forEach((product) => {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + product.sold;
    });

    const total = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
    const breakdown = Object.entries(categoryMap).map(([name, sold], index) => ({
      name,
      value: total > 0 ? Math.round((sold / total) * 100) : 0,
      color: colors[index % colors.length],
    }));

    res.json(breakdown);
  })
);

router.get(
  '/delivery-zones',
  asyncHandler(async (_req, res) => {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const zoneMap = {};

    orders.forEach((order) => {
      const zone = order.deliveryAddress.split(',')[0].trim();
      zoneMap[zone] = (zoneMap[zone] || 0) + 1;
    });

    const total = Object.values(zoneMap).reduce((sum, val) => sum + val, 0);
    const zones = Object.entries(zoneMap)
      .map(([zone, count]) => ({
        zone,
        orders: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.orders - a.orders);

    res.json(zones);
  })
);

router.get(
  '/payments-summary',
  asyncHandler(async (_req, res) => {
    const payments = await Payment.find();
    const summary = {
      success: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      totalAmount: 0,
    };

    payments.forEach((payment) => {
      summary[payment.status] = (summary[payment.status] || 0) + 1;
      if (payment.status === 'success') {
        summary.totalAmount += payment.amount;
      }
    });

    res.json(summary);
  })
);

module.exports = router;
