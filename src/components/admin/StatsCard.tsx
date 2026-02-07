'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
              <span className="text-muted-foreground">vs kemarin</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
