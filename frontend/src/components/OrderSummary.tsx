import type { CartItem } from '../backend';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => {
          const price = Number(item.price) / 100;
          const qty = Number(item.quantity);
          return (
            <div key={item.productId} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {qty} × ${price.toFixed(2)}</p>
              </div>
              <p className="text-sm font-semibold text-foreground flex-shrink-0">
                ${(price * qty).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-foreground">Total</span>
          <span className="font-display font-bold text-xl text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
