import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import PriceDisplay from "../components/PriceDisplay";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

type AnyActor = Record<string, (...args: unknown[]) => Promise<unknown>>;

function QuickAddModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const sizes = product.sizes.length > 0 ? product.sizes : ["One Size"];
  const colors = product.colors.length > 0 ? product.colors : ["Default"];

  const handleAdd = async () => {
    const size = selectedSize || sizes[0];
    const color = selectedColor || colors[0];
    setIsAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1n, size, color });
      toast.success(`${product.name} added to cart`);
      onClose();
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="wishlist.quick_add_dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-6">
            Quick Add to Cart
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Product preview */}
          <div className="flex gap-3">
            <div className="w-14 h-16 flex-shrink-0 rounded bg-muted overflow-hidden">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-medium text-foreground text-sm line-clamp-2">
                {product.name}
              </p>
              <PriceDisplay price={product.price} size="sm" className="mt-1" />
            </div>
          </div>

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs rounded border transition-smooth ${
                      (selectedSize || sizes[0]) === s
                        ? "border-accent bg-accent/10 text-accent font-medium"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                    data-ocid={`wishlist.size_option.${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selection */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-xs rounded border transition-smooth ${
                      (selectedColor || colors[0]) === c
                        ? "border-accent bg-accent/10 text-accent font-medium"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                    data-ocid={`wishlist.color_option.${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-primary text-primary-foreground gap-2"
              onClick={handleAdd}
              disabled={isAdding}
              data-ocid="wishlist.confirm_add_button"
            >
              {isAdding ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="wishlist.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WishlistProductCard({
  product,
  index,
  onWishlistToggle,
  onQuickAdd,
}: {
  product: Product;
  index: number;
  onWishlistToggle: (id: bigint) => void;
  onQuickAdd: (product: Product) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imageUrl =
    !imgError && product.images.length > 0
      ? product.images[0]
      : "/assets/images/placeholder.svg";
  const hoverImageUrl =
    product.images.length > 1 ? product.images[1] : imageUrl;

  return (
    <div
      className="group relative flex flex-col bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-smooth"
      data-ocid={`wishlist.product_item.${index + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link
        to="/products/$id"
        params={{ id: product.id.toString() }}
        className="block relative aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={hovered && product.images.length > 1 ? hoverImageUrl : imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </Link>

      {/* Remove from wishlist */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card text-accent"
        onClick={() => onWishlistToggle(product.id)}
        aria-label="Remove from wishlist"
        data-ocid={`wishlist.remove_button.${index + 1}`}
      >
        <Heart className="h-4 w-4 fill-accent" />
      </Button>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4 pb-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground truncate">
          {product.tags[0] ?? "Fashion Nest"}
        </p>
        <Link to="/products/$id" params={{ id: product.id.toString() }}>
          <h3 className="font-display text-sm font-medium text-foreground line-clamp-2 leading-snug hover:text-accent transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
          className="mt-1"
        />
      </div>

      {/* Quick add */}
      <div className="px-4 pb-4">
        <Button
          className="w-full bg-primary text-primary-foreground text-xs h-8 gap-1.5 transition-smooth"
          onClick={() => onQuickAdd(product)}
          data-ocid={`wishlist.quick_add_button.${index + 1}`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { isAuthenticated, login } = useAuth();
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  const wishlistQuery = useQuery<bigint[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return [];
      try {
        return (
          ((await (actor as unknown as AnyActor).getWishlist()) as bigint[]) ??
          []
        );
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: allProducts, isLoading: productsLoading } = useProducts();

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) return;
      const isIn = wishlistQuery.data?.some((id) => id === productId);
      if (isIn) {
        await (actor as unknown as AnyActor).removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await (actor as unknown as AnyActor).addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="wishlist.page"
      >
        <div className="text-center max-w-sm px-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-3xl font-medium mb-2">
            Save Your Favorites
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in to view and manage your wishlist of curated pieces.
          </p>
          <Button
            className="bg-primary text-primary-foreground w-full"
            onClick={login}
            data-ocid="wishlist.login_button"
          >
            Sign In to View Wishlist
          </Button>
        </div>
      </div>
    );
  }

  const wishlistedProducts = (allProducts ?? []).filter((p) =>
    wishlistQuery.data?.some((id) => id === p.id),
  );

  const isLoading = wishlistQuery.isLoading || productsLoading;

  return (
    <div className="bg-background min-h-screen" data-ocid="wishlist.page">
      {/* Header */}
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Your
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground">
              Wishlist
            </h1>
          </div>
          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {wishlistedProducts.length} saved item
                {wishlistedProducts.length !== 1 ? "s" : ""}
              </p>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-foreground text-sm"
                  data-ocid="wishlist.browse_more_link"
                >
                  Browse more
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <LoadingSpinner
            className="py-32"
            data-ocid="wishlist.loading_state"
          />
        ) : wishlistedProducts.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7" />}
            title="Your wishlist is empty"
            description="Heart items while browsing to save them here. Build your dream wardrobe."
            action={{
              label: "Browse Collection",
              onClick: () => {
                window.location.href = "/products";
              },
            }}
            data-ocid="wishlist.empty_state"
          />
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            data-ocid="wishlist.product_grid"
          >
            {wishlistedProducts.map((product, i) => (
              <WishlistProductCard
                key={product.id.toString()}
                product={product}
                index={i}
                onWishlistToggle={(id) => toggleWishlistMutation.mutate(id)}
                onQuickAdd={(p) => setQuickAddProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      <QuickAddModal
        product={quickAddProduct}
        open={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </div>
  );
}
