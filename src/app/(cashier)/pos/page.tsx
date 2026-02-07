'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  POSLayout,
  ProductCard,
  CategoryTabs,
  PaymentModal,
  CartSidebar,
} from '@/components/pos';
import { Header } from '@/components/shared';
import { mockCategories, mockProducts, searchProducts } from '@/lib/mock-data';
import { useCartStore } from '@/stores/cartStore';

export default function CashierPOSPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const itemCount = useCartStore((state) => state.itemCount);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    // Filter by category
    if (activeCategory !== 'all') {
      products = products.filter((p) => p.categoryId === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      products = searchProducts(searchQuery);
      if (activeCategory !== 'all') {
        products = products.filter((p) => p.categoryId === activeCategory);
      }
    }

    return products;
  }, [activeCategory, searchQuery]);

  const handleCheckout = () => {
    setPaymentOpen(true);
    setMobileCartOpen(false);
  };

  const handlePaymentComplete = () => {
    setPaymentOpen(false);
  };

  return (
    <>
      <POSLayout
        onCheckout={handleCheckout}
        header={
          <div className="space-y-3">
            <Header
              title="Smart POS"
              showSearch
              onSearch={setSearchQuery}
            />
            <div className="px-4 pb-3 flex items-center gap-4">
              <CategoryTabs
                categories={mockCategories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <Button variant="outline" size="sm" asChild className="shrink-0 gap-2">
                <Link href="/kitchen">
                  <ChefHat className="h-4 w-4" />
                  Dapur
                </Link>
              </Button>
            </div>
          </div>
        }
      >
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size="md"
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">Tidak ada produk ditemukan</p>
            <p className="text-sm mt-1">Coba kategori atau kata kunci lain</p>
          </div>
        )}
      </POSLayout>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-4 right-4 lg:hidden z-50">
        <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="h-14 w-14 rounded-full shadow-lg relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <CartSidebar
              onCheckout={handleCheckout}
              className="h-full"
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        onComplete={handlePaymentComplete}
      />
    </>
  );
}
