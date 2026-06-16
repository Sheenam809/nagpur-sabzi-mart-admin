import { useState } from 'react';
import { Search, Filter, Download, MoreHorizontal, ShoppingCart } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { allOrders } from '../data/mockData';
import type { Order, OrderStatus } from '../types';
import { cn } from '../../lib/utils';

const statuses: Array<OrderStatus | 'All'> = ['All', 'Placed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusCounts = statuses.reduce((acc, s) => {
  acc[s] = s === 'All' ? allOrders.length : allOrders.filter(o => o.status === s).length;
  return acc;
}, {} as Record<string, number>);

function timeAgo(isoStr: string) {
  const mins = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');

  const filtered = allOrders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
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
            <p className="text-xs text-muted-foreground truncate max-w-36">{row.deliveryAddress}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      align: 'center',
      render: (row) => <span className="text-sm text-foreground">{row.items} items</span>,
    },
    {
      key: 'total',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">₹{row.total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{row.paymentMethod}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Placed',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">{timeAgo(row.createdAt)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      header: '',
      render: (_row) => (
        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${allOrders.length} total orders across all categories`}
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        }
      />

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
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders or customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 h-9 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Today\'s Revenue', value: '₹14,820', sub: '84 orders', color: 'text-green-600 dark:text-green-400' },
          { label: 'Avg. Order Value', value: '₹176', sub: '+4% this week', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Delivery Rate', value: '94.2%', sub: 'On-time delivery', color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Cancel Rate', value: '3.8%', sub: '↓ from 5.1%', color: 'text-red-600 dark:text-red-400' },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        emptyState={
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8" />}
            title="No orders found"
            description="No orders match your current filters. Try adjusting your search or status filter."
          />
        }
      />
    </div>
  );
}
