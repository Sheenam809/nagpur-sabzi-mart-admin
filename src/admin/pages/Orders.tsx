import { useState } from 'react';
import { Search, Download, MoreVertical, ShoppingCart } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { allOrders } from '../data/mockData';
import type { Order, OrderStatus, PaymentStatus } from '../types';
import { cn } from '../../lib/utils';
import OrderDetailsDrawer from '../components/orders/OrderDetailsDrawer';
import StatusTimelineDrawer from '../components/orders/StatusTimelineDrawer';

const statuses: Array<OrderStatus | 'All'> = ['All', 'Placed', 'Confirmed', 'Packed', 'In Transit', 'Delivered', 'Cancelled'];
const paymentStatuses: Array<PaymentStatus | 'All'> = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'All'>('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showTimelineDrawer, setShowTimelineDrawer] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = allOrders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search);
    
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    
    const matchPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;

    let matchDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      if (dateFilter === 'today') {
        matchDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        matchDate = orderDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        matchDate = orderDate >= oneMonthAgo;
      }
    }

    return matchSearch && matchStatus && matchPayment && matchDate;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDrawer(true);
    setOpenMenuId(null);
  };

  const handleViewTimeline = (order: Order) => {
    setSelectedOrder(order);
    setShowTimelineDrawer(true);
    setOpenMenuId(null);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Order Date', 'Total Amount', 'Order Status', 'Payment Status', 'Delivery Address'];
    const rows = filtered.map(o => [
      o.orderNumber,
      o.customer,
      o.phone || '',
      new Date(o.createdAt).toLocaleString(),
      `₹${o.total}`,
      o.status,
      o.paymentStatus,
      o.deliveryAddress,
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    totalOrders: allOrders.length,
    totalRevenue: allOrders.reduce((sum, o) => sum + o.total, 0),
    avgOrderValue: Math.round(allOrders.reduce((sum, o) => sum + o.total, 0) / allOrders.length),
    deliveredCount: allOrders.filter(o => o.status === 'Delivered').length,
    cancelledCount: allOrders.filter(o => o.status === 'Cancelled').length,
    paidCount: allOrders.filter(o => o.paymentStatus === 'Paid').length,
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">{row.orderNumber}</span>
          {row.isBulk && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              BULK
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">
              {row.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{row.customer}</p>
            <p className="text-xs text-muted-foreground">{row.phone || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Order Date',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">{new Date(row.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">₹{row.total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{row.items} items</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (row) => (
        <div className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium',
          row.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
          row.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          row.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
          'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
        )}>
          <div className={cn(
            'w-1.5 h-1.5 rounded-full',
            row.paymentStatus === 'Paid' ? 'bg-green-500' :
            row.paymentStatus === 'Pending' ? 'bg-amber-500' :
            row.paymentStatus === 'Failed' ? 'bg-red-500' :
            'bg-slate-500'
          )} />
          {row.paymentStatus}
        </div>
      ),
    },
    {
      key: 'deliveryAddress',
      header: 'Delivery Address',
      render: (row) => (
        <p className="text-sm text-foreground truncate max-w-xs">{row.deliveryAddress}</p>
      ),
    },
    {
      key: 'id',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {openMenuId === row.id && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
              <button
                onClick={() => handleViewDetails(row)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors first:rounded-t-lg"
              >
                View Details
              </button>
              <button
                onClick={() => handleViewTimeline(row)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                View Timeline
              </button>
              <button
                onClick={() => setOpenMenuId(null)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors last:rounded-b-lg"
              >
                Edit Status
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${filtered.length} orders • ${filtered.length > 0 ? `₹${filtered.reduce((sum, o) => sum + o.total, 0).toLocaleString()} total revenue` : 'No orders'}`}
        actions={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
          <p className="text-lg font-bold text-foreground">{stats.totalOrders}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-lg font-bold text-green-600">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
          <p className="text-lg font-bold text-blue-600">₹{stats.avgOrderValue}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Delivered</p>
          <p className="text-lg font-bold text-emerald-600">{stats.deliveredCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Cancelled</p>
          <p className="text-lg font-bold text-red-600">{stats.cancelledCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-lg font-bold text-teal-600">{stats.paidCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search and Status */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 border',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {s}
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              )}>
                {s === 'All' ? allOrders.length : allOrders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Payment Status and Date Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Payment:</span>
            <div className="flex gap-2">
              {paymentStatuses.map(ps => (
                <button
                  key={ps}
                  onClick={() => setPaymentFilter(ps)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
                    paymentFilter === ps
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  {ps}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Date:</span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
              ].map(d => (
                <button
                  key={d.value}
                  onClick={() => setDateFilter(d.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
                    dateFilter === d.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        emptyState={
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8" />}
            title="No orders found"
            description="No orders match your current filters. Try adjusting your search or filter criteria."
          />
        }
      />

      {selectedOrder && (
        <>
          <OrderDetailsDrawer
            open={showDetailsDrawer}
            onOpenChange={setShowDetailsDrawer}
            order={selectedOrder}
          />

          <StatusTimelineDrawer
            open={showTimelineDrawer}
            onOpenChange={setShowTimelineDrawer}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}
