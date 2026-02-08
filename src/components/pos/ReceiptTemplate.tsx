'use client';

import { forwardRef } from 'react';
import { formatCurrency } from '@/lib/utils';
import type { CartItem } from '@/types';

interface ReceiptProps {
  orderNumber: string;
  tableNumber?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountPercent: number;
  total: number;
  paymentMethod: string;
  receivedAmount?: number;
  change?: number;
  cashierName?: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptProps>(
  function ReceiptTemplate(
    {
      orderNumber,
      tableNumber,
      items,
      subtotal,
      tax,
      discount,
      discountPercent,
      total,
      paymentMethod,
      receivedAmount,
      change,
      cashierName = 'Kasir',
      storeName = 'Smart POS Restaurant',
      storeAddress = 'Jl. Contoh No. 123, Jakarta',
      storePhone = '021-1234567',
    },
    ref
  ) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div
        ref={ref}
        className="receipt-print bg-white text-black p-4 w-[300px] font-mono text-xs"
        style={{ fontFamily: 'monospace' }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-bold text-lg">{storeName}</h1>
          <p className="text-[10px]">{storeAddress}</p>
          <p className="text-[10px]">Tel: {storePhone}</p>
        </div>

        <div className="border-t border-dashed border-black pt-2 mb-2">
          <div className="flex justify-between">
            <span>No: {orderNumber}</span>
            {tableNumber && <span>Meja: {tableNumber}</span>}
          </div>
          <div className="flex justify-between text-[10px]">
            <span>{dateStr}</span>
            <span>{timeStr}</span>
          </div>
          <p className="text-[10px]">Kasir: {cashierName}</p>
        </div>

        {/* Items */}
        <div className="border-t border-dashed border-black py-2">
          {items.map((item) => (
            <div key={item.id} className="mb-1">
              <div className="flex justify-between">
                <span className="flex-1 truncate">{item.name}</span>
              </div>
              <div className="flex justify-between pl-2">
                <span>
                  {item.quantity} x {formatCurrency(item.price)}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
              {item.modifiers.length > 0 && (
                <div className="pl-2 text-[10px]">
                  + {item.modifiers.map((m) => m.name).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-black py-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Diskon ({discountPercent}%)</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Pajak (11%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm border-t border-dashed border-black pt-1 mt-1">
            <span>TOTAL</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="border-t border-dashed border-black py-2 space-y-1">
          <div className="flex justify-between">
            <span>Metode</span>
            <span>{paymentMethod}</span>
          </div>
          {receivedAmount !== undefined && (
            <div className="flex justify-between">
              <span>Diterima</span>
              <span>{formatCurrency(receivedAmount)}</span>
            </div>
          )}
          {change !== undefined && change > 0 && (
            <div className="flex justify-between font-bold">
              <span>Kembali</span>
              <span>{formatCurrency(change)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dashed border-black pt-3 mt-2 text-center">
          <p className="font-bold">Terima Kasih!</p>
          <p className="text-[10px] mt-1">Simpan struk ini sebagai bukti pembayaran</p>
          <p className="text-[10px] mt-2">--- Smart POS ---</p>
        </div>
      </div>
    );
  }
);

// Print styles to add to globals.css
export const receiptPrintStyles = `
@media print {
  body * {
    visibility: hidden;
  }
  .receipt-print,
  .receipt-print * {
    visibility: visible;
  }
  .receipt-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
  }
}
`;
