import { Link } from '@tanstack/react-router';
import { ClipboardList, ShoppingBag, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderHistoryItem from '../components/OrderHistoryItem';
import { useGetMyOrders } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function OrderHistoryPage() {
  const { identity } = useInternetIdentity();
  const { data: orders, isLoading } = useGetMyOrders();

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <Lock className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Sign in to view orders</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access your order history.</p>
            <Link to="/products">
              <Button variant="outline">Browse Products</Button>
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
          <ClipboardList className="h-7 w-7 text-primary" />
          Order History
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-5" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm text-muted-foreground mb-4">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
            {[...orders].reverse().map((order) => (
              <OrderHistoryItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
