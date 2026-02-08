 'use client';

import { useEffect, useState } from 'react';

import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  StatsCard,
  SalesChart,
  TopProductsChart,
  RecentOrders,
  LowStockAlerts,
  TableManagement,
} from '@/components/admin';
import { formatCurrency } from '@/lib/utils';
import {
  generateSalesData,
  getTopProducts,
  getRecentOrders,
  getLowStockIngredients,
  getDashboardStats,
} from '@/lib/mock-analytics';

export default function DashboardPage() {
  const [data, setData] = useState<{
    stats: ReturnType<typeof getDashboardStats>;
    salesData: ReturnType<typeof generateSalesData>;
    topProducts: ReturnType<typeof getTopProducts>;
    recentOrders: ReturnType<typeof getRecentOrders>;
    lowStockIngredients: ReturnType<typeof getLowStockIngredients>;
  } | null>(null);

  useEffect(() => {
    // Generate data only on client
    setData({
      stats: getDashboardStats(),
      salesData: generateSalesData(),
      topProducts: getTopProducts(),
      recentOrders: getRecentOrders(),
      lowStockIngredients: getLowStockIngredients(),
    });
  }, []);

  // Show loading skeleton while data is generated
  if (!data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-muted rounded-xl" />
          <div className="h-[400px] bg-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-[400px] bg-muted rounded-xl lg:col-span-2" />
          <div className="h-[400px] bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, salesData, topProducts, recentOrders, lowStockIngredients } = data;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pendapatan Hari Ini"
          value={formatCurrency(stats.todayRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{
            value: stats.revenueChange,
            isPositive: stats.revenueChange > 0,
          }}
        />
        <StatsCard
          title="Total Pesanan"
          value={stats.todayOrders}
          description="Pesanan hari ini"
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{
            value: stats.ordersChange,
            isPositive: stats.ordersChange > 0,
          }}
        />
        <StatsCard
          title="Pesanan Pending"
          value={stats.pendingOrders}
          description="Menunggu proses"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Stok Menipis"
          value={stats.lowStockItems}
          description="Butuh restock"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} />
        <TopProductsChart data={topProducts} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders orders={recentOrders} className="lg:col-span-2" />
        <LowStockAlerts ingredients={lowStockIngredients} />
      </div>

      {/* Table Management */}
      <TableManagement />
    </div>
  );
}
