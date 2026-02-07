'use client';

import { useState } from 'react';
import {
  Store,
  Sun,
  Moon,
  Bell,
  Receipt,
  Printer,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsData {
  // Store Info
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  // Receipt
  receiptHeader: string;
  receiptFooter: string;
  showLogo: boolean;
  // Notifications
  lowStockAlert: boolean;
  expiryAlert: boolean;
  orderNotification: boolean;
  // System
  darkMode: boolean;
  language: string;
  currency: string;
  taxRate: string;
  autoLogout: string;
}

const defaultSettings: SettingsData = {
  storeName: 'Smart POS Restaurant',
  storeAddress: 'Jl. Contoh No. 123, Jakarta Selatan',
  storePhone: '021-12345678',
  storeEmail: 'info@smartpos.com',
  receiptHeader: 'Terima kasih telah berkunjung!',
  receiptFooter: 'Kritik & saran: wa.me/6281234567890',
  showLogo: true,
  lowStockAlert: true,
  expiryAlert: true,
  orderNotification: true,
  darkMode: false,
  language: 'id',
  currency: 'IDR',
  taxRate: '11',
  autoLogout: '30',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pengaturan</h2>
          <p className="text-muted-foreground">
            Konfigurasi toko dan sistem POS
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : 'Simpan'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Informasi Toko
            </CardTitle>
            <CardDescription>
              Detail toko yang akan ditampilkan di struk dan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => updateSetting('storeName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Alamat</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => updateSetting('storeAddress', e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Telepon</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => updateSetting('storePhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => updateSetting('storeEmail', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Pengaturan Struk
            </CardTitle>
            <CardDescription>
              Kustomisasi tampilan struk pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiptHeader">Header Struk</Label>
              <Input
                id="receiptHeader"
                value={settings.receiptHeader}
                onChange={(e) => updateSetting('receiptHeader', e.target.value)}
                placeholder="Pesan di bagian atas struk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptFooter">Footer Struk</Label>
              <Input
                id="receiptFooter"
                value={settings.receiptFooter}
                onChange={(e) => updateSetting('receiptFooter', e.target.value)}
                placeholder="Pesan di bagian bawah struk"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="showLogo">Tampilkan Logo</Label>
                <p className="text-xs text-muted-foreground">
                  Cetak logo toko di struk
                </p>
              </div>
              <Switch
                id="showLogo"
                checked={settings.showLogo}
                onCheckedChange={(checked) => updateSetting('showLogo', checked)}
              />
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Printer className="h-4 w-4" />
              Test Print Struk
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifikasi
            </CardTitle>
            <CardDescription>
              Atur notifikasi dan peringatan sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="lowStockAlert">Alert Stok Menipis</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi saat stok di bawah minimum
                </p>
              </div>
              <Switch
                id="lowStockAlert"
                checked={settings.lowStockAlert}
                onCheckedChange={(checked) => updateSetting('lowStockAlert', checked)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="expiryAlert">Alert Expired</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi saat bahan hampir expired
                </p>
              </div>
              <Switch
                id="expiryAlert"
                checked={settings.expiryAlert}
                onCheckedChange={(checked) => updateSetting('expiryAlert', checked)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="orderNotification">Notifikasi Pesanan</Label>
                <p className="text-xs text-muted-foreground">
                  Suara notifikasi untuk pesanan baru
                </p>
              </div>
              <Switch
                id="orderNotification"
                checked={settings.orderNotification}
                onCheckedChange={(checked) => updateSetting('orderNotification', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              Sistem
            </CardTitle>
            <CardDescription>
              Pengaturan umum sistem POS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Bahasa</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting('language', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Mata Uang</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => updateSetting('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tarif Pajak (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => updateSetting('taxRate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoLogout">Auto Logout (menit)</Label>
                <Input
                  id="autoLogout"
                  type="number"
                  value={settings.autoLogout}
                  onChange={(e) => updateSetting('autoLogout', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="darkMode">Mode Gelap</Label>
                <p className="text-xs text-muted-foreground">
                  Gunakan tema gelap untuk tampilan
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
