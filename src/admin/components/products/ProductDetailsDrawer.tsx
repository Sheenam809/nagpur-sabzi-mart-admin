import { X, Star, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import type { Product } from '../../types';
import { cn } from '../../../lib/utils';

interface ProductDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function ProductDetailsDrawer({ open, onOpenChange, product }: ProductDetailsDrawerProps) {
  if (!open) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex">
      <div
        className="flex-1"
        onClick={() => onOpenChange(false)}
      />
      <div className="w-full md:w-96 bg-card border-l border-border overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">Product Details</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Name & Status */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={product.status} />
              {product.trending && (
                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-sm line-through text-muted-foreground">₹{product.originalPrice}</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-green-600 dark:text-green-400">Save {discount}%</span>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm font-medium text-foreground">{product.category}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Unit</span>
              <span className="text-sm font-medium text-foreground">{product.unit}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Product ID</span>
              <span className="text-sm font-mono text-foreground">{product.id}</span>
            </div>
          </div>

          {/* Stock & Sales */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              'rounded-xl p-4 border',
              product.stock === 0
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
                : product.stock < 20
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50'
            )}>
              <p className="text-xs text-muted-foreground font-medium mb-1">Stock Level</p>
              <p className={cn(
                'text-2xl font-bold',
                product.stock === 0
                  ? 'text-red-600 dark:text-red-400'
                  : product.stock < 20
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-green-600 dark:text-green-400'
              )}>
                {product.stock}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{product.unit}</p>
            </div>

            <div className="rounded-xl p-4 border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-muted-foreground font-medium mb-1">Units Sold</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(product.sold / 1000).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">K</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{product.sold.toLocaleString()} total</p>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{product.rating} out of 5</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{product.reviews.toLocaleString()} customer reviews</p>
          </div>

          {/* Alerts */}
          {product.status === 'low_stock' && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">Low Stock Alert</p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">Only {product.stock} units remaining. Consider restocking soon.</p>
              </div>
            </div>
          )}

          {product.status === 'out_of_stock' && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-900 dark:text-red-200">Out of Stock</p>
                <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">This product is currently unavailable. Restock to resume sales.</p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Quick Stats</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue Generated</span>
                <span className="font-semibold text-foreground">₹{(product.sold * product.price / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Rating</span>
                <span className="font-semibold text-foreground">{product.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className={cn(
                  'font-semibold',
                  product.stock > 50 ? 'text-green-600 dark:text-green-400' :
                  product.stock > 0 ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-600 dark:text-red-400'
                )}>
                  {product.stock > 50 ? 'Well Stocked' : product.stock > 0 ? 'Limited' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
