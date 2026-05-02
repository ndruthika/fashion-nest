import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../backend";
import type { Category, Product, ProductFilters } from "../types";
import { useBackendActor } from "./useBackendActor";

/** Map the frontend ProductFilters shape to the backend's ProductFilter shape */
function toBackendFilter(filters?: ProductFilters): ProductFilter {
  return {
    categoryId: filters?.categoryId ?? undefined,
    inStockOnly: false,
    color: filters?.colors?.[0] ?? undefined,
    size: filters?.sizes?.[0] ?? undefined,
    minPriceInCents: filters?.minPrice ?? undefined,
    maxPriceInCents: filters?.maxPrice ?? undefined,
    searchQuery: filters?.search ?? undefined,
  };
}

export function useCategories() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getCategories();
      return result as unknown as Category[];
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(filters?: ProductFilters) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      if (!actor) return [];
      const backendFilter = toBackendFilter(filters);
      const result = await actor.searchProducts(backendFilter);
      return result as unknown as Product[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      const result = await actor.getProduct(id);
      return result as unknown as Product | null;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getFeaturedProducts();
      return result as unknown as Product[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNewArrivals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getNewArrivals();
      return result as unknown as Product[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminCategories() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, "id" | "createdAt">) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCategory(
        category.name,
        category.slug,
        category.description,
        category.parentId ?? null,
      ) as unknown as Category;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteCategory(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return {
    addCategory: addCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isAdding: addCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}

export function useAdminProducts() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    // Accept a broad record so existing callers (AdminProductsPage) don't break at compile time.
    // The actor.createProduct call receives the object as-is; runtime shape mismatches are
    // a separate concern from the method-name fix.
    mutationFn: async (product: Record<string, unknown>) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct(
        product as unknown as CreateProductInput,
      ) as unknown as Product;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Record<string, unknown>) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(product as unknown as UpdateProductInput);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteProduct(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  return {
    addProduct: addProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isAdding: addProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}
