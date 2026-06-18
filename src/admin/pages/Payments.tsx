import { useState, useEffect } from 'react';
import { Search, CreditCard, Download, RefreshCw, AlertCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { paymentsApi } from '../../api/payments';
import { ApiError } from '../../api/client';
import type { Payment } from '../types';
import { cn } from '../../lib/utils';

const methodColors: Record<string, string> = {
  UPI: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Card: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  COD: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  Wallet: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Net Banking': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'success' | 'pending' | 'failed' | 'refunded'>('All');
  const [methodFilter, setMethodFilter] = useState('All');

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError(null);
        const data = await paymentsApi.getAll();
        setPayments(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const filtered = payments.filter(p => {
    const matchSearch = !search ||
      p.orderId.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchMethod = methodFilter === 'All' || p.method === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const successRate = payments.length > 0
    ? Math.round((payments.filter(p => p.status === 'success').length / payments.length) * 100)
    : 0;

  const methodBreakdown = ['UPI', 'Card', 'COD', 'Wallet', 'Net Banking'].map(method => ({
    method,
    count: payments.filter(p => p.method === method).length,
    amount: payments.filter(p => p.method === method && p.status === 'success').reduce((sum, p) => sum + p.amount, 0),
  }));

  const columns: Column<Payment>[] = [
    {
      key: 'transactionId',
      header: 'Transaction',
      render: (row) => (
        <div>
          <p className="text-xs font-mono font-semibold text-foreground">{row.transactionId}</p>
          <p className="text-xs text-muted-foreground">Order: {row.orderId}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-white">
              {row.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <span className="text-sm text-foreground">{row.customer}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-bold text-foreground">₹{row.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-lg', methodColors[row.method] || 'bg-muted text-foreground')}>
            {row.method}
          </span>
          <span className="text-xs text-muted-foreground">{row.gateway}</span>
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
      header: 'Date',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">
            {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      header: '',
      render: (row) => (
        row.status === 'failed' || row.status === 'pending' ? (
          <button className="flex items-center gap-1 px-2.5 h-7 text-xs font-medium rounded-lg bg-secondary hover:bg-muted transition-colors text-foreground">
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        ) : null
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading payments</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PageHeader
        title="Payments"
        description="Transaction history and payment analytics"
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 h-[88px] animate-shimmer" />
            ))
          : [
          { label: 'Total Collected', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: 'Successful payments', color: 'text-green-600 dark:text-green-400' },
          { label: 'Success Rate', value: `${successRate}%`, sub: 'Payment success', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, sub: 'Awaiting settlement', color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Refunded', value: `₹${payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)}`, sub: 'Total refunds', color: 'text-red-600 dark:text-red-400' },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Payment Method Breakdown */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Payment Method Breakdown</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-28 animate-shimmer rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {methodBreakdown.map(m => (
            <div
              key={m.method}
              className={cn(
                'p-3 rounded-xl border transition-all cursor-pointer',
                methodFilter === m.method
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-secondary/30 hover:bg-secondary'
              )}
              onClick={() => setMethodFilter(methodFilter === m.method ? 'All' : m.method)}
            >
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-lg', methodColors[m.method] || 'bg-muted text-foreground')}>
                {m.method}
              </span>
              <p className="text-lg font-bold text-foreground mt-2">{m.count}</p>
              <p className="text-xs text-muted-foreground">transactions</p>
              <p className="text-xs font-medium text-primary mt-0.5">₹{m.amount.toLocaleString()}</p>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'success', 'pending', 'failed', 'refunded'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all border',
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
        loading={loading}
        emptyState={
          <EmptyState
            icon={<CreditCard className="w-8 h-8" />}
            title="No transactions found"
            description="No transactions match your current filters."
          />
        }
      />
    </div>
  );
}
