'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProps {
  product: Product;
  onCustomize?: (product: Product) => void;
  showQuickAdd?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductCard({
  product,
  onCustomize,
  showQuickAdd = true,
  size = 'md',
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [imageError, setImageError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleClick = () => {
    if (onCustomize) {
      onCustomize(product);
    } else {
      addItem(product, 1);
    }
  };

  const sizeClasses = {
    sm: 'h-[140px]',
    md: 'h-[180px]',
    lg: 'h-[220px]',
  };

  const imageSizes = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5',
        'touch-target',
        !product.isAvailable && 'opacity-60 grayscale',
        sizeClasses[size]
      )}
      onClick={handleClick}
    >
      <CardContent className="flex h-full flex-col p-3">
        {/* Product Image */}
        <div
          className={cn(
            'relative w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center',
            imageSizes[size]
          )}
        >
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImageOff className="h-8 w-8 text-muted-foreground/50" />
          )}

          {/* Out of stock badge */}
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-xs">
                Habis
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-2 flex flex-1 flex-col justify-between">
          <h3
            className={cn(
              'font-medium leading-tight line-clamp-2',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            {product.name}
          </h3>

          <div className="mt-1 flex items-center justify-between">
            <span
              className={cn(
                'font-bold text-primary',
                size === 'sm' ? 'text-sm' : 'text-base'
              )}
            >
              {formatCurrency(product.price)}
            </span>

            {/* Quick Add Button */}
            {showQuickAdd && product.isAvailable && (
              <Button
                size="icon"
                variant="default"
                className={cn(
                  'rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105',
                  size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
                )}
                onClick={handleQuickAdd}
              >
                <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
              </Button>
            )}
          </div>
        </div>

        {/* Modifiers indicator */}
        {product.modifiers && product.modifiers.length > 0 && (
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="text-[10px] px-1.5">
              +{product.modifiers.length}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
