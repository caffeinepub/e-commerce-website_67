import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuantitySelector from './QuantitySelector';
import { useUpdateCartItemQuantity, useRemoveCartItem } from '../hooks/useQueries';
import type { CartItem } from '../backend';
import { toast } from 'sonner';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const updateQty = useUpdateCartItemQuantity();
  const removeItem = useRemoveCartItem();

  const price = Number(item.price) / 100;
  const quantity = Number(item.quantity);
  const lineTotal = price * quantity;

  const handleQuantityChange = async (newQty: number) => {
    try {
      await updateQty.mutateAsync({ productId: item.productId, quantity: BigInt(newQty) });
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem.mutateAsync(item.productId);
      toast.success(`${item.name} removed from cart`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
      {/* Product image placeholder */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
        <span className="text-2xl font-display font-bold text-muted-foreground">
          {item.name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground line-clamp-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">${price.toFixed(2)} each</p>
        <div className="mt-2">
          <QuantitySelector
            value={quantity}
            min={1}
            max={99}
            onChange={handleQuantityChange}
            disabled={updateQty.isPending}
          />
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-display font-bold text-lg text-primary">${lineTotal.toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={removeItem.isPending}
        >
          {removeItem.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
