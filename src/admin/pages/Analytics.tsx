import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { revenueData, categoryBreakdown, deliveryZones } from '../data/mockData';
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

export default function Analytics() {
  const [period, setPeriod] = useState<typeof periods[number]>('6M');

  const conversionRate = 3.2;
  const bounceRate = 28.4;
  const returnRate = 62.8;
  const npsScore = 72;

  return (
    <div className="space-y-6">
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

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: '₹4,82,350', change: '+18.4%', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Orders', value: '2,847', change: '+12.1%', icon: ShoppingCart, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'New Customers', value: '234', change: '+8.7%', icon: Users, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Products Sold', value: '8,420', change: '+15.2%', icon: Package, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', card.bg, card.color)}>
              <card.icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-3 h-3" />
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Trend + Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue & Orders Dual Axis */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">Revenue vs Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly comparison trend</p>
          </div>
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
        </div>

        {/* Category Breakdown Donut */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Category Sales</h3>
          <p className="text-xs text-muted-foreground mb-4">Revenue by category</p>
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
        </div>
      </div>

      {/* Customer Growth + Delivery Zones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Customer Growth */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Customer Growth</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly active customer trend</p>
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
        </div>

        {/* Delivery Zone Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-1">Orders by Zone</h3>
          <p className="text-xs text-muted-foreground mb-5">Nagpur delivery area performance</p>
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
        </div>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Conversion Rate', value: `${conversionRate}%`, desc: 'Visitors to orders', positive: true },
          { label: 'Return Customer Rate', value: `${returnRate}%`, desc: 'Repeat purchases', positive: true },
          { label: 'Cart Abandonment', value: `${bounceRate}%`, desc: 'Abandoned carts', positive: false },
          { label: 'NPS Score', value: npsScore, desc: 'Customer satisfaction', positive: true },
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
