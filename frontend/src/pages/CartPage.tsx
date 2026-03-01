import { Link } from '@tanstack/react-router';
import { ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItemRow from '../components/CartItemRow';
import { useGetCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function CartPage() {
  const { identity } = useInternetIdentity();
  const { data: cartItems, isLoading } = useGetCart();

  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (Number(item.price) / 100) * Number(item.quantity);
  }, 0) ?? 0;

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access your shopping cart.</p>
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-primary" />
          Shopping Cart
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-5" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 mb-5">
                  <div className="flex justify-between">
                    <span className="font-display font-bold text-foreground">Total</span>
                    <span className="font-display font-bold text-xl text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button size="lg" className="w-full gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
