import { useState } from 'react';
import { Search, Layers, Phone, Download } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { bulkOrders } from '../data/mockData';
import type { BulkOrder } from '../types';
import { cn } from '../../lib/utils';

export default function BulkOrders() {
  const [search, setSearch] = useState('');

  const filtered = bulkOrders.filter(o =>
    !search ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.businessName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = bulkOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = Math.round(totalRevenue / bulkOrders.length);

  const columns: Column<BulkOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm font-semibold text-foreground">{row.orderNumber}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Business',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">{row.businessName}</p>
          <p className="text-xs text-muted-foreground">{row.customer}</p>
        </div>
      ),
    },
    {
      key: 'contactPhone',
      header: 'Contact',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {row.contactPhone}
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      align: 'center',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold text-foreground">{row.items}</span>,
    },
    {
      key: 'total',
      header: 'Total Value',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-bold text-foreground">₹{row.total.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'deliveryDate',
      header: 'Delivery',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">
            {new Date(row.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} placed
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      header: '',
      render: (_row) => (
        <div className="flex items-center gap-1">
          <button className="px-2.5 h-7 text-xs font-medium rounded-lg bg-secondary hover:bg-muted transition-colors text-foreground">
            Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Orders"
        description="Wholesale and institutional orders from business customers"
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Bulk Orders', value: bulkOrders.length, sub: 'All time', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: 'From bulk orders', color: 'text-green-600 dark:text-green-400' },
          { label: 'Avg. Order Size', value: `₹${avgOrderValue.toLocaleString()}`, sub: 'Per bulk order', color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Active This Week', value: bulkOrders.filter(o => o.status !== 'Delivered').length, sub: 'Pending delivery', color: 'text-violet-600 dark:text-violet-400' },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Business Clients */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Business Clients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {bulkOrders
            .sort((a, b) => b.total - a.total)
            .slice(0, 3)
            .map((order, i) => (
              <div key={order.id} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm',
                  i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
                )}>
                  #{i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{order.businessName}</p>
                  <p className="text-xs text-muted-foreground">{order.items} items</p>
                  <p className="text-sm font-bold text-primary">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bulk orders or businesses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        emptyState={
          <EmptyState
            icon={<Layers className="w-8 h-8" />}
            title="No bulk orders found"
            description="No bulk orders match your search."
          />
        }
      />
    </div>
  );
}
