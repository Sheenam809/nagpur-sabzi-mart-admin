import { useState } from 'react';
import AdminLayout from './admin/components/layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Orders from './admin/pages/Orders';
import Products from './admin/pages/Products';
import Customers from './admin/pages/Customers';
import Reviews from './admin/pages/Reviews';
import BulkOrders from './admin/pages/BulkOrders';
import Payments from './admin/pages/Payments';
import Analytics from './admin/pages/Analytics';
import Settings from './admin/pages/Settings';
import type { Page } from './admin/types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'orders': return <Orders />;
      case 'products': return <Products />;
      case 'customers': return <Customers />;
      case 'reviews': return <Reviews />;
      case 'bulk-orders': return <BulkOrders />;
      case 'payments': return <Payments />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}
