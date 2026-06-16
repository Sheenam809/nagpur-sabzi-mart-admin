import { AlertCircle, X } from 'lucide-react';
import type { Product } from '../../types';

interface DeleteProductConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onConfirm: () => void;
}

export default function DeleteProductConfirm({ open, onOpenChange, product, onConfirm }: DeleteProductConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Delete Product</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Warning</p>
              <p className="text-sm text-red-800 dark:text-red-300">This action cannot be undone. The product will be permanently deleted from your catalog.</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-lg border border-border p-3 mb-6 flex gap-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category} • {product.unit}</p>
              <p className="text-xs text-muted-foreground mt-1">₹{product.price}</p>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-foreground mb-6">
            Are you sure you want to delete <strong>{product.name}</strong>? This will remove it from your inventory and all related data will be lost.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
