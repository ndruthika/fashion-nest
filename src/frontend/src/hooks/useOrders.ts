import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderStatus } from "../types";
import { useBackendActor } from "./useBackendActor";

type AnyActor = Record<string, (...args: unknown[]) => Promise<unknown>>;

export function useMyOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (
          ((await (actor as unknown as AnyActor).getMyOrders()) as Order[]) ??
          []
        );
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrder(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order | null>({
    queryKey: ["order", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return (
          ((await (actor as unknown as AnyActor).getOrder(
            id,
          )) as Order | null) ?? null
        );
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["all-orders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (
          ((await (actor as unknown as AnyActor).getAllOrders()) as Order[]) ??
          []
        );
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      shippingAddressId?: string;
      stripeSessionId?: string;
      shippingAddress?: {
        fullName: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    }) => {
      if (!actor) throw new Error("Not connected");
      const input = {
        stripeSessionId: orderData.stripeSessionId
          ? [orderData.stripeSessionId]
          : [],
        shippingAddress: orderData.shippingAddress ?? {
          fullName: "",
          street: orderData.shippingAddressId ?? "",
          city: "",
          state: "",
          postalCode: "",
          country: "IN",
        },
      };
      return (await (actor as unknown as AnyActor).createOrder(input)) as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as unknown as AnyActor).updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
}
