import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-6 mb-10 min-h-[420px] md:min-h-[480px]">
      {/* Background image */}
      <img
        src="/assets/generated/hero-banner.dim_1400x500.png"
        alt="ShopFlow Hero Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full min-h-[420px] md:min-h-[480px] px-8 md:px-16 py-12">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            New Arrivals This Season
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Discover Your
            <br />
            <span className="text-amber-300">Perfect Style</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Explore our curated collection of premium products crafted for modern living.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products">
              <Button size="lg" className="gap-2 font-semibold shadow-lg">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
