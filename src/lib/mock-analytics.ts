import type { Order, Ingredient } from '@/types';

// Generate last 7 days of sales data
export function generateSalesData() {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseRevenue = 2500000 + Math.random() * 3000000;
    const orders = Math.floor(40 + Math.random() * 60);
    
    data.push({
      date: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      revenue: Math.round(baseRevenue),
      orders,
    });
  }
  
  return data;
}

// Top selling products
export function getTopProducts() {
  return [
    { name: 'Nasi Goreng Spesial', quantity: 156, revenue: 5460000 },
    { name: 'Kopi Susu Gula Aren', quantity: 142, revenue: 3124000 },
    { name: 'Ayam Bakar Madu', quantity: 98, revenue: 4704000 },
    { name: 'Mie Goreng Seafood', quantity: 87, revenue: 3654000 },
    { name: 'Es Teh Manis', quantity: 203, revenue: 1624000 },
  ];
}

// Recent orders mock data
export function getRecentOrders(): Order[] {
  const statuses: Order['status'][] = ['PENDING', 'RECEIVED', 'COOKING', 'READY', 'COMPLETED'];
  const now = new Date();
  
  return Array.from({ length: 10 }, (_, i) => {
    const createdAt = new Date(now.getTime() - i * 15 * 60 * 1000); // 15 min intervals
    return {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(100 - i).padStart(3, '0')}`,
      tableNumber: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      subtotal: 50000 + Math.random() * 200000,
      tax: 0,
      discount: 0,
      total: Math.round(50000 + Math.random() * 200000),
      createdAt,
      updatedAt: createdAt,
      isHeld: false,
    };
  });
}

// Low stock ingredients
export function getLowStockIngredients(): Ingredient[] {
  return [
    {
      id: 'ing-1',
      name: 'Daging Sapi',
      unit: 'kg',
      stock: 2,
      lowStockThreshold: 5,
      costPerUnit: 120000,
      expiryAlertDays: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-2',
      name: 'Bawang Putih',
      unit: 'kg',
      stock: 0.5,
      lowStockThreshold: 2,
      costPerUnit: 40000,
      expiryAlertDays: 14,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-3',
      name: 'Minyak Goreng',
      unit: 'liter',
      stock: 3,
      lowStockThreshold: 5,
      costPerUnit: 18000,
      expiryAlertDays: 30,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-4',
      name: 'Gula Aren',
      unit: 'kg',
      stock: 0,
      lowStockThreshold: 3,
      costPerUnit: 35000,
      expiryAlertDays: 30,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-5',
      name: 'Telur',
      unit: 'pcs',
      stock: 50,
      lowStockThreshold: 100,
      costPerUnit: 2500,
      expiryAlertDays: 7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

// Dashboard stats
export function getDashboardStats() {
  const todayRevenue = 4850000;
  const yesterdayRevenue = 4200000;
  const todayOrders = 78;
  const yesterdayOrders = 65;
  
  return {
    todayRevenue,
    todayOrders,
    pendingOrders: 5,
    lowStockItems: 4,
    revenueChange: ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100,
    ordersChange: ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100,
  };
}
