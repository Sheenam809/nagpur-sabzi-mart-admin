import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, Moon, Sun, Menu, X, ChevronDown,
  User, LogOut, Settings, HelpCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { notifications } from '../../data/mockData';
import type { Page } from '../../types';

interface TopNavProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  reviews: 'Reviews',
  'bulk-orders': 'Bulk Orders',
  payments: 'Payments',
  analytics: 'Analytics',
  settings: 'Settings',
};

const searchSuggestions = [
  { label: 'NSM-2847 — Priya Sharma', page: 'orders' as Page, type: 'Order' },
  { label: 'Fresh Tomatoes', page: 'products' as Page, type: 'Product' },
  { label: 'Anita Wankhede', page: 'customers' as Page, type: 'Customer' },
  { label: 'Revenue Analytics', page: 'analytics' as Page, type: 'Page' },
  { label: 'Payment Settings', page: 'settings' as Page, type: 'Page' },
];

export default function TopNav({ collapsed, onToggleSidebar, isDark, onToggleTheme, currentPage, onNavigate }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions.slice(0, 4);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifTypeIcon: Record<string, string> = {
    order: '📦', alert: '⚠️', review: '⭐', payment: '💳', system: '🔔',
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 flex items-center gap-4 px-4 md:px-6 border-b border-border glass transition-all duration-250',
        collapsed ? 'left-[68px]' : 'left-[260px]'
      )}
    >
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-secondary transition-colors md:hidden"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-foreground truncate">{pageTitles[currentPage]}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          NagpurSabziMart Operations — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Global Search */}
      <div ref={searchRef} className="relative hidden md:block">
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 h-9 cursor-text transition-all duration-200',
            searchOpen ? 'w-72 border-primary/50 bg-background shadow-sm' : 'w-48'
          )}
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders, products..."
            className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground"
            onFocus={() => setSearchOpen(true)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          {!searchQuery && (
            <kbd className="hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground font-mono bg-border/60 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          )}
        </div>

        {searchOpen && (
          <div className="absolute top-full mt-2 left-0 w-72 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 fade-in">
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Results</p>
            </div>
            {filteredSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { onNavigate(s.page); setSearchOpen(false); setSearchQuery(''); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors text-left"
              >
                <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm text-foreground font-medium">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground">{s.type}</p>
                </div>
              </button>
            ))}
            {filteredSuggestions.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="text-sm text-muted-foreground">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark
            ? <Sun className="w-4.5 h-4.5 text-muted-foreground" style={{ width: '18px', height: '18px' }} />
            : <Moon className="w-4.5 h-4.5 text-muted-foreground" style={{ width: '18px', height: '18px' }} />
          }
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          >
            <Bell className="text-muted-foreground" style={{ width: '18px', height: '18px' }} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                </div>
                <button className="text-xs text-primary hover:underline font-medium">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <span className="text-base shrink-0 mt-0.5">{notifTypeIcon[n.type]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground">{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <button className="w-full text-xs text-primary hover:underline font-medium text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-2.5 h-9 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-foreground leading-tight">Admin</p>
              <p className="text-[10px] text-muted-foreground">Super Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden lg:block" />
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 fade-in">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@nagpursabzimart.in</p>
              </div>
              {[
                { icon: User, label: 'Profile', page: null },
                { icon: Settings, label: 'Settings', page: 'settings' as Page },
                { icon: HelpCircle, label: 'Help & Support', page: null },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { if (item.page) onNavigate(item.page); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-sm text-foreground"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 transition-colors text-sm text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
