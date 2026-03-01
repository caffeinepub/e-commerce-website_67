import { useState } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '../backend';

interface OrderHistoryItemProps {
  order: Order;
}

export default function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(Number(order.timestamp) / 1_000_000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const total = Number(order.totalAmount) / 100;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground text-sm">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge variant="outline" className="text-xs text-green-600 border-green-300 bg-green-50 dark:bg-green-950">
            Completed
          </Badge>
          <p className="font-display font-bold text-primary">${total.toFixed(2)}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-2 animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Items</p>
          {order.items.map((item, idx) => {
            const price = Number(item.price) / 100;
            const qty = Number(item.quantity);
            return (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.name} <span className="text-muted-foreground">× {qty}</span></span>
                <span className="font-medium text-foreground">${(price * qty).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
