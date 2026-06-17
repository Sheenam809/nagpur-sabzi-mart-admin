import { useState } from 'react';
import CustomerDetailsDrawer from '../components/customers/CustomerDetailsDrawer';
import EditCustomerModal from '../components/customers/EditCustomerModal';
import { Search, Users, UserCheck, UserX, TrendingUp, Phone, Mail, MapPin } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { customers } from '../data/mockData';
import type { Customer } from '../types';
import { cn } from '../../lib/utils';


const statusFilters = ['All', 'active', 'new', 'inactive'] as const;

export default function Customers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'new' | 'inactive'>('All');
const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);


  const filtered = customers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statsCards = [
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'blue' },
    { label: 'Active', value: customers.filter(c => c.status === 'active').length, icon: UserCheck, color: 'green' },
    { label: 'New This Month', value: customers.filter(c => c.status === 'new').length, icon: TrendingUp, color: 'amber' },
    { label: 'Inactive', value: customers.filter(c => c.status === 'inactive').length, icon: UserX, color: 'red' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
  };

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-white">
              {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{row.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span>{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-foreground">
          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
          {row.phone}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-32">{row.location}</span>
        </div>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      sortable: true,
      align: 'center',
      render: (row) => <span className="text-sm font-semibold text-foreground">{row.totalOrders}</span>,
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">₹{row.totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{row.loyaltyPoints} pts</p>
        </div>
      ),
    },
    {
      key: 'lastOrder',
      header: 'Last Order',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.lastOrder).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      
  key: 'id',
  header: '',
  render: (row) => (
    <button
  onClick={() => {
    setSelectedCustomer(row);
    setShowCustomerDrawer(true);
  }}
  className="px-2.5 h-7 text-xs font-medium rounded-lg bg-secondary hover:bg-muted transition-colors text-foreground"
>
  View
</button>
  ),
},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} registered customers in Nagpur`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsCards.map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorMap[card.color])}>
              <card.icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <p className={cn('text-2xl font-bold', colorMap[card.color].split(' ')[0])}>{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Customers */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Customers by Spend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3).map((c, i) => (
            <div key={c.id} className={cn(
              'flex items-center gap-3 p-4 rounded-xl border',
              i === 0
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100 dark:from-amber-950/20 dark:to-yellow-950/20 dark:border-amber-900/30'
                : 'bg-secondary/50 border-border'
            )}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <span className={cn(
                  'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card',
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-orange-400 text-white'
                )}>#{i + 1}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.totalOrders} orders</p>
                <p className="text-sm font-bold text-primary">₹{c.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-medium whitespace-nowrap transition-all border capitalize',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        emptyState={
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No customers found"
            description="No customers match your search criteria."
          />
        }
      />
      {selectedCustomer && (
  <CustomerDetailsDrawer
  open={showCustomerDrawer}
  onOpenChange={setShowCustomerDrawer}
  customer={selectedCustomer}
  onEdit={() => setShowEditDialog(true)}
/>
)}
<EditCustomerModal
  open={showEditDialog}
  customer={selectedCustomer}
  onClose={() => setShowEditDialog(false)}
/>
    </div>
  );
}
