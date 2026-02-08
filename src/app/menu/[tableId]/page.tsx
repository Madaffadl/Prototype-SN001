'use client';

import { useState, useMemo, use, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChefHat,
  Bell,
  ImageOff,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/shared';
import { formatCurrency, cn, getOrderStatusColor } from '@/lib/utils';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import { useCartStore } from '@/stores/cartStore';
import { OrderProgressTracker } from '@/components/customer/OrderProgressTracker';
import type { Product, ProductModifier, OrderStatus } from '@/types';

interface CustomerMenuPageProps {
  params: Promise<{ tableId: string }>;
}

// Mock order status for demo
const mockOrderStatus: { id: string; status: OrderStatus; items: string[] } | null = null;

export default function CustomerMenuPage({ params }: CustomerMenuPageProps) {
  const { tableId } = use(params);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<ProductModifier[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { items, addItem, removeItem, updateQuantity, total, itemCount, clearCart, setTableNumber, calculateTotals } = useCartStore();

  useEffect(() => {
    setMounted(true);
    setTableNumber(Number(tableId));
    calculateTotals();
  }, [tableId, setTableNumber, calculateTotals]);

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return mockProducts;
    return mockProducts.filter((p) => p.categoryId === activeCategory);
  }, [activeCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedModifiers([]);
    setQuantity(1);
  };

  const handleModifierToggle = (modifier: ProductModifier) => {
    setSelectedModifiers((prev) => {
      const exists = prev.find((m) => m.id === modifier.id);
      if (exists) {
        return prev.filter((m) => m.id !== modifier.id);
      }
      return [...prev, modifier];
    });
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addItem(selectedProduct, quantity, selectedModifiers);
    toast.success('Produk ditambahkan ke keranjang', {
      description: `${quantity}x ${selectedProduct.name}`,
    });
    setSelectedProduct(null);
    setSelectedModifiers([]);
    setQuantity(1);
  };

  const calculateItemTotal = () => {
    if (!selectedProduct) return 0;
    const modifierTotal = selectedModifiers.reduce((sum, m) => sum + m.priceChange, 0);
    return (selectedProduct.price + modifierTotal) * quantity;
  };

  const handlePlaceOrder = async () => {
    // Simulate API call with promise toast
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));

    toast.promise(promise, {
      loading: 'Mengirim pesanan ke dapur...',
      success: () => {
        clearCart();
        setCartOpen(false);
        setOrderTrackerOpen(true); // Show order tracker after placing
        return 'Pesanan berhasil dikirim!';
      },
      error: 'Gagal mengirim pesanan',
    });
  };

  const handleCallWaiter = () => {
    toast.info('Pelayan dipanggil', {
      description: 'Mohon tunggu sebentar, pelayan kami akan segera datang.',
      icon: <Bell className="h-4 w-4 text-blue-500" />,
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold gradient-text">Smart POS</h1>
            <p className="text-sm text-muted-foreground">
              Meja #{tableId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                toast.info('Pelayan dipanggil', {
                  description: 'Mohon tunggu sebentar, pelayan kami akan segera datang.',
                  icon: <Bell className="h-4 w-4 text-blue-500" />,
                });
              }}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Panggil</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 px-4 pb-3 pr-12">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full shrink-0"
                onClick={() => setActiveCategory('all')}
              >
                Semua
              </Button>
              {mockCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full shrink-0"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
          {/* Scroll Fade Indicator */}
          <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </header>

      {/* Order Status Banner (if exists) */}
      {mockOrderStatus && (
        <div className="mx-4 mt-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mockOrderStatus.status === 'RECEIVED' && (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  {mockOrderStatus.status === 'COOKING' && (
                    <ChefHat className="h-5 w-5 text-orange-500" />
                  )}
                  {mockOrderStatus.status === 'READY' && (
                    <Bell className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Pesanan #{mockOrderStatus.id}</p>
                    <Badge className={cn('mt-1', getOrderStatusColor(mockOrderStatus.status))}>
                      {mockOrderStatus.status === 'RECEIVED' && 'Diterima'}
                      {mockOrderStatus.status === 'COOKING' && 'Sedang Dimasak'}
                      {mockOrderStatus.status === 'READY' && 'Siap Diambil'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={cn(
              'overflow-hidden cursor-pointer transition-all hover:shadow-md',
              !product.isAvailable && 'opacity-60 grayscale'
            )}
            onClick={() => product.isAvailable && handleProductClick(product)}
          >
            <div className="relative aspect-square">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageOff className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
              {!product.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Badge variant="destructive">Habis</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <p className="text-primary font-bold mt-1">
                {formatCurrency(product.price)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
          {selectedProduct && (
            <>
              <div className="relative aspect-video -mx-6 -mt-6 mb-4">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageOff className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground text-sm">
                {selectedProduct.description}
              </p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(selectedProduct.price)}
              </p>

              {/* Modifiers */}
              {selectedProduct.modifiers && selectedProduct.modifiers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Tambahan</h4>
                  <div className="space-y-2">
                    {selectedProduct.modifiers.map((mod) => (
                      <button
                        key={mod.id}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-lg border transition-all',
                          selectedModifiers.find((m) => m.id === mod.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => handleModifierToggle(mod)}
                      >
                        <span>{mod.name}</span>
                        <span className="text-primary font-medium">
                          +{formatCurrency(mod.priceChange)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Jumlah</span>
                <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                Tambah - {formatCurrency(calculateItemTotal())}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="w-full h-14 shadow-lg gap-3">
                <ShoppingBag className="h-5 w-5" />
                <span className="flex-1 text-left">
                  {itemCount} item • {formatCurrency(total)}
                </span>
                <span className="text-primary-foreground/80">Lihat</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Keranjang Anda</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 mt-4">
                <div className="space-y-3 pr-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-lg border"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.modifiers.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.modifiers.map((m) => m.name).join(', ')}
                          </p>
                        )}
                        <p className="text-primary font-semibold mt-1">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-base font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                >
                  Pesan Sekarang
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Order Progress Tracker */}
      <Sheet open={orderTrackerOpen} onOpenChange={setOrderTrackerOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Status Pesanan
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <OrderProgressTracker onCallWaiter={handleCallWaiter} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
