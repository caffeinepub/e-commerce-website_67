interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, max = 5, size = 'sm' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-amber-400' : 'text-muted-foreground/30'}
        >
          ★
        </span>
      ))}
    </div>
  );
}
