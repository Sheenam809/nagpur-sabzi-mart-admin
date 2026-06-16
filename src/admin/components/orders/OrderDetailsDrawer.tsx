import { X, Phone, MapPin, Calendar } from 'lucide-react';
import type { Order } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { cn } from '../../../lib/utils';

interface OrderDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export default function OrderDetailsDrawer({ open, onOpenChange, order }: OrderDetailsDrawerProps) {
  if (!open) return null;

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
      case 'Refunded':
        return 'text-slate-600 bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border transform transition-transform duration-300 z-50 overflow-y-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur">
          <div>
            <h3 className="text-lg font-bold text-foreground">{order.orderNumber}</h3>
            <p className="text-xs text-muted-foreground">{order.customer}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Customer Information</h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">
                    {order.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.isBulk ? 'Bulk Customer' : 'Retail Customer'}</p>
                </div>
              </div>
              {order.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${order.phone}`} className="text-foreground hover:text-primary transition-colors">
                    {order.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Delivery Address</h4>
            <div className="bg-muted/30 rounded-lg p-4 flex gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Ordered Products */}
          {order.orderedProducts && order.orderedProducts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Ordered Products</h4>
              <div className="space-y-2">
                {order.orderedProducts.map(product => (
                  <div key={product.productId} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">₹{product.price * product.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Payment Information</h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="text-sm font-medium text-foreground">{order.paymentMethod}</span>
              </div>
              <div className="w-full h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <span className={cn('text-xs font-semibold px-2 py-1 rounded-lg', getPaymentStatusColor(order.paymentStatus))}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Order Status</h4>
            <StatusBadge status={order.status} />
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Order Summary</h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium text-foreground">₹{Math.round(order.total * 0.92)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Fee</span>
                <span className="text-sm font-medium text-foreground">₹{Math.round(order.total * 0.08)}</span>
              </div>
              <div className="w-full h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Amount</span>
                <span className="text-lg font-bold text-primary">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Order Date</p>
              <p className="text-sm font-medium text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
