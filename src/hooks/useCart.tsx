import { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  labTestId: string;
  testName: string;
  labName: string;
  labCity: string;
  price: number;
  turnaroundHours: number | null;
  homeCollection: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (labTestId: string) => void;
  clearCart: () => void;
  isInCart: (labTestId: string) => boolean;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.labTestId === item.labTestId)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (labTestId: string) => {
    setItems((prev) => prev.filter((i) => i.labTestId !== labTestId));
  };

  const clearCart = () => setItems([]);

  const isInCart = (labTestId: string) => items.some((i) => i.labTestId === labTestId);

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, totalPrice, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
