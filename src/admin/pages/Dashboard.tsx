import { useState, useEffect } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Package, AlertTriangle,
  ArrowRight, Clock, CheckCircle,
  XCircle, Truck, RefreshCw
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import StatusBadge from '../components/shared/StatusBadge';
import { cn } from '../../lib/utils';
import {
  kpiMetrics, revenueData, topProducts, recentOrders,
  lowStockItems
} from '../data/mockData';
import type { Page } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2.5 shadow-lg shadow-black/10">
      <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">
            {p.name === 'revenue' ? `₹${(p.value / 1000).toFixed(0)}K` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const orderStatusData = [
  { name: 'Delivered', value: 54, color: '#16a34a', icon: CheckCircle },
  { name: 'In Transit', value: 22, color: '#f59e0b', icon: Truck },
  { name: 'Packed', value: 12, color: '#3b82f6', icon: Package },
  { name: 'Placed', value: 8, color: '#6366f1', icon: Clock },
  { name: 'Cancelled', value: 4, color: '#ef4444', icon: XCircle },
];

function timeAgo(isoStr: string) {
  const mins = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'revenue' | 'orders' | 'customers'>('revenue');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiMetrics.map(m => (
          <KPICard key={m.id} metric={m} loading={loading} />
        ))}
      </div>

      {/* Revenue Chart + Order Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Performance Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue, orders & customers — last 7 months</p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {(['revenue', 'orders', 'customers'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 capitalize',
                    activeChart === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-56 animate-shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v =>
                    activeChart === 'revenue'
                      ? `₹${(v / 1000).toFixed(0)}K`
                      : v.toLocaleString()
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {activeChart === 'revenue' && (
                  <Area type="monotone" dataKey="revenue" name="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#16a34a' }} />
                )}
                {activeChart === 'orders' && (
                  <Area type="monotone" dataKey="orders" name="orders" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorOrders)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6' }} />
                )}
                {activeChart === 'customers' && (
                  <Area type="monotone" dataKey="customers" name="customers" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorCustomers)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#f59e0b' }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Donut */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Order Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Today's breakdown</p>

          {loading ? (
            <div className="h-40 animate-shimmer rounded-xl mb-4" />
          ) : (
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, '']}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-2">
            {orderStatusData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-muted-foreground">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products + Category + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top Products Bar Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Top Products</h3>
              <p className="text-xs text-muted-foreground mt-0.5">By units sold this month</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="h-52 animate-shimmer rounded-xl" />
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs font-semibold text-foreground shrink-0 ml-2">
                        ₹{(p.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${p.percentage}%`,
                          background: `hsl(${142 - i * 20}, 70%, ${35 + i * 5}%)`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.sales} units</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Low Stock</h3>
                <p className="text-xs text-muted-foreground">{lowStockItems.length} items need restock</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-14 animate-shimmer rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                    item.stock === 0
                      ? 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30'
                      : 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30'
                  )}
                >
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      'text-xs font-bold',
                      item.stock === 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                    )}>
                      {item.stock === 0 ? 'Out' : `${item.stock} ${item.unit}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">min: {item.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigate('products')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Manage inventory
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live order feed</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-14 animate-shimmer rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-mono font-semibold text-foreground">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white">
                            {order.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-32">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-foreground">{order.items} items</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-foreground">₹{order.total}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
