import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package, ArrowUpRight, AlertCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { analyticsApi } from '../../api/analytics';
import { reviewsApi } from '../../api/reviews';
import { customersApi } from '../../api/customers';
import { ApiError } from '../../api/client';
import type { RevenueDataPoint } from '../types';
import type { CategoryBreakdown, DeliveryZone } from '../../api/analytics';
import { cn } from '../../lib/utils';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2.5 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">
            {p.name === 'revenue' ? `₹${(p.value / 1000).toFixed(0)}K` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const periods = ['7D', '30D', '3M', '6M', 'YTD', '1Y'] as const;

function periodToMonths(period: typeof periods[number]): number {
  switch (period) {
    case '7D':
    case '30D':
      return 1;
    case '3M':
      return 3;
    case '6M':
      return 6;
    case 'YTD':
      return new Date().getMonth() + 1;
    case '1Y':
      return 12;
    default:
      return 7;
  }
}

export default function Analytics() {
  const [period, setPeriod] = useState<typeof periods[number]>('6M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [kpi, setKpi] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    productsSold: 0,
  });
  const [returnRate, setReturnRate] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const months = periodToMonths(period);
        const [dashboard, revenue, categories, zones, reviews, customers] = await Promise.all([
          analyticsApi.getDashboard(),
          analyticsApi.getRevenue(months),
          analyticsApi.getCategories(),
          analyticsApi.getDeliveryZones(),
          reviewsApi.getAll(),
          customersApi.getAll(),
        ]);

        setKpi({
          totalRevenue: dashboard.kpi.totalRevenue,
          totalOrders: dashboard.kpi.totalOrders,
          activeCustomers: dashboard.kpi.activeCustomers,
          productsSold: dashboard.topProducts.reduce((sum, p) => sum + p.sales, 0),
        });
        setRevenueData(revenue);
        setCategoryBreakdown(categories);
        setDeliveryZones(zones.slice(0, 6));

        const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
        setReturnRate(customers.length > 0 ? Math.round((repeatCustomers / customers.length) * 100) : 0);

        setAvgRating(
          reviews.length > 0
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10)
            : 0
        );
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [period]);

  const kpiCards = [
    { label: 'Total Revenue', value: `₹${kpi.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Orders', value: kpi.totalOrders.toLocaleString('en-IN'), icon: ShoppingCart, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Customers', value: kpi.activeCustomers.toLocaleString('en-IN'), icon: Users, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Products Sold', value: kpi.productsSold.toLocaleString('en-IN'), icon: Package, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PageHeader
        title="Analytics"
        description="Comprehensive business intelligence and performance metrics"
        actions={
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  period === p
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 h-[120px] animate-shimmer" />
            ))
          : kpiCards.map(card => (
              <div key={card.label} className="rounded-xl border border-border bg-card p-4">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', card.bg, card.color)}>
                  <card.icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-3 h-3" />
                    Live
                  </span>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">Revenue vs Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly comparison trend</p>
          </div>
          {loading ? (
            <div className="h-60 animate-shimmer rounded-xl" />
          ) : revenueData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">
              No revenue data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs text-muted-foreground capitalize">{value}</span>}
                />
                <Bar yAxisId="revenue" dataKey="revenue" name="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar yAxisId="orders" dataKey="orders" name="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Category Sales</h3>
          <p className="text-xs text-muted-foreground mb-4">Revenue by category</p>
          {loading ? (
            <div className="h-60 animate-shimmer rounded-xl" />
          ) : categoryBreakdown.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">
              No category data
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryBreakdown.map((entry, i) => (
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
              <div className="space-y-2">
                {categoryBreakdown.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-xs text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Customer Growth</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly active customer trend</p>
          {loading ? (
            <div className="h-52 animate-shimmer rounded-xl" />
          ) : revenueData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
              No customer data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="custGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="customers" name="customers" stroke="#f59e0b" strokeWidth={2.5} fill="url(#custGradient)" dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Orders by Zone</h3>
          <p className="text-xs text-muted-foreground mb-5">Nagpur delivery area performance</p>
          {loading ? (
            <div className="space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-6 animate-shimmer rounded-full" />
              ))}
            </div>
          ) : deliveryZones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No delivery zone data</p>
          ) : (
            <div className="space-y-3">
              {deliveryZones.map(zone => (
                <div key={zone.zone} className="flex items-center gap-3">
                  <p className="text-xs font-medium text-foreground w-28 shrink-0">{zone.zone}</p>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${zone.percentage}%` }}
                    />
                  </div>
                  <div className="text-right shrink-0 w-20">
                    <span className="text-xs font-semibold text-foreground">{zone.orders}</span>
                    <span className="text-xs text-muted-foreground ml-1">({zone.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 h-[88px] animate-shimmer" />
            ))
          : [
            { label: 'Return Customer Rate', value: `${returnRate}%`, desc: 'Repeat purchases', positive: true },
            { label: 'Avg. Review Score', value: avgRating > 0 ? (avgRating / 10).toFixed(1) : '—', desc: 'Customer satisfaction', positive: true },
            { label: 'Active Customers', value: kpi.activeCustomers, desc: 'Currently active', positive: true },
            { label: 'Total Orders', value: kpi.totalOrders, desc: 'All time orders', positive: true },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-4">
              <p className={cn(
                'text-2xl font-bold',
                m.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {m.value}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
