'use client';

import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';
import type { Ingredient } from '@/types';

interface LowStockAlertsProps {
  ingredients: Ingredient[];
  className?: string;
}

export function LowStockAlerts({ ingredients, className }: LowStockAlertsProps) {
  const lowStockItems = ingredients.filter(
    (item) => item.stock <= item.lowStockThreshold
  );

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Stok Menipis
        </CardTitle>
        {lowStockItems.length > 0 && (
          <Badge variant="destructive">{lowStockItems.length}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-1 px-6 pb-6">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Semua stok aman 👍
              </p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Min: {formatNumber(item.lowStockThreshold)} {item.unit}
                    </p>
                  </div>
                  <Badge
                    variant={item.stock === 0 ? 'destructive' : 'secondary'}
                    className={cn(
                      item.stock === 0
                        ? ''
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    )}
                  >
                    {formatNumber(item.stock)} {item.unit}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
