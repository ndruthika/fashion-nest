import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "../types";
import PriceDisplay from "./PriceDisplay";

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: bigint) => void;
  isWishlisted?: boolean;
  index?: number;
}

export default function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted = false,
  index = 0,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl =
    !imgError && product.images.length > 0
      ? product.images[0]
      : "/assets/images/placeholder.svg";
  const hoverImageUrl =
    product.images.length > 1 ? product.images[1] : imageUrl;

  // A sale exists when compareAtPrice is set and is GREATER than current price
  const compareAtNum =
    product.compareAtPrice != null ? Number(product.compareAtPrice) : null;
  const priceNum = Number(product.price ?? 0n);
  const hasDiscount = compareAtNum !== null && compareAtNum > priceNum;
  const discountPct = hasDiscount
    ? Math.round(((compareAtNum! - priceNum) / compareAtNum!) * 100)
    : 0;

  // Derive "new arrival" from tags or isNewArrival field (backend may return either)
  const isNewArrival =
    (product as unknown as { isNewArrival?: boolean }).isNewArrival === true ||
    (product.tags ?? []).some((t) => t.toLowerCase() === "new arrival");

  return (
    <div
      className="group relative flex flex-col bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-smooth"
      data-ocid={`product.item.${index + 1}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link
        to="/products/$id"
        params={{ id: product.id.toString() }}
        className="block relative aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={
            isHovered && product.images.length > 1 ? hoverImageUrl : imageUrl
          }
          alt={product.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Sale discount badge — top-left, prominent red/rose */}
        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-rose-600 text-white border-0 text-xs font-bold tracking-wide shadow-md">
            {discountPct}% OFF
          </Badge>
        )}

        {/* New arrival badge — only when no sale */}
        {!hasDiscount && isNewArrival && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 text-xs font-medium">
            New
          </Badge>
        )}

        {/* Featured badge — only when no sale and no new arrival */}
        {product.isFeatured && !hasDiscount && !isNewArrival && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-0 text-xs font-medium">
            Featured
          </Badge>
        )}
      </Link>

      {/* Wishlist */}
      {onWishlistToggle && (
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-smooth ${isWishlisted ? "text-accent" : "text-muted-foreground"}`}
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle(product.id);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          data-ocid={`product.wishlist_toggle.${index + 1}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-accent" : ""}`} />
        </Button>
      )}

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-body truncate">
          {(product.tags ?? [])[0] ?? "Fashion Nest"}
        </p>
        <Link to="/products/$id" params={{ id: product.id.toString() }}>
          <h3 className="font-display text-base font-medium text-foreground line-clamp-2 leading-snug hover:text-accent transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Price row: current price + crossed-out original when on sale */}
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <PriceDisplay
            price={product.price ?? 0n}
            compareAtPrice={
              product.compareAtPrice != null
                ? product.compareAtPrice
                : undefined
            }
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
