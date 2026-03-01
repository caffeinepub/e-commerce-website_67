import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './ProductCard';
import { useGetAllProducts } from '../hooks/useQueries';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useGetAllProducts();
  const featured = products?.slice(0, 8) ?? [];

  return (
    <section className="container mx-auto px-4 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
        <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : featured.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No products available yet.</p>
          <p className="text-sm mt-1">Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
