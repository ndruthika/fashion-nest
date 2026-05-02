import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem } from "../types";

const CART_STORAGE_KEY = "fashionNest_cart";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    // Deserialise bigint fields that were serialised as strings
    return parsed.map((item) => ({
      productId: BigInt(String(item.productId)),
      productName: String(item.productName),
      productImage: String(item.productImage ?? ""),
      price: BigInt(String(item.price)),
      quantity: BigInt(String(item.quantity)),
      size: String(item.size),
      color: String(item.color),
    }));
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    const serialisable = items.map((item) => ({
      productId: item.productId.toString(),
      productName: item.productName,
      productImage: item.productImage,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      size: item.size,
      color: item.color,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serialisable));
  } catch {
    // Silently fail on storage errors
  }
}

interface CartContextType {
  localCart: CartItem[];
  cartCount: number;
  addLocalItem: (item: CartItem) => void;
  removeLocalItem: (productId: bigint, size: string, color: string) => void;
  updateLocalItem: (
    productId: bigint,
    size: string,
    color: string,
    quantity: bigint,
  ) => void;
  clearLocalCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [localCart, setLocalCart] = useState<CartItem[]>(loadCartFromStorage);

  // Persist on every change
  useEffect(() => {
    saveCartToStorage(localCart);
  }, [localCart]);

  const addLocalItem = useCallback((item: CartItem) => {
    setLocalCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeLocalItem = useCallback(
    (productId: bigint, size: string, color: string) => {
      setLocalCart((prev) =>
        prev.filter(
          (i) =>
            !(
              i.productId === productId &&
              i.size === size &&
              i.color === color
            ),
        ),
      );
    },
    [],
  );

  const updateLocalItem = useCallback(
    (productId: bigint, size: string, color: string, quantity: bigint) => {
      if (quantity <= 0n) {
        setLocalCart((prev) =>
          prev.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === size &&
                i.color === color
              ),
          ),
        );
        return;
      }
      setLocalCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const clearLocalCart = useCallback(() => {
    setLocalCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const cartCount = localCart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        localCart,
        cartCount,
        addLocalItem,
        removeLocalItem,
        updateLocalItem,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
}
