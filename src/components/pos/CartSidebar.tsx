'use client';

import { useEffect, useState } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Pause,
  ReceiptText,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';

interface CartSidebarProps {
  onCheckout?: () => void;
  onHold?: () => void;
  className?: string;
}

export function CartSidebar({ onCheckout, onHold, className }: CartSidebarProps) {
  const [mounted, setMounted] = useState(false);
  
  const {
    items,
    subtotal,
    tax,
    discount,
    discountPercent,
    total,
    itemCount,
    isHeld,
    updateQuantity,
    removeItem,
    clearCart,
    setDiscount,
    holdOrder,
    calculateTotals,
  } = useCartStore();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
    calculateTotals();
  }, [calculateTotals]);

  if (!mounted) {
    return (
      <div className={cn('flex flex-col h-full bg-card', className)}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Keranjang</h2>
          {itemCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {itemCount}
            </Badge>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={clearCart}
          >
            <Ban className="h-4 w-4 mr-1" />
            Kosongkan
          </Button>
        )}
      </div>

      {/* Held Order Indicator */}
      {isHeld && (
        <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
          <Pause className="h-4 w-4" />
          Pesanan ditahan
        </div>
      )}

      {/* Cart Items */}
      <ScrollArea className="flex-1 px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Keranjang kosong</p>
            <p className="text-xs mt-1">Pilih produk untuk memulai</p>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border bg-background p-3 transition-all hover:shadow-sm"
              >
                <div className="flex gap-3">
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight line-clamp-1">
                      {item.name}
                    </h4>

                    {/* Modifiers */}
                    {item.modifiers.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.modifiers.map((mod) => (
                          <Badge
                            key={mod.id}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {mod.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="mt-1 text-xs text-muted-foreground italic truncate">
                        {item.notes}
                      </p>
                    )}

                    {/* Price */}
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 touch-target"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-base font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 touch-target"
                        onClick={() => updateQuantity(item.id, Math.min(99, item.quantity + 1))}
                        disabled={item.quantity >= 99}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer - Totals & Actions */}
      {items.length > 0 && (
        <div className="border-t p-4 space-y-4">
          {/* Discount Input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Diskon:</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Diskon ({discountPercent}%)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak (11%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="touch-target"
              onClick={() => {
                holdOrder();
                onHold?.();
              }}
            >
              <Pause className="h-4 w-4 mr-2" />
              Tahan
            </Button>
            <Button
              className="touch-target"
              onClick={onCheckout}
            >
              <ReceiptText className="h-4 w-4 mr-2" />
              Bayar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
