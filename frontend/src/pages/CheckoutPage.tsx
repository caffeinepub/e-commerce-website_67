import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderSummary from '../components/OrderSummary';
import ShippingForm, { type ShippingFormData } from '../components/ShippingForm';
import { useGetCart, usePlaceOrder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems, isLoading } = useGetCart();
  const placeOrder = usePlaceOrder();

  const total = cartItems?.reduce((sum, item) => {
    return sum + (Number(item.price) / 100) * Number(item.quantity);
  }, 0) ?? 0;

  const totalInCents = BigInt(Math.round(total * 100));

  const handleSubmit = async (_data: ShippingFormData) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    try {
      const success = await placeOrder.mutateAsync(totalInCents);
      if (success) {
        const orderId = `order-${Date.now()}`;
        navigate({ to: '/order-confirmation/$orderId', params: { orderId } });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch {
      toast.error('An error occurred while placing your order.');
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <Lock className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Sign in to checkout</h2>
            <p className="text-muted-foreground mb-6">Please sign in to complete your purchase.</p>
            <Link to="/cart">
              <Button variant="outline">Back to Cart</Button>
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
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {isLoading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <ShippingForm onSubmit={handleSubmit} isSubmitting={placeOrder.isPending} />
            <OrderSummary items={cartItems} total={total} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
