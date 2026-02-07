import Link from 'next/link';
import { 
  Store, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  QrCode,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'POS Terminal',
    description: 'Interface kasir dengan grid produk dan pembayaran multi-metode',
    icon: ShoppingCart,
    href: '/pos',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'QR Menu',
    description: 'Menu pelanggan dengan pemesanan mandiri via QR Code',
    icon: QrCode,
    href: '/menu/1',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Dashboard Admin',
    description: 'Analitik penjualan, manajemen menu & inventori',
    icon: BarChart3,
    href: '/dashboard',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Manajemen Menu',
    description: 'Kelola produk, kategori, dan harga menu',
    icon: Users,
    href: '/dashboard/menu',
    color: 'bg-orange-500/10 text-orange-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Store className="h-10 w-10" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Smart POS{' '}
            <span className="text-primary">Ecosystem</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solusi Point of Sale modern yang mengintegrasikan kasir, pelanggan, 
            dan manajemen dalam satu platform yang seamless.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="gap-2">
              <Link href="/pos">
                <ShoppingCart className="h-5 w-5" />
                Buka POS Terminal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link href="/menu/1">
                <QrCode className="h-5 w-5" />
                Simulasi QR Menu
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Buka
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Dibangun dengan teknologi modern</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">Next.js 14</span>
            <span className="px-3 py-1 bg-muted rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-muted rounded-full">Tailwind CSS</span>
            <span className="px-3 py-1 bg-muted rounded-full">Shadcn UI</span>
            <span className="px-3 py-1 bg-muted rounded-full">Zustand</span>
            <span className="px-3 py-1 bg-muted rounded-full">Prisma</span>
          </div>
        </div>
      </div>
    </div>
  );
}
