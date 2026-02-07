'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/shared';
import { KDSOrderCard } from '@/components/pos/KDSOrderCard';
import { generateMockOrders, type KDSOrder } from '@/lib/mock-orders';
import type { Order } from '@/types';

const statusFilters = [
  { value: 'all', label: 'Semua' },
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'RECEIVED', label: 'Diproses' },
  { value: 'COOKING', label: 'Dimasak' },
  { value: 'READY', label: 'Siap' },
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load orders on mount
  useEffect(() => {
    setOrders(generateMockOrders());
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setOrders(generateMockOrders());
    setLastRefresh(new Date());
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') {
      return order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
    }
    return order.status === statusFilter;
  });

  // Count by status
  const counts = {
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    RECEIVED: orders.filter(o => o.status === 'RECEIVED').length,
    COOKING: orders.filter(o => o.status === 'COOKING').length,
    READY: orders.filter(o => o.status === 'READY').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/pos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Kitchen Display System</h1>
              <p className="text-xs text-muted-foreground">
                Update terakhir: {lastRefresh.toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status counts */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Menunggu: {counts.PENDING}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Diproses: {counts.RECEIVED}
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Dimasak: {counts.COOKING}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Siap: {counts.READY}
              </Badge>
            </div>

            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b bg-muted/30 py-3">
        <div className="container px-4 flex items-center justify-between gap-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              {statusFilters.map(filter => (
                <TabsTrigger key={filter.value} value={filter.value}>
                  {filter.label}
                  {filter.value !== 'all' && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 justify-center">
                      {counts[filter.value as keyof typeof counts] || 0}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <main className="container px-4 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Tidak ada pesanan aktif</p>
            <p className="text-sm">Pesanan baru akan muncul di sini</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4 max-w-2xl mx-auto'
          }>
            {filteredOrders.map(order => (
              <KDSOrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
