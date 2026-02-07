'use client';

import { formatCurrency, formatTime, getOrderStatusColor, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Order } from '@/types';

interface RecentOrdersProps {
  orders: Order[];
  className?: string;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Menunggu',
  RECEIVED: 'Diterima',
  COOKING: 'Dimasak',
  READY: 'Siap',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export function RecentOrders({ orders, className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pesanan Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-1 px-6 pb-6">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada pesanan hari ini
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.orderNumber}</span>
                      {order.tableNumber && (
                        <Badge variant="outline" className="text-xs">
                          Meja {order.tableNumber}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                    <Badge className={cn('text-xs', getOrderStatusColor(order.status))}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
