'use client';

import { useState } from 'react';
import { 
  Users, 
  Clock, 
  Check, 
  X,
  CreditCard,
  Utensils,
  QrCode 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, cn } from '@/lib/utils';

// Table status types
type TableStatus = 'available' | 'occupied' | 'ordering' | 'waiting_payment' | 'reserved';

interface TableData {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  orderNumber?: string;
  guestCount?: number;
  orderTotal?: number;
  occupiedSince?: Date;
}

// Mock table data
const generateMockTables = (): TableData[] => {
  const statuses: TableStatus[] = ['available', 'occupied', 'ordering', 'waiting_payment', 'reserved'];
  const now = new Date();
  
  return Array.from({ length: 20 }, (_, i) => {
    const status = i < 3 ? 'available' : 
                   i < 8 ? 'occupied' : 
                   i < 11 ? 'ordering' :
                   i < 14 ? 'waiting_payment' :
                   i < 16 ? 'reserved' : 'available';
    
    return {
      id: `table-${i + 1}`,
      number: i + 1,
      seats: [2, 4, 4, 6, 4, 2, 4, 8, 4, 2][i % 10],
      status,
      orderNumber: status !== 'available' && status !== 'reserved' ? `ORD-${100 + i}` : undefined,
      guestCount: status !== 'available' && status !== 'reserved' ? Math.floor(Math.random() * 4) + 1 : undefined,
      orderTotal: status !== 'available' && status !== 'reserved' ? Math.floor(Math.random() * 300000) + 50000 : undefined,
      occupiedSince: status !== 'available' && status !== 'reserved' 
        ? new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000) 
        : undefined,
    };
  });
};

const statusConfig: Record<TableStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  available: { 
    label: 'Kosong', 
    color: 'text-green-600 dark:text-green-400', 
    bgColor: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
    icon: Check
  },
  occupied: { 
    label: 'Terisi', 
    color: 'text-blue-600 dark:text-blue-400', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    icon: Utensils
  },
  ordering: { 
    label: 'Memesan', 
    color: 'text-orange-600 dark:text-orange-400', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
    icon: QrCode
  },
  waiting_payment: { 
    label: 'Menunggu Bayar', 
    color: 'text-purple-600 dark:text-purple-400', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
    icon: CreditCard
  },
  reserved: { 
    label: 'Direservasi', 
    color: 'text-gray-600 dark:text-gray-400', 
    bgColor: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    icon: Clock
  },
};

function getTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} menit`;
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  return `${diffHours}j ${remainingMins}m`;
}

interface TableManagementProps {
  className?: string;
}

export function TableManagement({ className }: TableManagementProps) {
  const [tables] = useState<TableData[]>(generateMockTables);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [filter, setFilter] = useState<TableStatus | 'all'>('all');

  const filteredTables = filter === 'all' 
    ? tables 
    : tables.filter(t => t.status === filter);

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    ordering: tables.filter(t => t.status === 'ordering').length,
    waiting_payment: tables.filter(t => t.status === 'waiting_payment').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Manajemen Meja
          </CardTitle>
          <div className="flex items-center gap-1 text-sm">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {tables.filter(t => t.status !== 'available' && t.status !== 'reserved').reduce((sum, t) => sum + (t.guestCount || 0), 0)} tamu
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua ({tables.length})
          </Button>
          {(Object.keys(statusConfig) as TableStatus[]).map(status => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              className={filter === status ? '' : statusConfig[status].color}
              onClick={() => setFilter(status)}
            >
              {statusConfig[status].label} ({stats[status]})
            </Button>
          ))}
        </div>

        {/* Table Grid */}
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filteredTables.map(table => {
              const config = statusConfig[table.status];
              const Icon = config.icon;
              
              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={cn(
                    'relative p-3 rounded-xl border-2 transition-all',
                    'hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary',
                    config.bgColor
                  )}
                >
                  {/* Table Number */}
                  <div className={cn('text-2xl font-bold', config.color)}>
                    {table.number}
                  </div>
                  
                  {/* Status Icon */}
                  <Icon className={cn('h-4 w-4 mt-1', config.color)} />
                  
                  {/* Seats indicator */}
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {table.seats} kursi
                  </div>

                  {/* Time badge for occupied tables */}
                  {table.occupiedSince && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="secondary" className="text-[8px] px-1 py-0">
                        {getTimeSince(table.occupiedSince)}
                      </Badge>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t text-xs">
          {(Object.keys(statusConfig) as TableStatus[]).map(status => {
            const config = statusConfig[status];
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-1">
                <div className={cn('w-3 h-3 rounded-sm', config.bgColor.split(' ')[0])} />
                <Icon className={cn('h-3 w-3', config.color)} />
                <span className="text-muted-foreground">{config.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Table Detail Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Meja {selectedTable?.number}
              {selectedTable && (
                <Badge className={statusConfig[selectedTable.status].bgColor}>
                  {statusConfig[selectedTable.status].label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Kapasitas: {selectedTable?.seats} kursi
            </DialogDescription>
          </DialogHeader>
          
          {selectedTable && selectedTable.status !== 'available' && selectedTable.status !== 'reserved' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">No. Order</p>
                  <p className="font-medium">{selectedTable.orderNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jumlah Tamu</p>
                  <p className="font-medium">{selectedTable.guestCount} orang</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Durasi</p>
                  <p className="font-medium">
                    {selectedTable.occupiedSince && getTimeSince(selectedTable.occupiedSince)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-primary">
                    {selectedTable.orderTotal && formatCurrency(selectedTable.orderTotal)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Lihat QR
                </Button>
                <Button className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proses Bayar
                </Button>
              </div>
            </div>
          )}

          {selectedTable?.status === 'available' && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Meja ini tersedia untuk tamu baru.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Reservasi
                </Button>
                <Button className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Terima Tamu
                </Button>
              </div>
            </div>
          )}

          {selectedTable?.status === 'reserved' && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Meja ini sudah direservasi.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Batalkan
                </Button>
                <Button className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Konfirmasi Tamu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
