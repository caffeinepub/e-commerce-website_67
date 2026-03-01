import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ShoppingCart, ArrowLeft, Loader2, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuantitySelector from '../components/QuantitySelector';
import StarRating from '../components/StarRating';
import { useGetProduct, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading } = useGetProduct(id);
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    if (!product) return;
    try {
      await addToCart.mutateAsync([{
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: BigInt(quantity),
      }]);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : !product ? (
          <div className="text-center py-24">
            <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-secondary aspect-square">
              <img
                src={product.image.getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f0eb/c4956a?text=${encodeURIComponent(product.name.slice(0, 2))}`;
                }}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <Badge variant="outline" className="w-fit mb-3 text-xs">{product.category}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={Number(product.rating)} size="md" />
                <span className="text-sm text-muted-foreground">({Number(product.rating)}/5)</span>
              </div>

              <p className="font-display text-4xl font-bold text-primary mb-5">
                ${(Number(product.price) / 100).toFixed(2)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                {Number(product.stock) === 0 ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : Number(product.stock) <= 5 ? (
                  <Badge className="bg-amber-500 text-white">Only {Number(product.stock)} left in stock</Badge>
                ) : (
                  <Badge className="bg-green-500 text-white">In Stock ({Number(product.stock)} available)</Badge>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              {Number(product.stock) > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <QuantitySelector
                    value={quantity}
                    min={1}
                    max={Number(product.stock)}
                    onChange={setQuantity}
                  />
                  <Button
                    size="lg"
                    className="gap-2 flex-1 sm:flex-none"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    {addToCart.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
