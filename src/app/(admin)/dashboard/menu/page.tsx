'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ImageOff,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, cn } from '@/lib/utils';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product, ProductModifier } from '@/types';

// Form state type
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  image: string;
  modifiers: ProductModifier[];
}

const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  isAvailable: true,
  image: '',
  modifiers: [],
};

export default function MenuManagementPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  
  // Modifier form
  const [newModifierName, setNewModifierName] = useState('');
  const [newModifierPrice, setNewModifierPrice] = useState('');

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddDialog = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
      image: product.image || '',
      modifiers: product.modifiers || [],
    });
    setSelectedProduct(product);
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  const handleAddModifier = () => {
    if (!newModifierName.trim() || !newModifierPrice.trim()) return;
    
    const newModifier: ProductModifier = {
      id: `mod-${Date.now()}`,
      productId: selectedProduct?.id || 'new',
      name: newModifierName.trim(),
      priceChange: Number(newModifierPrice),
      isDefault: false,
    };
    
    setFormData(prev => ({
      ...prev,
      modifiers: [...prev.modifiers, newModifier],
    }));
    
    setNewModifierName('');
    setNewModifierPrice('');
  };

  const handleRemoveModifier = (modifierId: string) => {
    setFormData(prev => ({
      ...prev,
      modifiers: prev.modifiers.filter(m => m.id !== modifierId),
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim() || !formData.price || !formData.categoryId) {
      return;
    }

    const productData: Product = {
      id: isEditing && selectedProduct ? selectedProduct.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: Number(formData.price),
      categoryId: formData.categoryId,
      isAvailable: formData.isAvailable,
      image: formData.image.trim() || undefined,
      modifiers: formData.modifiers.length > 0 ? formData.modifiers : undefined,
      sortOrder: isEditing && selectedProduct ? selectedProduct.sortOrder : products.length,
      createdAt: isEditing && selectedProduct ? selectedProduct.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (isEditing && selectedProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? productData : p));
    } else {
      // Add new product
      setProducts(prev => [...prev, productData]);
    }

    setFormDialogOpen(false);
    setFormData(defaultFormData);
    setSelectedProduct(null);
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Menu</h2>
          <p className="text-muted-foreground">
            Kelola produk dan kategori menu
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Semua
              </Button>
              {mockCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      )}
                      {product.modifiers && product.modifiers.length > 0 && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.modifiers.length} modifier
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.isAvailable ? 'default' : 'secondary'}
                      className={cn(
                        product.isAvailable
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : ''
                      )}
                    >
                      {product.isAvailable ? 'Tersedia' : 'Habis'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(product)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada produk ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Ubah informasi produk' : 'Isi informasi produk baru'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat produk..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="25000"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">URL Gambar</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="available">Tersedia</Label>
                <p className="text-xs text-muted-foreground">
                  Produk dapat dipesan pelanggan
                </p>
              </div>
              <Switch
                id="available"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
              />
            </div>

            {/* Modifiers Section */}
            <div className="space-y-3">
              <Label>Modifier / Tambahan</Label>
              
              {/* Existing Modifiers */}
              {formData.modifiers.length > 0 && (
                <div className="space-y-2">
                  {formData.modifiers.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                      <div>
                        <span className="font-medium text-sm">{mod.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          +{formatCurrency(mod.priceChange)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveModifier(mod.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Modifier Form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nama modifier"
                  value={newModifierName}
                  onChange={(e) => setNewModifierName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Harga"
                  value={newModifierPrice}
                  onChange={(e) => setNewModifierPrice(e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddModifier}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Contoh: Extra Cheese (+5000), Level Pedas (+0)
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.price || !formData.categoryId}
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus{' '}
            <span className="font-medium text-foreground">
              {selectedProduct?.name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
