import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as currency (IDR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to locale string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.getTime().toString().slice(-6);
  return `ORD-${date}-${time}`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculate percentage change
 */
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    RECEIVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    COOKING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    READY: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[status] || colors.PENDING;
}

/**
 * Get payment method icon name
 */
export function getPaymentMethodIcon(method: string): string {
  const icons: Record<string, string> = {
    CASH: 'Banknote',
    QRIS: 'QrCode',
    CARD: 'CreditCard',
  };
  return icons[method] || 'CircleDollarSign';
}
