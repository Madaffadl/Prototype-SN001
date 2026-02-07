'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  Clock,
  CalendarX2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import type { Ingredient, IngredientBatch } from '@/types';

// Helper functions
function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateInput(date: Date): string {
  return new Date(date).toISOString().split('T')[0];
}

function generateBatchNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `BTH-${dateStr}-${random}`;
}

// Generate mock inventory data with FIFO batches
const now = new Date();
const generateMockInventory = (): (Ingredient & { batches: IngredientBatch[] })[] => [
  {
    id: 'ing-1',
    name: 'Beras',
    unit: 'kg',
    stock: 50,
    lowStockThreshold: 20,
    costPerUnit: 15000,
    expiryAlertDays: 14,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b1-1', ingredientId: 'ing-1', batchNumber: 'BTH-20260115-001', initialQuantity: 30, remainingQty: 20, costPerUnit: 14500, arrivalDate: new Date('2026-01-15'), expiryDate: new Date('2026-06-15'), supplier: 'PT Beras Sejahtera', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
      { id: 'b1-2', ingredientId: 'ing-1', batchNumber: 'BTH-20260201-002', initialQuantity: 30, remainingQty: 30, costPerUnit: 15000, arrivalDate: new Date('2026-02-01'), expiryDate: new Date('2026-08-01'), supplier: 'PT Beras Sejahtera', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
  {
    id: 'ing-2',
    name: 'Daging Sapi',
    unit: 'kg',
    stock: 8,
    lowStockThreshold: 10,
    costPerUnit: 120000,
    expiryAlertDays: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b2-1', ingredientId: 'ing-2', batchNumber: 'BTH-20260205-001', initialQuantity: 5, remainingQty: 3, costPerUnit: 118000, arrivalDate: new Date('2026-02-05'), expiryDate: new Date('2026-02-10'), supplier: 'CV Daging Prima', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
      { id: 'b2-2', ingredientId: 'ing-2', batchNumber: 'BTH-20260207-002', initialQuantity: 5, remainingQty: 5, costPerUnit: 120000, arrivalDate: new Date('2026-02-07'), expiryDate: new Date('2026-02-14'), supplier: 'CV Daging Prima', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
  {
    id: 'ing-3',
    name: 'Ayam',
    unit: 'kg',
    stock: 25,
    lowStockThreshold: 15,
    costPerUnit: 35000,
    expiryAlertDays: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b3-1', ingredientId: 'ing-3', batchNumber: 'BTH-20260204-001', initialQuantity: 15, remainingQty: 10, costPerUnit: 34000, arrivalDate: new Date('2026-02-04'), expiryDate: new Date('2026-02-09'), supplier: 'UD Ayam Segar', notes: 'Hampir expired!', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
      { id: 'b3-2', ingredientId: 'ing-3', batchNumber: 'BTH-20260207-002', initialQuantity: 15, remainingQty: 15, costPerUnit: 35000, arrivalDate: new Date('2026-02-07'), expiryDate: new Date('2026-02-14'), supplier: 'UD Ayam Segar', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
  {
    id: 'ing-4',
    name: 'Telur',
    unit: 'pcs',
    stock: 80,
    lowStockThreshold: 100,
    costPerUnit: 2500,
    expiryAlertDays: 7,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b4-1', ingredientId: 'ing-4', batchNumber: 'BTH-20260201-001', initialQuantity: 100, remainingQty: 30, costPerUnit: 2400, arrivalDate: new Date('2026-02-01'), expiryDate: new Date('2026-02-15'), supplier: 'Peternakan Telur Makmur', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
      { id: 'b4-2', ingredientId: 'ing-4', batchNumber: 'BTH-20260206-002', initialQuantity: 50, remainingQty: 50, costPerUnit: 2500, arrivalDate: new Date('2026-02-06'), expiryDate: new Date('2026-02-20'), supplier: 'Peternakan Telur Makmur', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
  {
    id: 'ing-5',
    name: 'Susu Segar',
    unit: 'liter',
    stock: 20,
    lowStockThreshold: 15,
    costPerUnit: 18000,
    expiryAlertDays: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b5-1', ingredientId: 'ing-5', batchNumber: 'BTH-20260206-001', initialQuantity: 10, remainingQty: 5, costPerUnit: 17500, arrivalDate: new Date('2026-02-06'), expiryDate: new Date('2026-02-09'), supplier: 'Koperasi Susu', notes: 'URGENT: Segera gunakan!', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
      { id: 'b5-2', ingredientId: 'ing-5', batchNumber: 'BTH-20260207-002', initialQuantity: 15, remainingQty: 15, costPerUnit: 18000, arrivalDate: new Date('2026-02-07'), expiryDate: new Date('2026-02-14'), supplier: 'Koperasi Susu', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
  {
    id: 'ing-6',
    name: 'Gula Aren',
    unit: 'kg',
    stock: 5,
    lowStockThreshold: 5,
    costPerUnit: 35000,
    expiryAlertDays: 30,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    batches: [
      { id: 'b6-1', ingredientId: 'ing-6', batchNumber: 'BTH-20260110-001', initialQuantity: 5, remainingQty: 5, costPerUnit: 35000, arrivalDate: new Date('2026-01-10'), expiryDate: new Date('2026-07-10'), supplier: 'CV Gula Nusantara', isExpired: false, isFullyUsed: false, createdAt: now, updatedAt: now },
    ],
  },
];

// Form types
interface IngredientFormData {
  name: string;
  unit: string;
  lowStockThreshold: string;
  costPerUnit: string;
  expiryAlertDays: string;
}

interface BatchFormData {
  ingredientId: string;
  quantity: string;
  costPerUnit: string;
  expiryDate: string;
  supplier: string;
  notes: string;
}

const defaultIngredientForm: IngredientFormData = {
  name: '',
  unit: 'kg',
  lowStockThreshold: '',
  costPerUnit: '',
  expiryAlertDays: '7',
};

const defaultBatchForm: BatchFormData = {
  ingredientId: '',
  quantity: '',
  costPerUnit: '',
  expiryDate: '',
  supplier: '',
  notes: '',
};

const unitOptions = ['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'botol', 'kaleng'];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(generateMockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [isEditingIngredient, setIsEditingIngredient] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<(Ingredient & { batches: IngredientBatch[] }) | null>(null);
  const [ingredientForm, setIngredientForm] = useState<IngredientFormData>(defaultIngredientForm);
  const [batchForm, setBatchForm] = useState<BatchFormData>(defaultBatchForm);

  // Toggle expanded state
  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  // Calculate expiring batches for an ingredient
  const getExpiringBatches = (item: Ingredient & { batches: IngredientBatch[] }) => {
    return item.batches.filter(batch => {
      const daysUntil = getDaysUntilExpiry(batch.expiryDate);
      return daysUntil <= item.expiryAlertDays && daysUntil >= 0 && !batch.isFullyUsed;
    });
  };

  // Calculate expired batches
  const getExpiredBatches = (item: Ingredient & { batches: IngredientBatch[] }) => {
    return item.batches.filter(batch => {
      const daysUntil = getDaysUntilExpiry(batch.expiryDate);
      return daysUntil < 0 && !batch.isFullyUsed;
    });
  };

  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = showLowStock ? item.stock <= item.lowStockThreshold : true;
    const matchesExpiring = showExpiringOnly ? getExpiringBatches(item).length > 0 || getExpiredBatches(item).length > 0 : true;
    return matchesSearch && matchesLowStock && matchesExpiring;
  });

  // Stats
  const lowStockCount = inventory.filter(item => item.stock <= item.lowStockThreshold).length;
  const expiringCount = inventory.reduce((sum, item) => sum + getExpiringBatches(item).length, 0);
  const expiredCount = inventory.reduce((sum, item) => sum + getExpiredBatches(item).length, 0);

  // Open Add Ingredient dialog
  const handleOpenAddIngredient = () => {
    setIngredientForm(defaultIngredientForm);
    setIsEditingIngredient(false);
    setSelectedItem(null);
    setIngredientDialogOpen(true);
  };

  // Open Edit Ingredient dialog
  const handleOpenEditIngredient = (item: Ingredient & { batches: IngredientBatch[] }) => {
    setIngredientForm({
      name: item.name,
      unit: item.unit,
      lowStockThreshold: String(item.lowStockThreshold),
      costPerUnit: String(item.costPerUnit),
      expiryAlertDays: String(item.expiryAlertDays),
    });
    setSelectedItem(item);
    setIsEditingIngredient(true);
    setIngredientDialogOpen(true);
  };

  // Open Add Batch dialog
  const handleOpenAddBatch = (item?: Ingredient & { batches: IngredientBatch[] }) => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    
    setBatchForm({
      ingredientId: item?.id || '',
      quantity: '',
      costPerUnit: item?.costPerUnit ? String(item.costPerUnit) : '',
      expiryDate: formatDateInput(futureDate),
      supplier: '',
      notes: '',
    });
    setSelectedItem(item || null);
    setBatchDialogOpen(true);
  };

  // Submit Ingredient form
  const handleSubmitIngredient = () => {
    if (!ingredientForm.name.trim() || !ingredientForm.costPerUnit || !ingredientForm.lowStockThreshold) {
      return;
    }

    const newIngredient: Ingredient & { batches: IngredientBatch[] } = {
      id: isEditingIngredient && selectedItem ? selectedItem.id : `ing-${Date.now()}`,
      name: ingredientForm.name.trim(),
      unit: ingredientForm.unit,
      stock: isEditingIngredient && selectedItem ? selectedItem.stock : 0,
      lowStockThreshold: Number(ingredientForm.lowStockThreshold),
      costPerUnit: Number(ingredientForm.costPerUnit),
      expiryAlertDays: Number(ingredientForm.expiryAlertDays) || 7,
      isActive: true,
      createdAt: isEditingIngredient && selectedItem ? selectedItem.createdAt : new Date(),
      updatedAt: new Date(),
      batches: isEditingIngredient && selectedItem ? selectedItem.batches : [],
    };

    if (isEditingIngredient && selectedItem) {
      setInventory(prev => prev.map(i => i.id === selectedItem.id ? newIngredient : i));
    } else {
      setInventory(prev => [...prev, newIngredient]);
    }

    setIngredientDialogOpen(false);
    setIngredientForm(defaultIngredientForm);
    setSelectedItem(null);
  };

  // Submit Batch form
  const handleSubmitBatch = () => {
    if (!batchForm.ingredientId || !batchForm.quantity || !batchForm.costPerUnit || !batchForm.expiryDate) {
      return;
    }

    const newBatch: IngredientBatch = {
      id: `batch-${Date.now()}`,
      ingredientId: batchForm.ingredientId,
      batchNumber: generateBatchNumber(),
      initialQuantity: Number(batchForm.quantity),
      remainingQty: Number(batchForm.quantity),
      costPerUnit: Number(batchForm.costPerUnit),
      arrivalDate: new Date(),
      expiryDate: new Date(batchForm.expiryDate),
      supplier: batchForm.supplier.trim() || undefined,
      notes: batchForm.notes.trim() || undefined,
      isExpired: false,
      isFullyUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setInventory(prev => prev.map(item => {
      if (item.id === batchForm.ingredientId) {
        const newStock = item.stock + Number(batchForm.quantity);
        return {
          ...item,
          stock: newStock,
          batches: [...item.batches, newBatch],
          updatedAt: new Date(),
        };
      }
      return item;
    }));

    setBatchDialogOpen(false);
    setBatchForm(defaultBatchForm);
    
    // Expand the ingredient to show new batch
    setExpandedItems(prev => new Set([...prev, batchForm.ingredientId]));
  };

  const handleDelete = () => {
    if (selectedItem) {
      setInventory(prev => prev.filter(i => i.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const getStockStatus = (item: Ingredient) => {
    if (item.stock === 0) return 'empty';
    if (item.stock <= item.lowStockThreshold) return 'low';
    return 'ok';
  };

  const getBatchExpiryStatus = (batch: IngredientBatch, expiryAlertDays: number) => {
    const daysUntil = getDaysUntilExpiry(batch.expiryDate);
    if (daysUntil < 0) return 'expired';
    if (daysUntil <= expiryAlertDays) return 'expiring';
    return 'ok';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Inventori (FIFO)</h2>
          <p className="text-muted-foreground">
            Pantau stok dengan sistem First In, First Out dan expiry date
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleOpenAddIngredient}>
            <Plus className="h-4 w-4" />
            Tambah Bahan
          </Button>
          <Button className="gap-2" onClick={() => handleOpenAddBatch()}>
            <Plus className="h-4 w-4" />
            Tambah Batch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Item</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stok Menipis</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(expiringCount > 0 && 'ring-2 ring-orange-500')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hampir Expired</p>
              <p className="text-2xl font-bold text-orange-600">{expiringCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(expiredCount > 0 && 'ring-2 ring-red-500')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
              <CalendarX2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sudah Expired</p>
              <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari bahan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showLowStock ? 'default' : 'outline'}
              onClick={() => setShowLowStock(!showLowStock)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Stok Menipis ({lowStockCount})
            </Button>
            <Button
              variant={showExpiringOnly ? 'default' : 'outline'}
              onClick={() => setShowExpiringOnly(!showExpiringOnly)}
              className={cn('gap-2', showExpiringOnly && 'bg-orange-600 hover:bg-orange-700')}
            >
              <Clock className="h-4 w-4" />
              Hampir/Sudah Expired ({expiringCount + expiredCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table with Collapsible Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Bahan ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nama Bahan</TableHead>
                <TableHead className="text-center">Total Stok</TableHead>
                <TableHead className="text-center">Batch</TableHead>
                <TableHead className="text-center">Status Stok</TableHead>
                <TableHead className="text-center">Expiry Alert</TableHead>
                <TableHead className="text-right">Nilai Total</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                const expiringBatches = getExpiringBatches(item);
                const expiredBatches = getExpiredBatches(item);
                const isExpanded = expandedItems.has(item.id);
                const activeBatches = item.batches.filter(b => !b.isFullyUsed).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

                return (
                  <React.Fragment key={item.id}>
                    <TableRow className={cn(
                      'cursor-pointer hover:bg-muted/50',
                      (expiringBatches.length > 0 || expiredBatches.length > 0) && 'bg-orange-50 dark:bg-orange-950/20'
                    )}>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpanded(item.id)}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn('font-semibold', status === 'empty' && 'text-red-600', status === 'low' && 'text-yellow-600')}>
                          {formatNumber(item.stock)}
                        </span>
                        <span className="text-muted-foreground ml-1">{item.unit}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{activeBatches.length} batch</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          status === 'ok' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                          status === 'low' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                          status === 'empty' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        )}>
                          {status === 'ok' && 'Aman'}
                          {status === 'low' && 'Menipis'}
                          {status === 'empty' && 'Habis'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {expiredBatches.length > 0 ? (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 gap-1">
                            <CalendarX2 className="h-3 w-3" />
                            {expiredBatches.length} Expired
                          </Badge>
                        ) : expiringBatches.length > 0 ? (
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 gap-1">
                            <Clock className="h-3 w-3" />
                            {expiringBatches.length} Hampir
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Aman</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.stock * item.costPerUnit)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenAddBatch(item)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Tambah Batch
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditIngredient(item)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Bahan
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedItem(item); setDeleteDialogOpen(true); }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 space-y-2">
                            <p className="text-sm font-medium text-muted-foreground mb-3">
                              📦 Batch Details (FIFO - Gunakan batch teratas terlebih dahulu)
                            </p>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>No. Batch</TableHead>
                                  <TableHead>Sisa Qty</TableHead>
                                  <TableHead>Tgl Masuk</TableHead>
                                  <TableHead>Tgl Expired</TableHead>
                                  <TableHead>Supplier</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Harga/Unit</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeBatches.map((batch, idx) => {
                                  const expiryStatus = getBatchExpiryStatus(batch, item.expiryAlertDays);
                                  const daysUntil = getDaysUntilExpiry(batch.expiryDate);
                                  return (
                                    <TableRow key={batch.id} className={cn(
                                      idx === 0 && 'bg-primary/5 font-medium',
                                      expiryStatus === 'expired' && 'bg-red-100 dark:bg-red-950',
                                      expiryStatus === 'expiring' && 'bg-orange-100 dark:bg-orange-950'
                                    )}>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          {idx === 0 && (
                                            <Badge className="bg-primary text-primary-foreground text-xs">FIFO</Badge>
                                          )}
                                          {batch.batchNumber}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {formatNumber(batch.remainingQty)} / {formatNumber(batch.initialQuantity)} {item.unit}
                                      </TableCell>
                                      <TableCell>{formatDate(batch.arrivalDate)}</TableCell>
                                      <TableCell className={cn(
                                        expiryStatus === 'expired' && 'text-red-600 font-bold',
                                        expiryStatus === 'expiring' && 'text-orange-600 font-bold'
                                      )}>
                                        {formatDate(batch.expiryDate)}
                                        {expiryStatus === 'expired' && ' (EXPIRED)'}
                                        {expiryStatus === 'expiring' && ` (${daysUntil} hari)`}
                                      </TableCell>
                                      <TableCell>{batch.supplier || '-'}</TableCell>
                                      <TableCell>
                                        <Badge className={cn(
                                          expiryStatus === 'ok' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                                          expiryStatus === 'expiring' && 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                                          expiryStatus === 'expired' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        )}>
                                          {expiryStatus === 'ok' && 'Aman'}
                                          {expiryStatus === 'expiring' && 'Hampir Expired'}
                                          {expiryStatus === 'expired' && 'EXPIRED'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">{formatCurrency(batch.costPerUnit)}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada bahan ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Ingredient Dialog */}
      <Dialog open={ingredientDialogOpen} onOpenChange={setIngredientDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditingIngredient ? 'Edit Bahan' : 'Tambah Bahan Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditingIngredient ? 'Ubah informasi bahan' : 'Isi informasi bahan baru'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ing-name">Nama Bahan *</Label>
              <Input
                id="ing-name"
                placeholder="Contoh: Daging Sapi"
                value={ingredientForm.name}
                onChange={(e) => setIngredientForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ing-unit">Satuan *</Label>
                <Select
                  value={ingredientForm.unit}
                  onValueChange={(value) => setIngredientForm(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger id="ing-unit">
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ing-threshold">Batas Stok Minimum *</Label>
                <Input
                  id="ing-threshold"
                  type="number"
                  placeholder="10"
                  value={ingredientForm.lowStockThreshold}
                  onChange={(e) => setIngredientForm(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ing-cost">Harga per Satuan (Rp) *</Label>
                <Input
                  id="ing-cost"
                  type="number"
                  placeholder="50000"
                  value={ingredientForm.costPerUnit}
                  onChange={(e) => setIngredientForm(prev => ({ ...prev, costPerUnit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ing-alert">Alert Expiry (hari)</Label>
                <Input
                  id="ing-alert"
                  type="number"
                  placeholder="7"
                  value={ingredientForm.expiryAlertDays}
                  onChange={(e) => setIngredientForm(prev => ({ ...prev, expiryAlertDays: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIngredientDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmitIngredient}
              disabled={!ingredientForm.name.trim() || !ingredientForm.costPerUnit || !ingredientForm.lowStockThreshold}
            >
              {isEditingIngredient ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Batch Dialog */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Batch Baru</DialogTitle>
            <DialogDescription>
              Masukkan stok baru untuk bahan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch-ingredient">Bahan *</Label>
              <Select
                value={batchForm.ingredientId}
                onValueChange={(value) => {
                  const ing = inventory.find(i => i.id === value);
                  setBatchForm(prev => ({ 
                    ...prev, 
                    ingredientId: value,
                    costPerUnit: ing ? String(ing.costPerUnit) : prev.costPerUnit,
                  }));
                }}
              >
                <SelectTrigger id="batch-ingredient">
                  <SelectValue placeholder="Pilih bahan" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-qty">Jumlah *</Label>
                <Input
                  id="batch-qty"
                  type="number"
                  placeholder="10"
                  value={batchForm.quantity}
                  onChange={(e) => setBatchForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-cost">Harga/Unit (Rp) *</Label>
                <Input
                  id="batch-cost"
                  type="number"
                  placeholder="50000"
                  value={batchForm.costPerUnit}
                  onChange={(e) => setBatchForm(prev => ({ ...prev, costPerUnit: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-expiry">Tanggal Expired *</Label>
              <Input
                id="batch-expiry"
                type="date"
                value={batchForm.expiryDate}
                onChange={(e) => setBatchForm(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-supplier">Supplier</Label>
              <Input
                id="batch-supplier"
                placeholder="Nama supplier"
                value={batchForm.supplier}
                onChange={(e) => setBatchForm(prev => ({ ...prev, supplier: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-notes">Catatan</Label>
              <Textarea
                id="batch-notes"
                placeholder="Catatan tambahan..."
                value={batchForm.notes}
                onChange={(e) => setBatchForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmitBatch}
              disabled={!batchForm.ingredientId || !batchForm.quantity || !batchForm.costPerUnit || !batchForm.expiryDate}
            >
              Tambah Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Bahan</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus <span className="font-medium text-foreground">{selectedItem?.name}</span>?
            Semua batch terkait juga akan dihapus.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
