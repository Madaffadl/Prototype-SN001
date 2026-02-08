'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  Utensils,
  Bell,
  Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderProgress {
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  estimatedTime?: number; // in minutes
  placedAt: Date;
}

const statusConfig: Record<OrderStatus, { 
  label: string; 
  description: string;
  icon: React.ElementType; 
  color: string;
  progress: number;
}> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    description: 'Pesanan sedang dikirim ke kasir',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    progress: 10,
  },
  confirmed: {
    label: 'Pesanan Diterima',
    description: 'Pesanan dikonfirmasi, menunggu diproses',
    icon: CheckCircle2,
    color: 'text-blue-600 dark:text-blue-400',
    progress: 25,
  },
  preparing: {
    label: 'Sedang Dimasak',
    description: 'Dapur sedang menyiapkan pesanan Anda',
    icon: ChefHat,
    color: 'text-orange-600 dark:text-orange-400',
    progress: 60,
  },
  ready: {
    label: 'Siap Disajikan',
    description: 'Pesanan Anda sudah selesai!',
    icon: Package,
    color: 'text-green-600 dark:text-green-400',
    progress: 90,
  },
  served: {
    label: 'Sudah Disajikan',
    description: 'Selamat menikmati!',
    icon: Utensils,
    color: 'text-primary',
    progress: 100,
  },
};

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

interface OrderProgressTrackerProps {
  order?: OrderProgress;
  onCallWaiter?: () => void;
}

export function OrderProgressTracker({ order, onCallWaiter }: OrderProgressTrackerProps) {
  const [currentOrder, setCurrentOrder] = useState<OrderProgress | null>(order || null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simulate order progress for demo
  useEffect(() => {
    if (!currentOrder) {
      // Demo: simulate a new order
      const demoOrder: OrderProgress = {
        orderNumber: 'ORD-' + Math.floor(Math.random() * 9000 + 1000),
        status: 'pending',
        items: [
          { name: 'Nasi Goreng Spesial', quantity: 1 },
          { name: 'Es Teh Manis', quantity: 2 },
          { name: 'Ayam Geprek', quantity: 1 },
        ],
        estimatedTime: 15,
        placedAt: new Date(),
      };
      setCurrentOrder(demoOrder);
    }
  }, [currentOrder]);

  // Update elapsed time
  useEffect(() => {
    if (!currentOrder) return;
    
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - currentOrder.placedAt.getTime()) / 1000);
      setElapsedTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentOrder]);

  // Simulate status progression for demo
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'served') return;

    const progressIntervals: Record<OrderStatus, number> = {
      pending: 3000,      // 3 sec to confirmed
      confirmed: 5000,    // 5 sec to preparing
      preparing: 10000,   // 10 sec to ready
      ready: 8000,        // 8 sec to served
      served: 0,
    };

    const timeout = setTimeout(() => {
      const currentIndex = statusOrder.indexOf(currentOrder.status);
      if (currentIndex < statusOrder.length - 1) {
        setCurrentOrder(prev => prev ? {
          ...prev,
          status: statusOrder[currentIndex + 1],
        } : null);
      }
    }, progressIntervals[currentOrder.status]);

    return () => clearTimeout(timeout);
  }, [currentOrder]);

  if (!currentOrder) return null;

  const config = statusConfig[currentOrder.status];
  const StatusIcon = config.icon;
  const currentIndex = statusOrder.indexOf(currentOrder.status);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with current status */}
        <div className={cn(
          'p-4 text-center',
          currentOrder.status === 'ready' && 'bg-green-100 dark:bg-green-900/30',
          currentOrder.status === 'preparing' && 'bg-orange-50 dark:bg-orange-900/20',
        )}>
          <div className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-full mb-3',
            currentOrder.status === 'ready' ? 'bg-green-200 dark:bg-green-800' : 'bg-muted',
            currentOrder.status === 'preparing' && 'animate-pulse'
          )}>
            <StatusIcon className={cn('h-8 w-8', config.color)} />
          </div>
          
          <h3 className={cn('text-lg font-bold', config.color)}>
            {config.label}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {config.description}
          </p>

          <Badge variant="outline" className="mt-3">
            {currentOrder.orderNumber}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 border-t">
          <Progress value={config.progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Dipesan</span>
            <span>Diproses</span>
            <span>Siap</span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="px-4 py-3 border-t space-y-2">
          {statusOrder.slice(0, -1).map((status, index) => {
            const statusConf = statusConfig[status];
            const Icon = statusConf.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={status}
                className={cn(
                  'flex items-center gap-3 py-1.5',
                  !isCompleted && !isCurrent && 'opacity-40'
                )}
              >
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                  isCompleted && 'bg-green-100 dark:bg-green-900/30',
                  isCurrent && 'bg-primary/10 ring-2 ring-primary',
                  !isCompleted && !isCurrent && 'bg-muted'
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icon className={cn('h-4 w-4', isCurrent ? config.color : 'text-muted-foreground')} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium',
                    isCurrent && config.color
                  )}>
                    {statusConf.label}
                  </p>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Order Items */}
        <div className="px-4 py-3 border-t bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">Pesanan Anda:</p>
          <div className="space-y-1">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <Badge variant="secondary" className="text-xs">
                  x{item.quantity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Waktu: </span>
            <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
          </div>
          
          {currentOrder.status !== 'served' && (
            <button
              onClick={onCallWaiter}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Bell className="h-4 w-4" />
              Panggil Pelayan
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
