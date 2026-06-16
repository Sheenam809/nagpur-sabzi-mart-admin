import React from 'react';
import {
  TrendingUp, ShoppingCart, Users, Receipt,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { KPIMetric } from '../../types';

const colorMap = {
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    icon: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    trend: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    bar: 'from-green-500 to-emerald-500',
    border: 'border-green-100 dark:border-green-900/30',
    glow: 'shadow-green-100 dark:shadow-green-900/20',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
    trend: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    bar: 'from-blue-500 to-sky-500',
    border: 'border-blue-100 dark:border-blue-900/30',
    glow: 'shadow-blue-100 dark:shadow-blue-900/20',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    trend: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    bar: 'from-amber-500 to-orange-500',
    border: 'border-amber-100 dark:border-amber-900/30',
    glow: 'shadow-amber-100 dark:shadow-amber-900/20',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    trend: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
    bar: 'from-red-500 to-rose-500',
    border: 'border-red-100 dark:border-red-900/30',
    glow: 'shadow-red-100 dark:shadow-red-900/20',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    icon: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
    trend: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30',
    bar: 'from-violet-500 to-purple-500',
    border: 'border-violet-100 dark:border-violet-900/30',
    glow: 'shadow-violet-100 dark:shadow-violet-900/20',
  },
};

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  ShoppingCart,
  Users,
  Receipt,
};

interface KPICardProps {
  metric: KPIMetric;
  loading?: boolean;
}

export default function KPICard({ metric, loading }: KPICardProps) {
  const colors = colorMap[metric.color];
  const Icon = iconMap[metric.icon] || TrendingUp;
  const isUp = metric.trend === 'up';

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 kpi-card-hover">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl animate-shimmer" />
          <div className="w-16 h-6 rounded-full animate-shimmer" />
        </div>
        <div className="w-24 h-8 rounded-lg animate-shimmer mb-2" />
        <div className="w-32 h-4 rounded animate-shimmer" />
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-2xl border bg-card p-5 kpi-card-hover relative overflow-hidden',
      colors.border
    )}>
      {/* Subtle background accent */}
      <div className={cn(
        'absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-50',
        colors.bg
      )} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.icon)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            isUp
              ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
              : metric.trend === 'down'
                ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
                : 'text-muted-foreground bg-muted'
          )}>
            {isUp
              ? <ArrowUpRight className="w-3 h-3" />
              : metric.trend === 'down'
                ? <ArrowDownRight className="w-3 h-3" />
                : null
            }
            {Math.abs(metric.change)}%
          </span>
        </div>

        <div className="mb-1">
          <p className="text-2xl font-bold text-foreground tracking-tight">{metric.value}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
          <p className="text-xs text-muted-foreground">{metric.changeLabel}</p>
        </div>

        {/* Bottom accent bar */}
        <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
          <div className={cn('h-full rounded-full bg-gradient-to-r w-3/4', colors.bar)} />
        </div>
      </div>
    </div>
  );
}
