'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

export function useKeyboardShortcuts({ 
  enabled = true, 
  shortcuts 
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        // For Escape key, always allow even in inputs
        const isEscape = shortcut.key.toLowerCase() === 'escape';
        
        // For function keys (F1-F12), allow even in inputs
        const isFunctionKey = /^f\d{1,2}$/i.test(shortcut.key);

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          if (isInput && !isEscape && !isFunctionKey) continue;
          
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [enabled, shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}

// POS-specific shortcuts preset
export function usePOSKeyboardShortcuts({
  onCheckout,
  onClearCart,
  onToggleCart,
  onCategorySelect,
  onFocusSearch,
  enabled = true,
}: {
  onCheckout?: () => void;
  onClearCart?: () => void;
  onToggleCart?: () => void;
  onCategorySelect?: (index: number) => void;
  onFocusSearch?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    // Checkout
    {
      key: 'Enter',
      ctrl: true,
      action: () => onCheckout?.(),
      description: 'Bayar (Ctrl+Enter)',
    },
    // Clear cart
    {
      key: 'Delete',
      ctrl: true,
      action: () => onClearCart?.(),
      description: 'Kosongkan Keranjang (Ctrl+Delete)',
    },
    // Toggle cart on mobile
    {
      key: 'k',
      ctrl: true,
      action: () => onToggleCart?.(),
      description: 'Toggle Keranjang (Ctrl+K)',
    },
    // Focus search
    {
      key: '/',
      action: () => onFocusSearch?.(),
      description: 'Cari Produk (/)',
    },
    // Escape to close modals
    {
      key: 'Escape',
      action: () => {
        // Handled by radix dialog
      },
      description: 'Tutup Modal (Esc)',
    },
    // Category shortcuts F1-F8
    ...Array.from({ length: 8 }, (_, i) => ({
      key: `F${i + 1}`,
      action: () => onCategorySelect?.(i),
      description: `Kategori ${i + 1} (F${i + 1})`,
    })),
  ];

  return useKeyboardShortcuts({ enabled, shortcuts });
}
