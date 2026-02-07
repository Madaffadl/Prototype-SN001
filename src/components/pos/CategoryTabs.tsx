'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  showAll?: boolean;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  showAll = true,
  className,
}: CategoryTabsProps) {
  return (
    <div className={cn('w-full', className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="inline-flex h-12 w-max gap-1 bg-muted/50 p-1">
            {showAll && (
              <TabsTrigger
                value="all"
                className="touch-target px-6 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Semua
              </TabsTrigger>
            )}
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="touch-target px-6 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
