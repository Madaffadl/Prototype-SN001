import type { Order } from '@/types';

// Custom KDS Order Item type (different from database OrderItem for display purposes)
export interface KDSOrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: { id: string; name: string; price: number }[];
  notes?: string;
  subtotal: number;
}

export type KDSOrder = Omit<Order, 'items'> & { items: KDSOrderItem[] };

// Generate realistic mock orders for KDS
export function generateMockOrders(): KDSOrder[] {
  const now = new Date();
  
  const orderTemplates = [
    {
      items: [
        { productId: 'prod-1', name: 'Nasi Goreng Spesial', quantity: 2, price: 35000, modifiers: [{ id: 'm1', name: 'Level Pedas 3', price: 0 }] },
        { productId: 'prod-5', name: 'Es Teh Manis', quantity: 2, price: 8000 },
      ],
      tableNumber: 5,
      minutesAgo: 2,
    },
    {
      items: [
        { productId: 'prod-3', name: 'Ayam Bakar Madu', quantity: 1, price: 48000 },
        { productId: 'prod-2', name: 'Mie Goreng Seafood', quantity: 1, price: 42000, notes: 'Tidak pakai udang' },
        { productId: 'prod-7', name: 'Jus Alpukat', quantity: 2, price: 18000 },
      ],
      tableNumber: 12,
      minutesAgo: 8,
    },
    {
      items: [
        { productId: 'prod-6', name: 'Kopi Susu Gula Aren', quantity: 3, price: 22000, modifiers: [{ id: 'm2', name: 'Less Sugar', price: 0 }] },
      ],
      tableNumber: undefined, // Takeaway
      minutesAgo: 5,
    },
    {
      items: [
        { productId: 'prod-4', name: 'Sate Ayam', quantity: 2, price: 30000 },
        { productId: 'prod-1', name: 'Nasi Goreng Spesial', quantity: 1, price: 35000, modifiers: [{ id: 'm3', name: 'Extra Telur', price: 5000 }] },
        { productId: 'prod-5', name: 'Es Teh Manis', quantity: 3, price: 8000 },
      ],
      tableNumber: 3,
      minutesAgo: 18, // This will be urgent!
    },
    {
      items: [
        { productId: 'prod-8', name: 'Pisang Goreng Coklat', quantity: 2, price: 15000 },
        { productId: 'prod-6', name: 'Kopi Susu Gula Aren', quantity: 1, price: 22000 },
      ],
      tableNumber: 8,
      minutesAgo: 1,
    },
  ];

  const statuses: Order['status'][] = ['PENDING', 'PENDING', 'RECEIVED', 'COOKING', 'PENDING'];

  return orderTemplates.map((template, index) => {
    const createdAt = new Date(now.getTime() - template.minutesAgo * 60 * 1000);
    const items: KDSOrderItem[] = template.items.map((item, itemIdx) => ({
      id: `item-${index}-${itemIdx}`,
      orderId: `order-${index + 1}`,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      modifiers: 'modifiers' in item ? item.modifiers : undefined,
      notes: 'notes' in item ? item.notes : undefined,
      subtotal: item.quantity * item.price,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;

    return {
      id: `order-${index + 1}`,
      orderNumber: `ORD-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(100 + index).padStart(3, '0')}`,
      tableNumber: template.tableNumber,
      status: statuses[index],
      subtotal,
      tax,
      discount: 0,
      total: subtotal + tax,
      items,
      createdAt,
      updatedAt: createdAt,
      isHeld: false,
    };
  });
}
