import { useState } from 'react';
import { Search, Plus, Package, Star, TrendingUp } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { products } from '../data/mockData';
import type { Product } from '../types';
import { cn } from '../../lib/utils';

const categories = ['All', 'Vegetables', 'Fruits', 'Leafy Greens', 'Spices'];

export default function Products() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const statsCards = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, color: 'text-blue-600' },
    { label: 'Active', value: products.filter(p => p.status === 'active').length.toString(), icon: TrendingUp, color: 'text-green-600' },
    { label: 'Low Stock', value: products.filter(p => p.status === 'low_stock').length.toString(), icon: Package, color: 'text-amber-600' },
    { label: 'Out of Stock', value: products.filter(p => p.status === 'out_of_stock').length.toString(), icon: Package, color: 'text-red-600' },
  ];

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground">{row.name}</p>
              {row.trending && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase">
                  Trending
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{row.category} · {row.unit}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">₹{row.price}</p>
          <p className="text-xs text-muted-foreground line-through">₹{row.originalPrice}</p>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      align: 'center',
      render: (row) => (
        <div className="text-center">
          <p className={cn(
            'text-sm font-semibold',
            row.stock === 0 ? 'text-red-600 dark:text-red-400' :
            row.stock < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
          )}>
            {row.stock}
          </p>
          <p className="text-xs text-muted-foreground">units</p>
        </div>
      ),
    },
    {
      key: 'sold',
      header: 'Sold',
      sortable: true,
      align: 'center',
      render: (row) => <span className="text-sm text-foreground">{row.sold.toLocaleString()}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-foreground">{row.rating}</span>
          <span className="text-xs text-muted-foreground">({row.reviews})</span>
        </div>
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
      render: (_row) => (
        <div className="flex items-center gap-1">
          <button className="px-2.5 h-7 text-xs font-medium rounded-lg bg-secondary hover:bg-muted transition-colors text-foreground">
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, pricing, and inventory"
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-green-900/20">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsCards.map(card => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-xl bg-muted flex items-center justify-center', card.color)}>
              <card.icon className="w-4 h-4" />
            </div>
            <div>
              <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-medium whitespace-nowrap transition-all border',
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1 shrink-0" />
          {['All', 'active', 'low_stock', 'out_of_stock'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-medium whitespace-nowrap transition-all border',
                statusFilter === st
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {st === 'All' ? 'All Status' : st === 'low_stock' ? 'Low Stock' : st === 'out_of_stock' ? 'Out of Stock' : 'Active'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        emptyState={
          <EmptyState
            icon={<Package className="w-8 h-8" />}
            title="No products found"
            description="No products match your current filters. Try adjusting your search criteria."
          />
        }
      />
    </div>
  );
}
