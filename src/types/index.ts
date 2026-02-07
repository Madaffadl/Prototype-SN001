// ============ ENUMS ============

export type UserRole = "ADMIN" | "CASHIER" | "CUSTOMER";

export type OrderStatus =
  | "PENDING"
  | "RECEIVED"
  | "COOKING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod = "CASH" | "QRIS" | "CARD";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

// ============ BASE MODELS ============

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  modifiers?: ProductModifier[];
  ingredients?: ProductIngredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  costPerUnit: number;
  expiryAlertDays: number; // Alert X days before expiry
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  batches?: IngredientBatch[];
}

// FIFO Batch for ingredient tracking
export interface IngredientBatch {
  id: string;
  ingredientId: string;
  batchNumber: string;
  initialQuantity: number;
  remainingQty: number;
  costPerUnit: number;
  arrivalDate: Date;
  expiryDate: Date;
  supplier?: string;
  notes?: string;
  isExpired: boolean;
  isFullyUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductIngredient {
  id: string;
  productId: string;
  ingredientId: string;
  quantity: number;
  ingredient?: Ingredient;
}

export interface ProductModifier {
  id: string;
  productId: string;
  name: string;
  priceChange: number;
  isDefault: boolean;
  groupName?: string;
}

// ============ ORDER MODELS ============

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: number;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  userId?: string;
  cashierId?: string;
  isHeld: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  payment?: Payment;
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: string;
  notes?: string;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
  changeAmount?: number;
  status: PaymentStatus;
  transactionRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ CART MODELS ============

export interface CartModifier {
  id: string;
  name: string;
  priceChange: number;
}

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  modifiers: CartModifier[];
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  tableNumber?: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ ANALYTICS TYPES ============

export interface DailySales {
  id: string;
  date: Date;
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  lowStockItems: number;
  revenueChange: number; // percentage change from yesterday
  ordersChange: number;
}
