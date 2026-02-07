'use client';

import Link from 'next/link';
import { 
  Store, 
  Search, 
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function Header({
  title = 'Smart POS',
  showSearch = true,
  onSearch,
  className,
}: HeaderProps) {
  return (
    <header className={cn('flex items-center justify-between p-4 gap-4', className)}>
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold hidden sm:inline">{title}</span>
        </Link>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="pl-9 bg-muted/50"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative touch-target">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/cashier.jpg" alt="User" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">Kasir 01</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
