interface PriceDisplayProps {
  price: bigint | number;
  compareAtPrice?: bigint | number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg font-medium",
  xl: "text-2xl font-semibold",
};

function formatPrice(price: bigint | number): string {
  const paise = typeof price === "bigint" ? Number(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

export default function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className = "",
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && Number(compareAtPrice) > Number(price);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${sizes[size]} text-foreground font-body`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
      {hasDiscount && (
        <span className="text-xs font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-sm">
          Sale
        </span>
      )}
    </span>
  );
}
