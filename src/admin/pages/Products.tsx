import { useState } from 'react';
import { Search, Plus, Package, Star, TrendingUp, MoreHorizontal } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DataTable, { Column } from '../components/shared/DataTable';
import EmptyState from '../components/shared/EmptyState';
import { products as initialProducts } from '../data/mockData';
import type { Product } from '../types';
import { cn } from '../../lib/utils';
import AddProductDialog from '../components/products/AddProductDialog';
import EditProductDialog from '../components/products/EditProductDialog';
import ProductDetailsDrawer from '../components/products/ProductDetailsDrawer';
import DeleteProductConfirm from '../components/products/DeleteProductConfirm';
import CategoryManager from '../components/products/CategoryManager';
import InventoryManager from '../components/products/InventoryManager';

const categories = ['All', 'Vegetables', 'Fruits', 'Leafy Greens', 'Spices'];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dialog/Drawer states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts([...products, product]);
    setShowAddDialog(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setShowEditDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsDrawer(true);
    setOpenMenuId(null);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

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
          <div className="flex items-center justify-center gap-1.5">
            <p className={cn(
              'text-sm font-semibold',
              row.stock === 0 ? 'text-red-600 dark:text-red-400' :
              row.stock < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
            )}>
              {row.stock}
            </p>
            {row.stock < 20 && row.stock > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </div>
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
      align: 'right',
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {openMenuId === row.id && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[140px]">
              <button
                onClick={() => handleViewDetails(row)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors first:rounded-t-lg"
              >
                View Details
              </button>
              <button
                onClick={() => handleEditClick(row)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(row)}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors last:rounded-b-lg"
              >
                Delete
              </button>
            </div>
          )}
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => setShowInventoryManager(true)}
              className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Inventory
            </button>
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-green-900/20"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
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

      {/* Dialogs and Drawers */}
      <AddProductDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddProduct}
      />

      {selectedProduct && (
        <>
          <EditProductDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            product={selectedProduct}
            onSubmit={handleEditProduct}
          />

          <ProductDetailsDrawer
            open={showDetailsDrawer}
            onOpenChange={setShowDetailsDrawer}
            product={selectedProduct}
          />

          <DeleteProductConfirm
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            product={selectedProduct}
            onConfirm={handleDeleteProduct}
          />
        </>
      )}

      <CategoryManager
        open={showCategoryManager}
        onOpenChange={setShowCategoryManager}
      />

      <InventoryManager
        open={showInventoryManager}
        onOpenChange={setShowInventoryManager}
        products={products}
        onUpdateProducts={setProducts}
      />
    </div>
  );
}
