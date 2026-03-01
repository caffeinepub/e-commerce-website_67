import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle2, ShoppingBag, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {orderId && (
            <div className="inline-flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 mt-2 mb-6">
              <span className="text-sm text-muted-foreground">Order ID:</span>
              <span className="text-sm font-mono font-semibold text-foreground">{orderId}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-8">
            We'll process your order shortly. You can track your order history in your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <ClipboardList className="h-4 w-4" /> View Order History
              </Button>
            </Link>
            <Link to="/products">
              <Button className="gap-2 w-full sm:w-auto">
                <ShoppingBag className="h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
