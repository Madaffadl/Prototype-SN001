'use client';

import { forwardRef } from 'react';
import { ShoppingBag, Edit3, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';

interface OrderReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onEdit?: () => void;
  tableNumber?: number;
}

export const OrderReviewModal = forwardRef<HTMLDivElement, OrderReviewModalProps>(
  function OrderReviewModal({ open, onOpenChange, onConfirm, onEdit, tableNumber }, ref) {
    const { items, subtotal, tax, discount, discountPercent, total, itemCount } = useCartStore();

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Review Pesanan
            </DialogTitle>
            <DialogDescription>
              Pastikan pesanan sudah benar sebelum melanjutkan ke pembayaran
              {tableNumber && (
                <Badge variant="outline" className="ml-2">
                  Meja {tableNumber}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3 pr-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg',
                    index % 2 === 0 ? 'bg-muted/50' : 'bg-background'
                  )}
                >
                  {/* Item Number */}
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{index + 1}</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                        {item.modifiers.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            + {item.modifiers.map(m => m.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5 italic">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x @ {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({itemCount} item)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon ({discountPercent}%)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak (11%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit?.();
              }}
              className="flex-1"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Pesanan
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Lanjut ke Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
