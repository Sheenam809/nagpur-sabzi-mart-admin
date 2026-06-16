import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Star,
  Layers, CreditCard, BarChart3, Settings, ChevronLeft,
  ChevronRight, Leaf, TrendingUp
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Page } from '../../types';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Overview' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: 14, group: 'Operations' },
  { id: 'bulk-orders', label: 'Bulk Orders', icon: Layers, badge: 3, group: 'Operations' },
  { id: 'products', label: 'Products', icon: Package, group: 'Catalog' },
  { id: 'customers', label: 'Customers', icon: Users, group: 'Customers' },
  { id: 'reviews', label: 'Reviews', icon: Star, badge: 2, group: 'Customers' },
  { id: 'payments', label: 'Payments', icon: CreditCard, group: 'Finance' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ collapsed, onToggle, currentPage, onNavigate }: SidebarProps) {
  const groups = [...new Set(navItems.map(i => i.group))];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col bg-card border-r border-border sidebar-transition overflow-hidden',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Brand */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-border shrink-0',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-md shadow-green-900/20">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 slide-in">
            <p className="font-bold text-sm text-foreground leading-tight">NagpurSabzi</p>
            <p className="text-[11px] text-muted-foreground font-medium">Admin Console</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5">
        {groups.map((group) => {
          const groupItems = navItems.filter(i => i.group === group);
          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  {group}
                </p>
              )}
              {collapsed && <div className="h-px bg-border mb-2 mx-1" />}
              {groupItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group mb-0.5',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <div className={cn('relative shrink-0', collapsed && 'mx-auto')}>
                      <Icon className={cn('w-[18px] h-[18px]', isActive ? 'text-primary-foreground' : '')} />
                      {item.badge && item.badge > 0 && (
                        <span className={cn(
                          'absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
                          isActive ? 'bg-white text-primary' : 'bg-red-500 text-white'
                        )}>
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <span className="slide-in flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge && item.badge > 0 && (
                      <span className={cn(
                        'slide-in text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                        isActive ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2.5 shrink-0">
        {!collapsed && (
          <div className="slide-in mb-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs font-semibold text-green-800 dark:text-green-300">Today's Revenue</p>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">₹14,820</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span className="slide-in">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
