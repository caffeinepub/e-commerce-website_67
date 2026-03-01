import { Link } from '@tanstack/react-router';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();

  const imageUrl = product.image.getDirectURL();
  const price = Number(product.price) / 100;
  const stock = Number(product.stock);
  const rating = Number(product.rating);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!identity) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    if (stock === 0) return;
    try {
      await addToCart.mutateAsync([{
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1n,
      }]);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  if (view === 'list') {
    return (
      <Link to="/product/$id" params={{ id: product.id }}>
        <div className="group flex gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-card transition-all duration-200">
          <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/112x112/f5f0eb/c4956a?text=${encodeURIComponent(product.name.slice(0, 2))}`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-xl text-primary">${price.toFixed(2)}</p>
                {stock === 0 && <Badge variant="destructive" className="text-xs mt-1">Out of Stock</Badge>}
                {stock > 0 && stock <= 5 && <Badge variant="outline" className="text-xs mt-1 text-amber-600 border-amber-300">Only {stock} left</Badge>}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <StarRating rating={rating} />
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={stock === 0 || addToCart.isPending}
                className="gap-1.5"
              >
                {addToCart.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/product/$id" params={{ id: product.id }}>
      <div className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 h-full">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f5f0eb/c4956a?text=${encodeURIComponent(product.name.slice(0, 2))}`;
            }}
          />
          {stock === 0 && (
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {stock > 0 && stock <= 5 && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
              Only {stock} left
            </Badge>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1 flex-1">
            {product.name}
          </h3>
          <StarRating rating={rating} />
          <div className="flex items-center justify-between mt-3">
            <p className="font-display font-bold text-xl text-primary">${price.toFixed(2)}</p>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={stock === 0 || addToCart.isPending}
              className="gap-1.5"
            >
              {addToCart.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
