import { useState } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import type { Product } from '../../types';

interface InventoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export default function InventoryManager({
  open,
  onOpenChange,
  products,
  onUpdateProducts,
}: InventoryManagerProps) {
  const [updates, setUpdates] = useState<Record<string, number>>({});

  const lowStockProducts = products.filter(p => p.stock < 20);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const handleStockUpdate = (productId: string, newStock: number) => {
    setUpdates({ ...updates, [productId]: newStock });
  };

  const handleApplyUpdates = () => {
    const updatedProducts = products.map(p => ({
      ...p,
      stock: updates[p.id] !== undefined ? updates[p.id] : p.stock,
      status: updates[p.id] !== undefined
        ? updates[p.id] === 0
          ? 'out_of_stock' as const
          : updates[p.id] < 20
          ? 'low_stock' as const
          : p.status === 'inactive'
          ? 'inactive'
          : 'active' as const
        : p.status,
    }));
    onUpdateProducts(updatedProducts);
    setUpdates({});
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">Inventory Manager</h2>
          <button
            onClick={() => {
              setUpdates({});
              onOpenChange(false);
            }}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Products</p>
              <p className="text-xl font-bold text-foreground">{products.length}</p>
            </div>
            <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Low Stock</p>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{lowStockProducts.length}</p>
            </div>
            <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-center">
              <p className="text-xs text-red-700 dark:text-red-300 mb-1">Out of Stock</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{outOfStockProducts.length}</p>
            </div>
          </div>

          {/* Critical Items */}
          {outOfStockProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-semibold text-foreground">Out of Stock</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {outOfStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="number"
                        min="0"
                        value={updates[product.id] !== undefined ? updates[product.id] : ''}
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className="w-16 px-2 py-1 rounded text-sm border border-border bg-background text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      />
                      <span className="text-xs text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Items */}
          {lowStockProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-foreground">Low Stock Alert</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.stock} {product.unit} remaining</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="number"
                        min="0"
                        value={updates[product.id] !== undefined ? updates[product.id] : ''}
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                        placeholder={product.stock.toString()}
                        className="w-16 px-2 py-1 rounded text-sm border border-border bg-background text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      />
                      <span className="text-xs text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-3">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              Bulk update stock levels for critical items. Leave fields empty to keep current values. Status will automatically update based on stock levels.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setUpdates({});
                onOpenChange(false);
              }}
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyUpdates}
              disabled={Object.keys(updates).length === 0}
              className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Apply Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
