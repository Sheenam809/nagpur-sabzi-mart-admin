import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultCategories = [
  { id: '1', name: 'Vegetables', color: 'bg-green-100 dark:bg-green-900/30', products: 24 },
  { id: '2', name: 'Fruits', color: 'bg-orange-100 dark:bg-orange-900/30', products: 18 },
  { id: '3', name: 'Leafy Greens', color: 'bg-emerald-100 dark:bg-emerald-900/30', products: 8 },
  { id: '4', name: 'Spices', color: 'bg-red-100 dark:bg-red-900/30', products: 5 },
];

export default function CategoryManager({ open, onOpenChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          id: `cat-${Date.now()}`,
          name: newCategory,
          color: 'bg-blue-100 dark:bg-blue-900/30',
          products: 0,
        },
      ]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.find(c => c.id === id)?.products === 0) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert('Cannot delete category with products. Move products to another category first.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">Category Manager</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Add New Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Add New Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="e.g., Dairy Products"
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={handleAddCategory}
                className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">Active Categories</label>
            <div className="space-y-2">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={cn(
                    'rounded-lg border border-border p-3 flex items-center justify-between hover:bg-muted/30 transition-colors',
                    category.color
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.products} product{category.products !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={category.products > 0}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title={category.products > 0 ? 'Cannot delete category with products' : 'Delete category'}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-3">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              Categories help organize your products. You can delete empty categories or rename them as needed.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
