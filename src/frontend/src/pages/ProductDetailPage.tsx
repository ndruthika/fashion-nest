import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "@tanstack/react-router";
import {
  ChevronRight,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DemoProductCard from "../components/DemoProductCard";
import { useCartContext } from "../context/CartContext";
import {
  ALL_DEMO_PRODUCTS,
  type DemoProduct,
  getDemoProductById,
} from "../data/demoProducts";

// ─── Color swatch map ─────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  Black: "#1a1a1a",
  White: "#f5f5f5",
  Ivory: "#fffff0",
  Cream: "#fffdd0",
  Beige: "#c8ad7f",
  Camel: "#c19a6b",
  Navy: "#1b2a4a",
  Blue: "#2d5fa0",
  Green: "#4a7c59",
  Sage: "#9cac9a",
  Emerald: "#1a6348",
  Red: "#c0392b",
  Burgundy: "#6d0b1a",
  Maroon: "#800000",
  Pink: "#e8a0b0",
  Blush: "#f5c6cb",
  Rose: "#c0576a",
  Lilac: "#c8b0d0",
  Purple: "#7b4e8e",
  Grey: "#9e9e9e",
  Gray: "#9e9e9e",
  Charcoal: "#3a3a3a",
  Gold: "#c9a84c",
  Copper: "#b87333",
  Silver: "#c0c0c0",
  Rust: "#b7490e",
  Orange: "#e07040",
  Yellow: "#e0c050",
  Mustard: "#c09020",
  Teal: "#1a8080",
  Coral: "#e07060",
  Indigo: "#3c3c8a",
  Ochre: "#c9a227",
  Peach: "#ffb07c",
  Lavender: "#9d84b7",
  Mint: "#98d0c0",
  "Royal Blue": "#2b52be",
  "Forest Green": "#228b22",
  "Deep Red": "#8b0000",
  "Sky Blue": "#87ceeb",
  "Off-White": "#f8f8f0",
  Champagne: "#f7e7ce",
  Multicolor: "linear-gradient(135deg, #f00, #0f0, #00f)",
};

function swatchColor(name: string): string {
  return COLOR_MAP[name] ?? "#cccccc";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        aria-expanded={open}
      >
        <span className="text-xs uppercase tracking-widest font-body font-medium text-foreground">
          {title}
        </span>
        <span
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-foreground leading-relaxed font-body">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Quantity selector ────────────────────────────────────────────────────────
function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div
      className="inline-flex items-center border border-border rounded-lg overflow-hidden"
      data-ocid="product.quantity_selector"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors duration-150"
        data-ocid="product.quantity_minus"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="h-10 w-12 border-x border-border bg-background text-center text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Quantity"
        data-ocid="product.quantity_input"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors duration-150"
        data-ocid="product.quantity_plus"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────
function RelatedProducts({ products }: { products: DemoProduct[] }) {
  return (
    <section
      className="mt-20 border-t border-border pt-16"
      data-ocid="product.related_section"
    >
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">
            You might also like
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Related Pieces
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-accent hover:underline font-body"
          data-ocid="product.related_view_all"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        data-ocid="product.related_list"
      >
        {products.map((p, i) => (
          <DemoProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { addLocalItem } = useCartContext();

  // Find product from demo data by ID (string like "na-1", "w-1", etc.)
  const product = getDemoProductById(id);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Related products: same category, excluding current
  const relatedProducts = ALL_DEMO_PRODUCTS.filter(
    (p) => product && p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const hasDiscount =
    product?.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product!.compareAtPrice! - product!.price) /
          product!.compareAtPrice!) *
          100,
      )
    : 0;

  const canAddToCart = !!selectedSize && !!selectedColor;
  const imageUrl = imgError
    ? "/assets/images/placeholder.svg"
    : (product?.image ?? "/assets/images/placeholder.svg");

  function handleAddToCart() {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color");
      return;
    }
    setIsAdding(true);
    addLocalItem({
      productId: BigInt(
        Math.abs(id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)),
      ),
      productName: product.name,
      productImage: product.image,
      price: BigInt(product.price * 100),
      quantity: BigInt(quantity),
      size: selectedSize,
      color: selectedColor,
    });
    setAddedFeedback(true);
    toast.success("Added to cart!");
    setTimeout(() => {
      setAddedFeedback(false);
      setIsAdding(false);
    }, 1500);
  }

  if (!product) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32 gap-4"
        data-ocid="product.error_state"
      >
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-display text-foreground">
          Product not found
        </p>
        <Button asChild variant="outline">
          <Link to="/products" data-ocid="product.back_link">
            Browse all products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-28 lg:pb-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-body"
        data-ocid="product.breadcrumb"
      >
        <Link
          to="/"
          className="hover:text-foreground transition-colors duration-150"
          data-ocid="product.breadcrumb_home"
        >
          Home
        </Link>
        <ChevronRight className="h-3 w-3 flex-shrink-0" />
        <Link
          to="/products"
          className="hover:text-foreground transition-colors duration-150 capitalize"
          data-ocid="product.breadcrumb_category"
        >
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight className="h-3 w-3 flex-shrink-0" />
        <span className="truncate max-w-[200px] text-foreground">
          {product.name}
        </span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── Gallery ── */}
        <div className="flex flex-col gap-3" data-ocid="product.gallery">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted shadow-card">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-smooth"
              onError={() => setImgError(true)}
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-rose-600 text-white border-0 text-xs font-bold px-3 py-1">
                {discountPct}% OFF
              </Badge>
            )}
            {product.isNewArrival && !hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 text-xs font-medium px-3 py-1">
                New Arrival
              </Badge>
            )}
          </div>
        </div>

        {/* ── Product info ── */}
        <div
          className="flex flex-col gap-5 lg:py-2"
          data-ocid="product.info_panel"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            {product.tags?.[0] ?? "Fashion Nest"}
          </p>

          <h1 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {(["1", "2", "3", "4", "5"] as const).map((n, i) => (
                <Star
                  key={`star-${n}`}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-body">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-body text-3xl font-semibold text-foreground">
              {formatINR(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through font-body">
                  {formatINR(product.compareAtPrice!)}
                </span>
                <Badge
                  className="bg-rose-600 text-white border-0 text-xs font-bold"
                  data-ocid="product.stock_badge"
                >
                  {discountPct}% OFF
                </Badge>
              </>
            )}
            {!hasDiscount && (
              <Badge
                variant="outline"
                className="text-xs font-medium border-primary/30 bg-primary/10 text-primary"
                data-ocid="product.stock_badge"
              >
                In Stock
              </Badge>
            )}
          </div>

          <Separator />

          {/* Color */}
          {product.colors.length > 0 && (
            <div
              className="flex flex-col gap-2.5"
              data-ocid="product.color_selector"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-body font-medium text-foreground">
                  Color
                </span>
                {selectedColor && (
                  <span className="text-xs text-muted-foreground">
                    — {selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    title={color}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-8 w-8 rounded-full border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      selectedColor === color
                        ? "border-accent shadow-md scale-110"
                        : "border-border hover:scale-105 hover:shadow-sm"
                    }`}
                    style={{ backgroundColor: swatchColor(color) }}
                    data-ocid={`product.color_swatch.${color.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {selectedColor === color && (
                      <span
                        className="absolute inset-0 rounded-full ring-2 ring-accent ring-offset-1"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div
              className="flex flex-col gap-2.5"
              data-ocid="product.size_selector"
            >
              <span className="text-xs uppercase tracking-widest font-body font-medium text-foreground">
                Size
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-[2.75rem] rounded-md border px-3 text-sm font-body font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground shadow-sm"
                        : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/5"
                    }`}
                    data-ocid={`product.size_button.${size.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest font-body font-medium text-foreground">
              Quantity
            </span>
            <QuantitySelector
              value={quantity}
              max={10}
              onChange={setQuantity}
            />
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-1" data-ocid="product.cta_group">
            <Button
              className="h-12 flex-1 rounded-lg text-sm font-medium gap-2 transition-smooth"
              disabled={!canAddToCart || isAdding}
              onClick={handleAddToCart}
              data-ocid="product.add_to_cart_button"
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  Adding…
                </span>
              ) : addedFeedback ? (
                <span
                  className="flex items-center gap-2"
                  data-ocid="product.success_state"
                >
                  ✓ Added to cart
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </span>
              )}
            </Button>
          </div>

          {/* Validation hint */}
          {!canAddToCart && (
            <p
              className="text-xs text-muted-foreground font-body"
              data-ocid="product.field_error"
            >
              {!selectedColor && !selectedSize
                ? "Select a color and size to add to cart"
                : !selectedColor
                  ? "Select a color to continue"
                  : "Select a size to continue"}
            </p>
          )}

          {/* Trust badges */}
          <div className="mt-1 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/40 p-4">
            {[
              {
                Icon: Truck,
                label: "Free Shipping",
                sub: "Orders over ₹5,000",
              },
              { Icon: RefreshCw, label: "Free Returns", sub: "Within 30 days" },
              { Icon: ShieldCheck, label: "Secure Pay", sub: "SSL encrypted" },
            ].map(({ Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <Icon className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium font-body text-foreground">
                  {label}
                </span>
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div
            className="mt-2 overflow-hidden rounded-xl border border-border bg-card"
            data-ocid="product.details_accordion"
          >
            <AccordionItem title="Description" defaultOpen>
              <p className="leading-relaxed">{product.description}</p>
            </AccordionItem>
            <AccordionItem title="Material & Composition">
              <ul className="list-inside list-disc space-y-1">
                <li>Premium quality fabric, sustainably sourced</li>
                <li>Traditional Indian craftsmanship</li>
                <li>Dry clean recommended for silk and embroidered items</li>
                <li>Gentle hand wash for cotton and georgette</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="Delivery & Returns">
              <p className="mb-2">
                Standard delivery 3–5 business days. Express 1–2 days available
                at checkout.
              </p>
              <p>
                Free returns within 30 days. Items must be in original condition
                with tags attached.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}
