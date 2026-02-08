'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  Receipt, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency, cn } from '@/lib/utils';

type OrderStatus = 'completed' | 'cancelled' | 'refunded';
type PaymentMethod = 'CASH' | 'QRIS' | 'CARD';

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  tableNumber?: number;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  cashierName: string;
}

// Generate mock order history
const generateMockOrders = (): OrderHistoryItem[] => {
  const now = new Date();
  const menuItems = [
    'Nasi Goreng Spesial', 'Mie Ayam Bakso', 'Es Teh Manis', 'Ayam Geprek',
    'Sate Ayam', 'Gado-gado', 'Es Jeruk', 'Bakso Malang', 'Nasi Uduk',
    'Es Campur', 'Soto Ayam', 'Rendang', 'Kopi Susu', 'Teh Tarik'
  ];
  
  return Array.from({ length: 15 }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = Array.from({ length: itemCount }, () => ({
      name: menuItems[Math.floor(Math.random() * menuItems.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 30000) + 10000,
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = i % 5 === 0 ? subtotal * 0.1 : 0;
    const tax = (subtotal - discount) * 0.11;
    const total = subtotal - discount + tax;
    
    const statuses: OrderStatus[] = ['completed', 'completed', 'completed', 'completed', 'cancelled', 'refunded'];
    const paymentMethods: PaymentMethod[] = ['CASH', 'QRIS', 'CARD'];
    
    return {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${String(1000 + i).padStart(4, '0')}`,
      tableNumber: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : undefined,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(now.getTime() - i * 15 * 60 * 1000), // Every 15 mins
      cashierName: ['Budi', 'Ani', 'Citra', 'Dedi'][Math.floor(Math.random() * 4)],
    };
  });
};

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Check },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: X },
  refunded: { label: 'Refund', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: RotateCcw },
};

const paymentIcons: Record<PaymentMethod, React.ElementType> = {
  CASH: Banknote,
  QRIS: Smartphone,
  CARD: CreditCard,
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

interface OrderHistorySidebarProps {
  triggerButton?: React.ReactNode;
}

export function OrderHistorySidebar({ triggerButton }: OrderHistorySidebarProps) {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrders(generateMockOrders());
  }, []);

  if (!mounted) return null;

  const todayOrders = orders.filter(o => {
    const today = new Date();
    return o.createdAt.toDateString() === today.toDateString();
  });

  const todayTotal = todayOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {triggerButton || (
            <Button variant="outline" size="sm" className="gap-2">
              <History className="h-4 w-4" />
              Riwayat
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Riwayat Transaksi Hari Ini
            </SheetTitle>
          </SheetHeader>

          {/* Summary */}
          <div className="p-4 bg-muted/50 border-b">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{todayOrders.length}</p>
                <p className="text-xs text-muted-foreground">Transaksi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {todayOrders.filter(o => o.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Selesai</p>
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(todayTotal)}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>

          {/* Order List */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-2 space-y-2">
              {todayOrders.map(order => {
                const StatusIcon = statusConfig[order.status].icon;
                const PaymentIcon = paymentIcons[order.paymentMethod];
                
                return (
                  <Card
                    key={order.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      order.status === 'cancelled' && 'opacity-60'
                    )}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-10 w-10 rounded-full flex items-center justify-center',
                            statusConfig[order.status].color
                          )}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{order.orderNumber}</span>
                              {order.tableNumber && (
                                <Badge variant="outline" className="text-[10px] px-1">
                                  M{order.tableNumber}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(order.createdAt)}
                              <PaymentIcon className="h-3 w-3 ml-1" />
                              {order.paymentMethod}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} item</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {todayOrders.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Belum ada transaksi hari ini</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {selectedOrder?.orderNumber}
              {selectedOrder && (
                <Badge className={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder && formatTimeAgo(selectedOrder.createdAt)} • 
              Kasir: {selectedOrder?.cashierName}
              {selectedOrder?.tableNumber && ` • Meja ${selectedOrder.tableNumber}`}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Items */}
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                {(() => {
                  const Icon = paymentIcons[selectedOrder.paymentMethod];
                  return <Icon className="h-5 w-5 text-muted-foreground" />;
                })()}
                <div>
                  <p className="text-sm font-medium">
                    {selectedOrder.paymentMethod === 'CASH' ? 'Tunai' : 
                     selectedOrder.paymentMethod === 'QRIS' ? 'QRIS' : 'Kartu'}
                  </p>
                  <p className="text-xs text-muted-foreground">Metode Pembayaran</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedOrder?.status === 'completed' && (
              <>
                <Button variant="outline" className="flex-1">
                  <Receipt className="h-4 w-4 mr-2" />
                  Cetak Struk
                </Button>
                <Button variant="destructive" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refund
                </Button>
              </>
            )}
            {selectedOrder?.status !== 'completed' && (
              <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                Tutup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
