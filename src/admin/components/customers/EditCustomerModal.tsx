import type { Customer } from '../../types';

interface EditCustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export default function EditCustomerModal({
  open,
  customer,
  onClose,
}: EditCustomerModalProps) {
  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-card rounded-2xl w-full max-w-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Customer</h2>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            defaultValue={customer.name}
            className="w-full h-10 px-3 rounded-xl border border-border"
            placeholder="Customer Name"
          />

          <input
            defaultValue={customer.email}
            className="w-full h-10 px-3 rounded-xl border border-border"
            placeholder="Email"
          />

          <input
            defaultValue={customer.phone}
            className="w-full h-10 px-3 rounded-xl border border-border"
            placeholder="Phone"
          />

          <input
            defaultValue={customer.location}
            className="w-full h-10 px-3 rounded-xl border border-border"
            placeholder="Location"
          />

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}