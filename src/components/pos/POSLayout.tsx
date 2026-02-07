'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CartSidebar } from './CartSidebar';

interface POSLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  onCheckout?: () => void;
  onHold?: () => void;
  showCart?: boolean;
  className?: string;
}

export function POSLayout({
  children,
  header,
  onCheckout,
  onHold,
  showCart = true,
  className,
}: POSLayoutProps) {
  return (
    <div className={cn('flex h-screen overflow-hidden bg-background', className)}>
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Optional Header */}
        {header && (
          <div className="shrink-0 border-b bg-card">
            {header}
          </div>
        )}

        {/* Products Grid Area */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>

      {/* Cart Sidebar - Fixed on right */}
      {showCart && (
        <aside className="hidden lg:flex w-[380px] shrink-0 border-l">
          <CartSidebar
            onCheckout={onCheckout}
            onHold={onHold}
            className="w-full"
          />
        </aside>
      )}
    </div>
  );
}
