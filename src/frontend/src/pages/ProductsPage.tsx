import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Link, useSearch } from "@tanstack/react-router";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DemoProductCard from "../components/DemoProductCard";
import EmptyState from "../components/EmptyState";
import {
  ALL_DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  type DemoProduct,
  getDemoProductsByCategory,
} from "../data/demoProducts";

// ─── Constants ───────────────────────────────────────────────────────────────

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COLORS = [
  { name: "Red", hex: "#c0392b" },
  { name: "Blue", hex: "#2d5fa0" },
  { name: "Green", hex: "#4a7c59" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Pink", hex: "#e8a0b0" },
  { name: "Gold", hex: "#c9a84c" },
  { name: "Maroon", hex: "#6d0b1a" },
];

type SortOption = "newest" | "price_asc" | "price_desc" | "name" | "featured";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  name: "Name A–Z",
  featured: "Featured",
};

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterPanelProps {
  selectedCategory: string | undefined;
  selectedSizes: string[];
  selectedColors: string[];
  minPrice: string;
  maxPrice: string;
  onSaleOnly: boolean;
  onCategoryChange: (slug: string | undefined) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onOnSaleChange: (val: boolean) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

function FilterPanel({
  selectedCategory,
  selectedSizes,
  selectedColors,
  minPrice,
  maxPrice,
  onSaleOnly,
  onCategoryChange,
  onSizeToggle,
  onColorToggle,
  onMinPriceChange,
  onMaxPriceChange,
  onOnSaleChange,
  onClearAll,
  activeFilterCount,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6" data-ocid="products.filter_panel">
      <div className="flex items-center justify-between">
        <span className="font-display text-base font-medium text-foreground">
          Filters
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-accent hover:text-accent/80 transition-colors duration-200 flex items-center gap-1"
            data-ocid="products.clear_filters_button"
          >
            <X className="h-3 w-3" /> Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
          Category
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onCategoryChange(undefined)}
            className={`text-left px-2 py-1.5 rounded text-sm transition-colors duration-200 ${!selectedCategory ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            data-ocid="products.category_filter.all"
          >
            All Categories
          </button>
          {DEMO_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`text-left px-2 py-1.5 rounded text-sm transition-colors duration-200 ${selectedCategory === cat.slug ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
              data-ocid={`products.category_filter.${cat.slug}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => onSizeToggle(size)}
              className={`min-w-[2.75rem] h-9 px-2 text-sm rounded border transition-smooth ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
              data-ocid={`products.size_filter.${size.toLowerCase().replace(" ", "_")}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
          Color
        </p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => onColorToggle(color.name)}
              title={color.name}
              className={`relative h-7 w-7 rounded-full border-2 transition-smooth ${
                selectedColors.includes(color.name)
                  ? "border-primary ring-2 ring-primary ring-offset-1"
                  : "border-border hover:border-foreground/40"
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
              aria-pressed={selectedColors.includes(color.name)}
              data-ocid={`products.color_filter.${color.name.toLowerCase()}`}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
          Price Range (₹)
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full pl-6 pr-2 py-2 text-sm rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="products.min_price_input"
            />
          </div>
          <span className="text-muted-foreground text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full pl-6 pr-2 py-2 text-sm rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="products.max_price_input"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label
          htmlFor="on-sale-toggle"
          className="text-sm text-foreground cursor-pointer flex items-center gap-2"
        >
          On Sale
          <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 uppercase tracking-wide">
            SALE
          </span>
        </Label>
        <Switch
          id="on-sale-toggle"
          checked={onSaleOnly}
          onCheckedChange={onOnSaleChange}
          data-ocid="products.on_sale_toggle"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const rawSearch = useSearch({ strict: false }) as Record<string, string>;
  const initialCategory = rawSearch.category ?? undefined;

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategory,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get products from demo data — always instant, no backend needed
  const baseProducts = useMemo<DemoProduct[]>(() => {
    if (selectedCategory) return getDemoProductsByCategory(selectedCategory);
    return ALL_DEMO_PRODUCTS;
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...baseProducts];
    if (selectedSizes.length > 0)
      list = list.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length > 0)
      list = list.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c)),
      );
    if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
    if (onSaleOnly)
      list = list.filter(
        (p) => p.compareAtPrice !== undefined && p.compareAtPrice > p.price,
      );

    return list.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "featured")
        return (a.isFeatured ? 0 : 1) - (b.isFeatured ? 0 : 1);
      return 0;
    });
  }, [
    baseProducts,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    onSaleOnly,
    sort,
  ]);

  const activeFilterCount = useMemo(
    () =>
      (selectedCategory ? 1 : 0) +
      selectedSizes.length +
      selectedColors.length +
      (minPrice ? 1 : 0) +
      (maxPrice ? 1 : 0) +
      (onSaleOnly ? 1 : 0),
    [
      selectedCategory,
      selectedSizes,
      selectedColors,
      minPrice,
      maxPrice,
      onSaleOnly,
    ],
  );

  const selectedCategoryName = DEMO_CATEGORIES.find(
    (c) => c.slug === selectedCategory,
  )?.name;

  const handleSizeToggle = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const handleColorToggle = useCallback((color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCategory(undefined);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setOnSaleOnly(false);
  }, []);

  const filterPanelProps: FilterPanelProps = {
    selectedCategory,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    onSaleOnly,
    onCategoryChange: setSelectedCategory,
    onSizeToggle: handleSizeToggle,
    onColorToggle: handleColorToggle,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onOnSaleChange: setOnSaleOnly,
    onClearAll: handleClearAll,
    activeFilterCount,
  };

  return (
    <div className="min-h-screen bg-background" data-ocid="products.page">
      {/* Page banner */}
      <div className="bg-card border-b border-border py-8 md:py-10">
        <div className="container mx-auto px-4">
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2"
            aria-label="Breadcrumb"
            data-ocid="products.breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors duration-200"
              data-ocid="products.breadcrumb_home"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            {selectedCategoryName ? (
              <>
                <Link
                  to="/products"
                  className="hover:text-foreground transition-colors duration-200"
                  data-ocid="products.breadcrumb_products"
                >
                  Products
                </Link>
                <ChevronRight className="h-3 w-3 flex-shrink-0" />
                <span className="text-foreground font-medium">
                  {selectedCategoryName}
                </span>
              </>
            ) : (
              <span className="text-foreground font-medium">Products</span>
            )}
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
            {selectedCategoryName ?? "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredProducts.length === 1
              ? "Showing 1 product"
              : `Showing ${filteredProducts.length} products`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category tab pills */}
        <div
          className="flex gap-2 flex-wrap mb-6"
          data-ocid="products.category_tabs"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-smooth border ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card"
            }`}
            data-ocid="products.category_tab.all"
          >
            All
          </button>
          {DEMO_CATEGORIES.map((cat) => {
            const isSale = cat.slug === "sale";
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-body transition-smooth border flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? isSale
                      ? "bg-rose-600 text-white border-rose-600 font-medium"
                      : "bg-primary text-primary-foreground border-primary font-medium"
                    : isSale
                      ? "border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 bg-card"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card"
                }`}
                data-ocid={`products.category_tab.${cat.slug}`}
              >
                {cat.name}
                {isSale && (
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                    %
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between gap-3 mb-6"
          data-ocid="products.toolbar"
        >
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden gap-2"
                data-ocid="products.mobile_filter_button"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 overflow-y-auto bg-card"
              data-ocid="products.mobile_filter_sheet"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="font-display">Filters</SheetTitle>
              </SheetHeader>
              <FilterPanel {...filterPanelProps} />
            </SheetContent>
          </Sheet>

          {/* Active filter chips */}
          <div className="hidden md:flex flex-wrap gap-2 flex-1 min-w-0">
            {selectedCategoryName && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs pr-1"
                data-ocid="products.active_filter.category"
              >
                {selectedCategoryName}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(undefined)}
                  className="ml-0.5 hover:text-foreground"
                  aria-label="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="gap-1 text-xs pr-1"
              >
                {size}
                <button
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className="ml-0.5 hover:text-foreground"
                  aria-label={`Remove size ${size}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {onSaleOnly && (
              <Badge className="gap-1 text-xs pr-1 bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
                On Sale
                <button
                  type="button"
                  onClick={() => setOnSaleOnly(false)}
                  className="ml-0.5 hover:text-rose-900"
                  aria-label="Remove on sale filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Sort */}
          <div className="ml-auto flex-shrink-0">
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
            >
              <SelectTrigger
                className="w-44 h-9 text-sm"
                data-ocid="products.sort_select"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {SORT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout: sidebar + grid */}
        <div className="flex gap-8">
          <aside
            className="hidden md:block w-56 flex-shrink-0"
            data-ocid="products.filter_sidebar"
          >
            <div className="sticky top-24">
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or browse a different category."
                action={{ label: "Clear all filters", onClick: handleClearAll }}
                data-ocid="products.empty_state"
              />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
                  <DemoProductCard
                    key={product.id}
                    product={product}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
