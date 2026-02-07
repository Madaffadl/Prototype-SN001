'use client';

import { useState } from 'react';
import {
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import type { PaymentMethod } from '@/types';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (method: PaymentMethod, receivedAmount?: number) => void;
}

type PaymentStep = 'method' | 'cash' | 'qris' | 'card' | 'success';

const paymentMethods = [
  {
    id: 'CASH' as PaymentMethod,
    name: 'Tunai',
    icon: Banknote,
    description: 'Pembayaran dengan uang tunai',
  },
  {
    id: 'QRIS' as PaymentMethod,
    name: 'QRIS',
    icon: QrCode,
    description: 'Scan QR Code untuk bayar',
  },
  {
    id: 'CARD' as PaymentMethod,
    name: 'Kartu',
    icon: CreditCard,
    description: 'Debit / Credit Card',
  },
];

const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

export function PaymentModal({
  open,
  onOpenChange,
  onComplete,
}: PaymentModalProps) {
  const { total, clearCart } = useCartStore();
  const [step, setStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const changeAmount = Math.max(0, Number(receivedAmount) - total);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method === 'CASH') {
      setStep('cash');
    } else if (method === 'QRIS') {
      setStep('qris');
    } else {
      setStep('card');
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setStep('success');

    // Wait a bit then complete
    setTimeout(() => {
      onComplete?.(selectedMethod, Number(receivedAmount) || undefined);
      clearCart();
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('method');
    setSelectedMethod(null);
    setReceivedAmount('');
    setIsProcessing(false);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('method');
    setSelectedMethod(null);
    setReceivedAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== 'method' && step !== 'success' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {step === 'method' && 'Pilih Metode Pembayaran'}
              {step === 'cash' && 'Pembayaran Tunai'}
              {step === 'qris' && 'Pembayaran QRIS'}
              {step === 'card' && 'Pembayaran Kartu'}
              {step === 'success' && 'Pembayaran Berhasil'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Total Display */}
        {step !== 'success' && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Pembayaran</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
          </div>
        )}

        {/* Method Selection */}
        {step === 'method' && (
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant="outline"
                className="h-auto p-4 justify-start touch-target"
                onClick={() => handleMethodSelect(method.id)}
              >
                <method.icon className="h-6 w-6 mr-4 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{method.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        )}

        {/* Cash Payment */}
        {step === 'cash' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Jumlah Diterima
              </label>
              <Input
                type="number"
                placeholder="0"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="text-2xl font-bold h-14 text-center mt-1"
                autoFocus
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="touch-target"
                  onClick={() => setReceivedAmount(String(amount))}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full touch-target"
              onClick={() => setReceivedAmount(String(total))}
            >
              Uang Pas
            </Button>

            {Number(receivedAmount) >= total && (
              <>
                <Separator />
                <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Kembalian</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(changeAmount)}
                  </p>
                </div>
              </>
            )}

            <Button
              className="w-full touch-target"
              size="lg"
              disabled={Number(receivedAmount) < total || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        )}

        {/* QRIS Payment */}
        {step === 'qris' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan QR code di atas menggunakan aplikasi e-wallet Anda
            </p>
            <Button
              className="w-full touch-target"
              size="lg"
              disabled={isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        )}

        {/* Card Payment */}
        {step === 'card' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center">
              <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                <CreditCard className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Tap atau masukkan kartu pada mesin EDC
            </p>
            <Button
              className="w-full touch-target"
              size="lg"
              disabled={isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold">Pembayaran Berhasil!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Transaksi telah selesai
              </p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
