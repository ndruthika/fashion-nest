import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCartContext } from "../context/CartContext";
import type { Cart, CartItem } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useCart() {
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();
  const {
    cartCount,
    addLocalItem,
    removeLocalItem,
    updateLocalItem,
    clearLocalCart,
  } = useCartContext();

  const cartQuery = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return { items: [], totalItems: 0n, totalPrice: 0n };
      try {
        const result = (await (
          actor as unknown as Record<string, () => Promise<unknown>>
        ).getCart()) as Cart;
        return result ?? { items: [], totalItems: 0n, totalPrice: 0n };
      } catch {
        return { items: [], totalItems: 0n, totalPrice: 0n };
      }
    },
    enabled: !!actor && !isFetching,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: {
      productId: bigint;
      quantity: bigint;
      size: string;
      color: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).addToCart(item.productId, item.quantity, item.size, item.color);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async (item: {
      productId: bigint;
      quantity: bigint;
      size: string;
      color: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).updateCartItem(item.productId, item.quantity, item.size, item.color);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (item: {
      productId: bigint;
      size: string;
      color: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).removeFromCart(item.productId, item.size, item.color);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<string, () => Promise<unknown>>
      ).clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      clearLocalCart();
    },
  });

  const cartItems: CartItem[] = cartQuery.data?.items ?? [];
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  return {
    cart: cartQuery.data,
    cartItems,
    totalItems: totalItems || cartCount,
    totalPrice,
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutateAsync,
    updateCartItem: updateCartItemMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,
    addLocalItem,
    removeLocalItem,
    updateLocalItem,
  };
}
