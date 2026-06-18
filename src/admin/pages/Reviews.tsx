import { useState, useEffect } from 'react';
import { Search, Star, ThumbsUp, Flag, Eye, MessageSquare, AlertCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { reviewsApi } from '../../api/reviews';
import { ApiError } from '../../api/client';
import type { Review } from '../types';
import { cn } from '../../lib/utils';

const statusFilters = ['All', 'published', 'pending', 'flagged'] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('w-3.5 h-3.5', i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted/40 fill-muted/20')}
        />
      ))}
    </div>
  );
}

function timeAgo(isoStr: string) {
  const days = Math.floor((Date.now() - new Date(isoStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('All');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewsApi.getAll();
        setReviews(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filtered = reviews.filter(r => {
    const matchSearch = !search ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchStatus && matchRating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter(rev => rev.rating === r).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading reviews</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PageHeader
        title="Reviews"
        description={`${reviews.length} customer reviews across all products`}
        badge={
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold border border-amber-100 dark:border-amber-900/40">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {avgRating} avg
          </span>
        }
      />

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Rating Distribution</h3>
          {loading ? (
            <div className="h-40 animate-shimmer rounded-xl" />
          ) : (
            <div className="flex items-center gap-6">
            <div className="text-center shrink-0">
              <p className="text-5xl font-bold text-foreground">{avgRating}</p>
              <StarRating rating={Math.round(parseFloat(avgRating))} />
              <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {ratingDist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <button
                    onClick={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 w-12"
                  >
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </button>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border border-border p-4 h-24 animate-shimmer" />
              ))
            : [
            { label: 'Published', value: reviews.filter(r => r.status === 'published').length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Pending', value: reviews.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Flagged', value: reviews.filter(r => r.status === 'flagged').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          ].map(card => (
            <div key={card.label} className={cn('rounded-xl border border-border p-4', card.bg)}>
              <p className={cn('text-3xl font-bold', card.color)}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all border',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={<MessageSquare className="w-8 h-8" />}
            title="No reviews found"
            description="No reviews match your current filters."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div
              key={review.id}
              className={cn(
                'rounded-2xl border bg-card p-5 transition-colors',
                review.status === 'flagged'
                  ? 'border-red-100 dark:border-red-900/30'
                  : review.status === 'pending'
                    ? 'border-amber-100 dark:border-amber-900/30'
                    : 'border-border'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <img
                  src={review.productImage}
                  alt={review.product}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{review.customer}</p>
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">on <span className="font-medium text-foreground">{review.product}</span></p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={review.status} size="sm" />
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed mb-3">{review.comment}</p>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful ({review.helpful})
                    </button>
                    {review.status === 'pending' && (
                      <button className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors">
                      <Flag className="w-3.5 h-3.5" />
                      {review.status === 'flagged' ? 'Unflag' : 'Flag'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
