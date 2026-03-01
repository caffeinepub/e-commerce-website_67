import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Jewelry',
  'Photography',
  'Audio',
];

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';
export type ViewMode = 'grid' | 'list';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
}

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-medium">{totalCount} products</span>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 flex-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
              (cat === 'All' && !selectedCategory) || selectedCategory === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Sort */}
        <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="rating-desc">Top Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex border border-border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
