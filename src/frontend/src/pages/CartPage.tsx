import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import EmptyState from "../components/EmptyState";
import PriceDisplay from "../components/PriceDisplay";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../types";

const FREE_SHIPPING_THRESHOLD = 420000; // ₹4,200 in paise
const SHIPPING_COST = 125000; // ₹1,250 in paise
const TAX_RATE = 0.18; // Indian GST 18%

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card rounded-lg border border-border p-4 flex gap-4"
          >
            <Skeleton className="w-20 h-24 rounded flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32 mt-3" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, isLoading, removeFromCart, updateCartItem } = useCart();
  const { localCart, removeLocalItem, updateLocalItem } = useCartContext();
  const { isAuthenticated } = useAuth();
  const [, startTransition] = useTransition();

  // In demo/unauthenticated mode, always use localCart directly.
  // Do NOT wait for the backend cart query — it will always be empty for
  // unauthenticated users and its loading state would mask the local cart.
  const rawItems = isAuthenticated ? cartItems : localCart;

  // Optimistic items for instant UI updates
  const [optimisticItems, updateOptimistic] = useOptimistic<
    CartItem[],
    | { productId: bigint; size: string; color: string; quantity: number }
    | { productId: bigint; size: string; color: string; remove: true }
  >(rawItems, (state, action) => {
    if ("remove" in action) {
      return state.filter(
        (i) =>
          !(
            i.productId === action.productId &&
            i.size === action.size &&
            i.color === action.color
          ),
      );
    }
    if (action.quantity <= 0) {
      return state.filter(
        (i) =>
          !(
            i.productId === action.productId &&
            i.size === action.size &&
            i.color === action.color
          ),
      );
    }
    return state.map((i) =>
      i.productId === action.productId &&
      i.size === action.size &&
      i.color === action.color
        ? { ...i, quantity: BigInt(action.quantity) }
        : i,
    );
  });

  const subtotal = optimisticItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const handleRemove = (productId: bigint, size: string, color: string) => {
    startTransition(async () => {
      updateOptimistic({ productId, size, color, remove: true });
      try {
        if (isAuthenticated) await removeFromCart({ productId, size, color });
        else removeLocalItem(productId, size, color);
      } catch {
        toast.error("Failed to remove item");
      }
    });
  };

  const handleQuantity = (
    productId: bigint,
    size: string,
    color: string,
    delta: number,
    currentQty: bigint,
  ) => {
    const newQty = Number(currentQty) + delta;
    startTransition(async () => {
      updateOptimistic({ productId, size, color, quantity: newQty });
      try {
        if (newQty < 1) {
          if (isAuthenticated) await removeFromCart({ productId, size, color });
          else removeLocalItem(productId, size, color);
        } else {
          if (isAuthenticated)
            await updateCartItem({
              productId,
              quantity: BigInt(newQty),
              size,
              color,
            });
          else updateLocalItem(productId, size, color, BigInt(newQty));
        }
      } catch {
        toast.error("Failed to update quantity");
      }
    });
  };

  // Show skeleton only when authenticated and backend cart is loading.
  // In demo (unauthenticated) mode, localCart is always immediately available.
  if (isAuthenticated && isLoading) {
    return (
      <div className="bg-background min-h-screen" data-ocid="cart.page">
        <div className="bg-card border-b border-border py-10">
          <div className="container mx-auto px-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Your
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground">
              Shopping Cart
            </h1>
          </div>
        </div>
        <div
          className="container mx-auto px-4 py-10"
          data-ocid="cart.loading_state"
        >
          <CartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen" data-ocid="cart.page">
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Your
          </p>
          <h1 className="font-display text-4xl font-medium text-foreground">
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {optimisticItems.length === 0 ? (
          <div data-ocid="cart.empty_state">
            <EmptyState
              icon={<ShoppingBag className="h-7 w-7" />}
              title="Your cart is empty"
              description="Discover curated pieces from today's most sought-after designers."
              action={{
                label: "Start Shopping",
                onClick: () => {
                  window.location.href = "/products";
                },
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items list */}
            <div
              className="lg:col-span-2 space-y-4"
              data-ocid="cart.items_list"
            >
              {optimisticItems.map((item, i) => (
                <div
                  key={`${String(item.productId)}-${item.size}-${item.color}`}
                  className="bg-card rounded-lg border border-border p-4 flex gap-4 transition-smooth"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display font-medium text-foreground truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() =>
                          handleRemove(item.productId, item.size, item.color)
                        }
                        aria-label="Remove item"
                        data-ocid={`cart.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-md overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted"
                          onClick={() =>
                            handleQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              -1,
                              item.quantity,
                            )
                          }
                          aria-label="Decrease quantity"
                          data-ocid={`cart.qty_decrease.${i + 1}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-body border-x border-border py-1">
                          {item.quantity.toString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted"
                          onClick={() =>
                            handleQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              1,
                              item.quantity,
                            )
                          }
                          aria-label="Increase quantity"
                          data-ocid={`cart.qty_increase.${i + 1}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <PriceDisplay
                        price={Number(item.price) * Number(item.quantity)}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-card rounded-lg border border-border p-6 sticky top-24"
                data-ocid="cart.summary_panel"
              >
                <h2 className="font-display text-xl font-medium text-foreground mb-5">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Subtotal (
                      {optimisticItems.reduce(
                        (s, i) => s + Number(i.quantity),
                        0,
                      )}{" "}
                      items)
                    </span>
                    <PriceDisplay price={subtotal} size="sm" />
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-accent font-medium">Free</span>
                    ) : (
                      <PriceDisplay price={shipping} size="sm" />
                    )}
                  </div>
                  {shipping > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5">
                      Add{" "}
                      <PriceDisplay
                        price={FREE_SHIPPING_THRESHOLD - subtotal}
                        size="sm"
                      />{" "}
                      more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <PriceDisplay price={tax} size="sm" />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-foreground text-base pt-1">
                    <span>Total</span>
                    <PriceDisplay price={total} size="md" />
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-body"
                  size="lg"
                  disabled={optimisticItems.length === 0}
                  asChild
                  data-ocid="cart.checkout_button"
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground font-body text-sm"
                  asChild
                >
                  <Link
                    to="/products"
                    data-ocid="cart.continue_shopping_button"
                  >
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
