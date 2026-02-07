'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  XCircle,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';
import type { KDSOrderItem, KDSOrder } from '@/lib/mock-orders';

interface KDSOrderCardProps {
  order: KDSOrder;
  onStatusChange: (orderId: string, status: Order['status']) => void;
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    nextStatus: 'RECEIVED' as const,
    nextLabel: 'Terima',
  },
  RECEIVED: {
    icon: ChefHat,
    label: 'Diproses',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    nextStatus: 'COOKING' as const,
    nextLabel: 'Mulai Masak',
  },
  COOKING: {
    icon: Timer,
    label: 'Dimasak',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    nextStatus: 'READY' as const,
    nextLabel: 'Siap Antar',
  },
  READY: {
    icon: CheckCircle2,
    label: 'Siap',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    nextStatus: 'COMPLETED' as const,
    nextLabel: 'Selesai',
  },
  COMPLETED: {
    icon: CheckCircle2,
    label: 'Selesai',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    nextStatus: null,
    nextLabel: '',
  },
  CANCELLED: {
    icon: XCircle,
    label: 'Dibatalkan',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    nextStatus: null,
    nextLabel: '',
  },
};

function getElapsedTime(createdAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit`;
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}j ${mins}m`;
}

export function KDSOrderCard({ order, onStatusChange }: KDSOrderCardProps) {
  const [elapsed, setElapsed] = useState(getElapsedTime(order.createdAt));
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  // Update elapsed time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(order.createdAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isUrgent = (() => {
    const diffMs = new Date().getTime() - new Date(order.createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins >= 15 && order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
  })();

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      isUrgent && 'ring-2 ring-red-500 animate-pulse',
      order.status === 'COMPLETED' && 'opacity-60',
      order.status === 'CANCELLED' && 'opacity-40'
    )}>
      {/* Header */}
      <CardHeader className={cn('py-3 px-4', config.color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            <CardTitle className="text-base">{order.orderNumber}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {order.tableNumber && (
              <Badge variant="secondary" className="font-bold">
                Meja {order.tableNumber}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {elapsed}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Items */}
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          {order.items.map((item: KDSOrderItem, idx: number) => (
            <div key={idx} className="flex items-start justify-between text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{item.quantity}x</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p className="text-xs text-muted-foreground ml-6">
                    + {item.modifiers.map(m => m.name).join(', ')}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-orange-600 ml-6 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-bold">{formatCurrency(order.total)}</span>
          </div>
          
          {config.nextStatus && (
            <Button
              size="sm"
              onClick={() => onStatusChange(order.id, config.nextStatus!)}
              className="touch-target"
            >
              {config.nextLabel}
            </Button>
          )}
          
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onStatusChange(order.id, 'CANCELLED')}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
