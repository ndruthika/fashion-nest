import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartContext } from "../context/CartContext";
import type { DemoProduct } from "../data/demoProducts";

interface DemoProductCardProps {
  product: DemoProduct;
  index?: number;
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Convert a product's string id to a stable bigint for CartItem.productId.
 * Uses a simple hash so that each product always gets a unique, consistent ID
 * regardless of its grid position (index).
 */
function productIdToBigInt(id: string): bigint {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return BigInt(hash);
}

export default function DemoProductCard({
  product,
  index = 0,
}: DemoProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addLocalItem } = useCartContext();

  const hasDiscount =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100,
      )
    : 0;

  const imageUrl = imgError ? "/assets/images/placeholder.svg" : product.image;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    // Use the product's own string id converted to a stable bigint — NOT the
    // grid index. This prevents multiple products at the same index from
    // sharing a productId and silently merging in the cart.
    addLocalItem({
      productId: productIdToBigInt(product.id),
      productName: product.name,
      productImage: product.image,
      // Store price in paise (×100) to match CartItem / PriceDisplay contract
      price: BigInt(product.price * 100),
      quantity: 1n,
      size: product.sizes[0] ?? "Free Size",
      color: product.colors[0] ?? "Default",
    });
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdding(false), 1200);
  }

  return (
    <div
      className="group relative flex flex-col bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth"
      data-ocid={`product.item.${index + 1}`}
    >
      {/* Image */}
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="block relative aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Sale badge */}
        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-rose-600 text-white border-0 text-xs font-bold tracking-wide shadow-md z-10">
            {discountPct}% OFF
          </Badge>
        )}

        {/* New arrival badge */}
        {!hasDiscount && product.isNewArrival && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 text-xs font-medium z-10">
            New
          </Badge>
        )}

        {/* Featured badge */}
        {product.isFeatured && !hasDiscount && !product.isNewArrival && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-xs font-medium z-10">
            Featured
          </Badge>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body truncate">
          {product.tags?.[0] ?? "Fashion Nest"}
        </p>
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="font-display text-sm font-medium text-foreground line-clamp-2 leading-snug hover:text-accent transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-xs text-muted-foreground font-body">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto flex-wrap">
          <span className="font-body text-sm font-semibold text-foreground">
            {formatINR(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          size="sm"
          className="mt-2 w-full text-xs gap-1.5 transition-smooth"
          onClick={handleAddToCart}
          disabled={adding}
          data-ocid={`product.add_to_cart.${index + 1}`}
        >
          {adding ? (
            "✓ Added!"
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
