import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import type { Page } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('nsm-admin-theme');
    return stored === 'dark';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nsm-admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nsm-admin-theme', 'light');
    }
  }, [isDark]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div className={cn(
        'md:block transition-transform duration-250',
        mobileOpen ? 'block' : 'hidden md:block'
      )}>
        <Sidebar
          collapsed={window.innerWidth < 768 ? false : collapsed}
          onToggle={handleToggleSidebar}
          currentPage={currentPage}
          onNavigate={(page) => { onNavigate(page); setMobileOpen(false); }}
        />
      </div>

      {/* Top navigation */}
      <TopNav
        collapsed={collapsed}
        onToggleSidebar={handleToggleSidebar}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      {/* Main content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-250',
          collapsed ? 'md:pl-[68px]' : 'md:pl-[260px]'
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
