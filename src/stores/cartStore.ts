import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartModifier, Product, ProductModifier } from '@/types';

interface CartState {
  items: CartItem[];
  tableNumber: number | null;
  isHeld: boolean;
  
  // Computed values
  subtotal: number;
  tax: number;
  discount: number;
  discountPercent: number;
  total: number;
  itemCount: number;
  
  // Actions
  addItem: (product: Product, quantity?: number, modifiers?: ProductModifier[], notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: number | null) => void;
  setDiscount: (percent: number) => void;
  holdOrder: () => void;
  unholdOrder: () => void;
  
  // Helpers
  calculateTotals: () => void;
}

const TAX_RATE = 0.11; // 11% tax

const generateCartItemId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,
      isHeld: false,
      subtotal: 0,
      tax: 0,
      discount: 0,
      discountPercent: 0,
      total: 0,
      itemCount: 0,

      addItem: (product, quantity = 1, modifiers = [], notes = '') => {
        const state = get();
        
        // Calculate modifier price adjustment
        const modifierTotal = modifiers.reduce((sum, mod) => sum + mod.priceChange, 0);
        const itemPrice = product.price + modifierTotal;
        
        // Convert ProductModifier to CartModifier
        const cartModifiers: CartModifier[] = modifiers.map(mod => ({
          id: mod.id,
          name: mod.name,
          priceChange: mod.priceChange,
        }));
        
        // Check if same product with same modifiers exists
        const modifierKey = JSON.stringify(cartModifiers.sort((a, b) => a.id.localeCompare(b.id)));
        const existingItemIndex = state.items.findIndex(item => {
          const existingModifierKey = JSON.stringify(item.modifiers.sort((a, b) => a.id.localeCompare(b.id)));
          return item.productId === product.id && existingModifierKey === modifierKey && item.notes === notes;
        });
        
        let newItems: CartItem[];
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          newItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: generateCartItemId(),
            productId: product.id,
            name: product.name,
            price: itemPrice,
            image: product.image,
            quantity,
            modifiers: cartModifiers,
            notes,
          };
          newItems = [...state.items, newItem];
        }
        
        set({ items: newItems });
        get().calculateTotals();
      },

      removeItem: (cartItemId) => {
        const newItems = get().items.filter(item => item.id !== cartItemId);
        set({ items: newItems });
        get().calculateTotals();
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        
        const newItems = get().items.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        get().calculateTotals();
      },

      updateNotes: (cartItemId, notes) => {
        const newItems = get().items.map(item =>
          item.id === cartItemId ? { ...item, notes } : item
        );
        set({ items: newItems });
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          tax: 0,
          discount: 0,
          discountPercent: 0,
          total: 0,
          itemCount: 0,
          isHeld: false,
        });
      },

      setTableNumber: (tableNumber) => {
        set({ tableNumber });
      },

      setDiscount: (percent) => {
        set({ discountPercent: Math.min(100, Math.max(0, percent)) });
        get().calculateTotals();
      },

      holdOrder: () => {
        set({ isHeld: true });
      },

      unholdOrder: () => {
        set({ isHeld: false });
      },

      calculateTotals: () => {
        const state = get();
        
        const subtotal = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        
        const discount = (subtotal * state.discountPercent) / 100;
        const taxableAmount = subtotal - discount;
        const tax = taxableAmount * TAX_RATE;
        const total = taxableAmount + tax;
        
        const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({
          subtotal,
          tax,
          discount,
          total,
          itemCount,
        });
      },
    }),
    {
      name: 'pos-cart-storage',
      partialize: (state) => ({
        items: state.items,
        tableNumber: state.tableNumber,
        discountPercent: state.discountPercent,
        isHeld: state.isHeld,
      }),
    }
  )
);
