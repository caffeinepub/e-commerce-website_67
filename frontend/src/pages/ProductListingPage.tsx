import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilters, { type SortOption, type ViewMode } from '../components/ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllProducts } from '../hooks/useQueries';
import { PackageSearch } from 'lucide-react';

export default function ProductListingPage() {
  const search = useSearch({ strict: false }) as Record<string, string>;
  const initialCategory = search?.category ?? '';
  const initialQuery = search?.q ?? '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery] = useState(initialQuery);

  const { data: allProducts, isLoading } = useGetAllProducts();

  const filteredProducts = useMemo(() => {
    let products = allProducts ?? [];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortOption) {
      case 'price-asc':
        products = [...products].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        products = [...products].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating-desc':
        products = [...products].sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
    }

    return products;
  }, [allProducts, selectedCategory, sortOption, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {selectedCategory || searchQuery ? (
              <>
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
              </>
            ) : (
              'All Products'
            )}
          </h1>
          {selectedCategory && (
            <p className="text-muted-foreground mt-1">
              Browsing <span className="font-medium text-foreground">{selectedCategory}</span>
            </p>
          )}
        </div>

        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={filteredProducts.length}
        />

        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : selectedCategory
                ? `No products in "${selectedCategory}" yet.`
                : 'No products available yet.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} view="list" />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
