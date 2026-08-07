import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  variant: string;
  price: number;
  quantity: number;
  sku: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getProductDiscount: (productId: string) => { discount: number; savings: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              item.variant === newItem.variant
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId &&
                item.variant === newItem.variant
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
          };
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, variant, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotal: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Bundle discount based on total order quantity across all products
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        let discount = 0;
        if (totalQty >= 10) discount = 0.20;
        else if (totalQty >= 6) discount = 0.15;
        else if (totalQty >= 3) discount = 0.10;

        return subtotal * (1 - discount);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getProductDiscount: (productId) => {
        const items = get().items;

        // Bundle discount based on total order quantity across all products
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        let discount = 0;
        if (totalQty >= 10) discount = 0.20;
        else if (totalQty >= 6) discount = 0.15;
        else if (totalQty >= 3) discount = 0.10;

        // Calculate savings for this product at the order-level discount rate
        const productItems = items.filter((item) => item.productId === productId);
        const subtotal = productItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const savings = subtotal * discount;

        return { discount, savings };
      },
    }),
    {
      name: "lumo-cart-storage",
    }
  )
);
