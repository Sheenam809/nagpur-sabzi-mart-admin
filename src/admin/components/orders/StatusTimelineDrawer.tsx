import { X, Check, Clock, AlertCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { cn } from '../../../lib/utils';

interface StatusTimelineDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const orderStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'In Transit', 'Delivered', 'Cancelled'];

const statusDescriptions: Record<OrderStatus, string> = {
  'Placed': 'Order has been placed successfully',
  'Confirmed': 'Order confirmed by seller',
  'Packed': 'Order is being packed for shipment',
  'In Transit': 'Order is on the way to you',
  'Delivered': 'Order has been delivered',
  'Cancelled': 'Order has been cancelled',
};

const getStatusIndex = (status: OrderStatus): number => {
  return orderStatuses.indexOf(status);
};

export default function StatusTimelineDrawer({ open, onOpenChange, order }: StatusTimelineDrawerProps) {
  if (!open) return null;

  const currentStatusIndex = getStatusIndex(order.status);

  const timelineEvents = [
    { status: 'Placed', time: new Date(order.createdAt), description: 'Order placed' },
    { status: 'Confirmed', time: new Date(new Date(order.createdAt).getTime() + 30 * 60000), description: 'Order confirmed' },
    { status: 'Packed', time: new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60000), description: 'Order packed for shipment' },
    { status: 'In Transit', time: new Date(new Date(order.createdAt).getTime() + 4 * 60 * 60000), description: 'Out for delivery' },
    { status: 'Delivered', time: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60000), description: 'Delivered successfully' },
  ];

  const getStatusIcon = (status: OrderStatus, isCompleted: boolean, isCancelled: boolean) => {
    if (isCancelled) return <AlertCircle className="w-5 h-5" />;
    if (isCompleted) return <Check className="w-5 h-5" />;
    if (status === order.status) return <Clock className="w-5 h-5" />;
    return <div className="w-2 h-2 rounded-full bg-current" />;
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
            <h3 className="text-lg font-bold text-foreground">Order Timeline</h3>
            <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Timeline */}
        <div className="p-6 space-y-6">
          {/* Order Status Overview */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Current Status</p>
            <p className={cn(
              'text-sm font-semibold px-3 py-2 rounded-lg inline-flex items-center',
              order.status === 'Cancelled'
                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : order.status === 'Delivered'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            )}>
              {order.status === 'Cancelled' && <AlertCircle className="w-4 h-4 mr-1" />}
              {order.status === 'Delivered' && <Check className="w-4 h-4 mr-1" />}
              {order.status}
            </p>
          </div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {orderStatuses.map((status, index) => {
              const isCompleted = index < currentStatusIndex || (order.status === 'Delivered' && index <= currentStatusIndex);
              const isCancelled = order.status === 'Cancelled' && index > currentStatusIndex;
              const isCurrent = order.status === status;
              const isSkipped = order.status === 'Cancelled' && index > currentStatusIndex;

              // Find the event for this status
              const event = timelineEvents.find(e => e.status === status);

              return (
                <div key={status} className="flex gap-4">
                  {/* Timeline Connector */}
                  <div className="flex flex-col items-center">
                    {/* Status Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                      isCancelled ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' :
                      isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' :
                      isCurrent ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400' :
                      'bg-muted text-muted-foreground border border-border'
                    )}>
                      {getStatusIcon(status, isCompleted, isCancelled)}
                    </div>

                    {/* Connector Line */}
                    {index < orderStatuses.length - 1 && (
                      <div className={cn(
                        'w-1 h-12 my-1 transition-colors',
                        isCompleted || (order.status === 'Delivered' && index < currentStatusIndex)
                          ? 'bg-green-300 dark:bg-green-600'
                          : 'bg-border'
                      )} />
                    )}
                  </div>

                  {/* Event Details */}
                  <div className={cn(
                    'flex-1 pt-1.5',
                    isSkipped && 'opacity-50'
                  )}>
                    <p className={cn(
                      'font-semibold text-sm transition-colors',
                      isCompleted ? 'text-green-700 dark:text-green-400' :
                      isCurrent ? 'text-blue-700 dark:text-blue-400' :
                      isCancelled ? 'text-red-700 dark:text-red-400' :
                      'text-muted-foreground'
                    )}>
                      {status}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {statusDescriptions[status]}
                    </p>
                    {event && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {event.time.toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Delivery */}
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Estimated Delivery</p>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60000).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Cancellation Note */}
          {order.status === 'Cancelled' && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Order Cancelled</p>
              <p className="text-sm text-red-900 dark:text-red-200">
                This order has been cancelled. {order.paymentStatus === 'Refunded' && 'A refund has been processed.'}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium text-foreground">{order.paymentMethod}</span>
            </div>
            <div className="flex items-justify-between text-sm">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className={cn(
                'font-medium px-2 py-0.5 rounded text-xs',
                order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                order.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                order.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
              )}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
