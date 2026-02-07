import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POS Terminal - Smart POS',
  description: 'Point of Sale terminal untuk kasir',
};

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
