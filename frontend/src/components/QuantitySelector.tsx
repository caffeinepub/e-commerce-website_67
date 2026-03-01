import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({ value, min = 1, max = 99, onChange, disabled }: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={decrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
        disabled={disabled}
        className="h-8 w-14 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={increment}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
