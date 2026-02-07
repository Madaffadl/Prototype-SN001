'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Settings,
  LogOut,
  Store,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Menu',
    href: '/dashboard/menu',
    icon: Package,
  },
  {
    title: 'Inventori',
    href: '/dashboard/inventory',
    icon: Warehouse,
  },
  {
    title: 'Pengguna',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const quickLinks = [
  {
    title: 'POS Terminal',
    href: '/pos',
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-card border-r transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">Smart POS</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
            <Store className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="py-2">
          <div className="border-t" />
        </div>

        {/* Quick Links */}
        {!collapsed && (
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Akses Cepat
          </p>
        )}
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start text-muted-foreground hover:text-destructive',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="ml-3">Keluar</span>}
        </Button>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
