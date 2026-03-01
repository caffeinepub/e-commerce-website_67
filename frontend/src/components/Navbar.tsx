import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, X, Package, ClipboardList, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LoginButton from './LoginButton';
import { useGetCart, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems } = useGetCart();
  const { data: isAdmin } = useIsCallerAdmin();

  const cartCount = cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/products', search: { q: searchQuery.trim() } as Record<string, string> });
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/generated/store-logo.dim_200x60.png"
              alt="ShopFlow"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 bg-secondary/60 border-border focus:bg-card"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {identity && isAdmin && (
              <Link to="/admin/products">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1.5 text-primary font-medium" title="Manage Products">
                  <Settings className="h-4 w-4" />
                  Manage Products
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden relative" title="Manage Products">
                  <Settings className="h-5 w-5 text-primary" />
                </Button>
              </Link>
            )}

            {identity && (
              <Link to="/orders">
                <Button variant="ghost" size="icon" className="relative" title="Order History">
                  <ClipboardList className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-primary text-primary-foreground">
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="hidden sm:block">
              <LoginButton />
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/60"
              />
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <Package className="h-4 w-4" /> All Products
              </Link>
              {identity && isAdmin && (
                <Link to="/admin/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Settings className="h-4 w-4" /> Manage Products
                </Link>
              )}
            </div>
            <div className="sm:hidden">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
