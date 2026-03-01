import { Link } from '@tanstack/react-router';
import { Shirt, Laptop, Home, Dumbbell, BookOpen, Gem, Camera, Headphones } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300' },
  { name: 'Clothing', icon: Shirt, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300' },
  { name: 'Home & Garden', icon: Home, color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300' },
  { name: 'Books', icon: BookOpen, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300' },
  { name: 'Jewelry', icon: Gem, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300' },
  { name: 'Photography', icon: Camera, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300' },
  { name: 'Audio', icon: Headphones, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' },
];

export default function FeaturedCategories() {
  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Shop by Category</h2>
        <Link to="/products" className="text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              to="/products"
              search={{ category: cat.name } as Record<string, string>}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all duration-200 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-center text-foreground/80 group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
