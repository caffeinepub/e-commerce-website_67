import { Link } from '@tanstack/react-router';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'shopflow-ecommerce');

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-lg text-foreground">ShopFlow</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your destination for premium products, curated with care.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products" search={{ category: 'Electronics' } as Record<string, string>} className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/products" search={{ category: 'Clothing' } as Record<string, string>} className="hover:text-primary transition-colors">Clothing</Link></li>
              <li><Link to="/products" search={{ category: 'Home & Garden' } as Record<string, string>} className="hover:text-primary transition-colors">Home & Garden</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
              <li><Link to="/checkout" className="hover:text-primary transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span>Secure Payments</span></li>
              <li><span>Fast Delivery</span></li>
              <li><span>Easy Returns</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} ShopFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
