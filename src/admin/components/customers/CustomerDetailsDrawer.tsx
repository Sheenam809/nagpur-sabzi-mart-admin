import { X, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import type { Customer } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { cn } from '../../../lib/utils';

interface CustomerDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  onEdit: () => void;
}
export default function CustomerDetailsDrawer({
  open,
  onOpenChange,
  customer,
}: CustomerDetailsDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border transform transition-transform duration-300 z-50 overflow-y-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {customer.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="grid grid-cols-3 gap-3">
  <a
  href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center h-10 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
>
  WhatsApp
</a>

  <a
    href={`mailto:${customer.email}`}
    className="flex items-center justify-center h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
  >
    Email
  </a>

  <button
  onClick={() => alert(`Edit Customer: ${customer.name}`)}
  className="flex items-center justify-center h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
>
  Edit
</button>
</div>
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold mb-3">Customer Information</h4>

            <div className="rounded-xl bg-muted/30 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>{customer.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined {new Date(customer.joinedAt).toLocaleDateString()}
                </span>
              </div>

              <StatusBadge status={customer.status} />
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-semibold mb-3">Statistics</h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-lg font-bold">{customer.totalOrders}</p>
              </div>

              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-bold">
                  ₹{customer.totalSpent.toLocaleString()}
                </p>
              </div>
<div className="rounded-xl border p-3">
  <p className="text-xs text-muted-foreground">
    Customer Tier
  </p>
  <p className="text-lg font-bold text-yellow-600">
    Gold
  </p>
</div>
             

              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">
                  Last Order
                </p>
                <p className="text-sm font-medium">
                  {new Date(customer.lastOrder).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
<div className="space-y-4">
  <h4 className="text-lg font-semibold">Activity Timeline</h4>

  <div className="space-y-4 border-l-2 border-border pl-4">
    <div>
      <p className="font-medium">Joined Platform</p>
      <p className="text-sm text-muted-foreground">
        {new Date(customer.joinedAt).toLocaleDateString()}
      </p>
    </div>

    <div>
      <p className="font-medium">First Order Placed</p>
      <p className="text-sm text-muted-foreground">
        Customer started ordering vegetables.
      </p>
    </div>

    <div>
      <p className="font-medium">Loyalty Points Earned</p>
      <p className="text-sm text-muted-foreground">
        {customer.loyaltyPoints} points collected.
      </p>
    </div>

    <div>
      <p className="font-medium">Last Active</p>
      <p className="text-sm text-muted-foreground">
        {new Date(customer.lastOrder).toLocaleDateString()}
      </p>
    </div>
  </div>
</div>
          {/* Recent Orders */}
         <div className="space-y-4">
  <h4 className="text-lg font-semibold">Order History</h4>

  <div className="rounded-xl border border-border overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="text-left p-3">Order</th>
          <th className="text-left p-3">Amount</th>
          <th className="text-left p-3">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-t">
          <td className="p-3">ORD-1023</td>
          <td className="p-3">₹450</td>
          <td className="p-3 text-green-600">Delivered</td>
        </tr>

        <tr className="border-t">
          <td className="p-3">ORD-1045</td>
          <td className="p-3">₹720</td>
          <td className="p-3 text-blue-600">Packed</td>
        </tr>

        <tr className="border-t">
          <td className="p-3">ORD-1056</td>
          <td className="p-3">₹310</td>
          <td className="p-3 text-amber-600">In Transit</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

          {/* Notes */}
          <div>
            <h4 className="font-semibold mb-3">Customer Notes</h4>

            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              Preferred customer. Regular weekly orders.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}