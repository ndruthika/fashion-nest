import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  RefreshCw,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import DemoProductCard from "../components/DemoProductCard";
import {
  DEMO_CATEGORIES,
  getDemoFeaturedProducts,
  getDemoNewArrivals,
} from "../data/demoProducts";

// ── Category image map (by slug) ─────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  "new-arrivals":
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
  women:
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop",
  men: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop",
  designers:
    "https://images.unsplash.com/photo-1594938298603-c8148c4b4f72?w=600&h=800&fit=crop",
  sale: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&h=800&fit=crop",
  accessories:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop",
  collections:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop",
};

function getCategoryImage(slug: string): string {
  return (
    CATEGORY_IMAGES[slug] ??
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop"
  );
}

// ── Brand value propositions ─────────────────────────────────────────────────
const VALUE_PROPS = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over ₹5,000" },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Encrypted & protected checkout",
  },
  {
    icon: ShoppingBag,
    title: "Curated Selection",
    desc: "Handpicked by our style team",
  },
];

// ── Section heading with italic Fraunces + rose/gold accent underline ─────────
function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${align === "center" ? "items-center text-center" : "items-start"}`}
    >
      <span className="text-xs uppercase tracking-widest font-body text-accent font-medium">
        {eyebrow}
      </span>
      <h2 className="font-display italic text-3xl md:text-4xl font-semibold text-foreground leading-tight">
        {title}
      </h2>
      <span className="block h-0.5 w-14 rounded-full bg-accent" aria-hidden />
    </div>
  );
}

// ── Category tile card ────────────────────────────────────────────────────────
function CategoryTile({
  label,
  image,
  href,
  index,
  isSale = false,
}: {
  label: string;
  image: string;
  href: string;
  index: number;
  isSale?: boolean;
}) {
  return (
    <a
      href={href}
      className="group relative flex-shrink-0 w-44 md:w-56 overflow-hidden rounded-xl shadow-card hover:shadow-elevated transition-smooth"
      data-ocid={`category.item.${index + 1}`}
      aria-label={`Shop ${label}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

        {/* SALE badge overlay */}
        {isSale && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
              SALE
            </span>
          </div>
        )}

        {/* Category name + CTA — always visible at bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className="font-display text-lg font-semibold text-card leading-tight drop-shadow">
            {label}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-card/80 mt-0.5 font-body">
            Shop now <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const featured = getDemoFeaturedProducts();
  const newArrivals = getDemoNewArrivals();

  return (
    <div data-ocid="home.page" className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[80vh] flex items-end overflow-hidden bg-muted"
        data-ocid="home.hero_section"
      >
        <img
          src="/assets/generated/hero-editorial.dim_1600x900.jpg"
          alt="Fashion Nest — Embrace the Season's Elegance"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/35 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-24 md:pb-32 max-w-3xl">
          <Badge className="mb-5 bg-accent/90 text-accent-foreground border-0 text-xs tracking-widest uppercase px-3 py-1.5">
            New Season · 2026
          </Badge>
          <h1 className="font-display font-semibold text-5xl md:text-7xl text-card leading-[1.05] tracking-tight mb-6">
            Embrace the
            <br />
            <em>Season's Elegance</em>
          </h1>
          <p className="text-card/80 font-body text-lg mb-10 max-w-md leading-relaxed">
            Curated collections for effortless luxury. Discover the world's
            finest designers, thoughtfully selected for the modern wardrobe.
          </p>
          <div className="flex flex-wrap gap-4" data-ocid="home.hero_ctas">
            <Button
              asChild
              size="lg"
              className="bg-card text-foreground hover:bg-card/90 font-body font-medium px-8 shadow-elevated transition-smooth"
              data-ocid="home.shop_now_button"
            >
              <Link to="/products">
                Shop New Arrivals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-card/50 text-card hover:bg-card/10 font-body font-medium px-8 transition-smooth"
              data-ocid="home.explore_button"
            >
              <a href="#categories">Explore Categories</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Category Strip ────────────────────────────────────────────────── */}
      <section
        id="categories"
        className="py-16 bg-background"
        data-ocid="home.categories_section"
      >
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="Shop by Category" title="Find Your Style" />
          <div
            className="flex gap-4 mt-8 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
            data-ocid="home.categories_list"
          >
            {DEMO_CATEGORIES.map((cat, i) => (
              <CategoryTile
                key={cat.id}
                label={cat.name}
                image={getCategoryImage(cat.slug)}
                href={`/products?category=${cat.slug}`}
                index={i}
                isSale={cat.slug === "sale"}
              />
            ))}
            <a
              href="/products"
              className="group relative flex-shrink-0 w-44 md:w-56 overflow-hidden rounded-xl border border-border bg-card hover:shadow-elevated transition-smooth flex flex-col items-center justify-center gap-3 aspect-[3/4]"
              data-ocid="category.view_all_link"
            >
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-smooth">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
              <span className="font-display italic text-foreground text-base font-medium">
                View All
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Collections ──────────────────────────────────────────── */}
      <section className="py-16 bg-muted/40" data-ocid="home.featured_section">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <SectionHeading
              eyebrow="Featured Collections"
              title="This Week's Highlights"
            />
            <Link
              to="/products"
              className="text-sm font-body text-accent hover:text-accent/80 transition-colors duration-200 flex items-center gap-1 shrink-0"
              data-ocid="home.featured_view_all_link"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            data-ocid="home.featured_grid"
          >
            {featured.map((product, i) => (
              <DemoProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals Horizontal Scroll ────────────────────────────────── */}
      <section
        className="py-16 bg-background"
        data-ocid="home.new_arrivals_section"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <SectionHeading eyebrow="Just Landed" title="New Arrivals" />
            <Link
              to="/products"
              className="text-sm font-body text-accent hover:text-accent/80 transition-colors duration-200 flex items-center gap-1 shrink-0"
              data-ocid="home.new_arrivals_view_all_link"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div
            className="flex gap-4 md:gap-6 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
            data-ocid="home.new_arrivals_list"
          >
            {newArrivals.map((product, i) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-48 md:w-60 snap-start"
              >
                <DemoProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Men's Edit Banner ─────────────────────────────────────────── */}
      <section className="py-16 bg-background" data-ocid="home.mens_section">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl min-h-[340px] md:min-h-[420px] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&h=600&fit=crop&q=85"
              alt="Men's Collection — Kurtas, Sherwanis, Dhotis"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/45 to-foreground/10" />
            <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-body font-medium text-card/70 mb-3 block">
                  New Category
                </span>
                <h2 className="font-display italic text-4xl md:text-5xl font-semibold text-card leading-tight mb-3">
                  The Men's Edit
                </h2>
                <p className="text-card/75 font-body text-base max-w-sm leading-relaxed">
                  Kurtas, sherwanis, dhotis and contemporary menswear — crafted
                  for the modern South Indian gentleman.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-card text-foreground hover:bg-card/90 font-body font-medium px-8 shadow-elevated transition-smooth"
                  data-ocid="home.mens_shop_button"
                >
                  <a href="/products?category=men">
                    Shop Men <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lookbook Teaser ───────────────────────────────────────────────── */}
      <section
        className="py-20 bg-muted/30"
        data-ocid="home.lookbook_teaser_section"
      >
        <div className="container mx-auto px-6">
          {/* Section heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-body text-accent font-medium">
                Spring / Summer 2026
              </span>
              <h2 className="font-display italic text-4xl md:text-5xl font-semibold text-foreground leading-tight">
                Our Latest Collections
              </h2>
              <span
                className="block h-0.5 w-14 rounded-full bg-accent"
                aria-hidden
              />
            </div>
            <p className="text-muted-foreground font-body text-base max-w-sm leading-relaxed md:text-right">
              A visual journey through the season's defining pieces — where
              craftsmanship meets quiet confidence.
            </p>
          </div>

          {/* Image grid: large left + 3 smaller right */}
          <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-3 md:gap-4">
            {/* Featured large image */}
            <div
              className="group relative overflow-hidden rounded-2xl bg-muted aspect-[4/5] md:aspect-auto md:row-span-2"
              data-ocid="home.lookbook_teaser_image.1"
            >
              <img
                src="/assets/generated/lookbook-hero-main.dim_900x1200.jpg"
                alt="Spring Summer 2026 — Silk Collection"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                <span className="inline-block mb-2 text-[10px] uppercase tracking-[0.18em] font-body font-medium text-card/70 border border-card/30 px-2.5 py-1 rounded-full backdrop-blur-sm bg-foreground/20">
                  Featured
                </span>
                <p className="font-display italic text-2xl md:text-3xl font-semibold text-card leading-tight">
                  The Silk Edit
                </p>
                <p className="text-card/75 font-body text-sm mt-1.5 leading-snug">
                  Effortless drape for every moment
                </p>
              </div>
            </div>

            {/* Smaller editorial images */}
            <div
              className="group relative overflow-hidden rounded-2xl bg-muted aspect-[4/3] md:aspect-[4/3]"
              data-ocid="home.lookbook_teaser_image.2"
            >
              <img
                src="/assets/generated/lookbook-editorial-2.dim_600x800.jpg"
                alt="Tailored Black — Power Dressing"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/5 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                <span className="inline-block mb-1.5 text-[9px] uppercase tracking-[0.18em] font-body font-medium text-card/70 border border-card/30 px-2 py-0.5 rounded-full backdrop-blur-sm bg-foreground/20">
                  Power Dressing
                </span>
                <p className="font-display italic text-lg font-semibold text-card leading-tight">
                  Sharp Lines
                </p>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-2xl bg-muted aspect-[4/3] md:aspect-[4/3]"
              data-ocid="home.lookbook_teaser_image.3"
            >
              <img
                src="/assets/generated/lookbook-editorial-3.dim_600x800.jpg"
                alt="Autumn Winter Outerwear"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/5 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                <span className="inline-block mb-1.5 text-[9px] uppercase tracking-[0.18em] font-body font-medium text-card/70 border border-card/30 px-2 py-0.5 rounded-full backdrop-blur-sm bg-foreground/20">
                  Outerwear
                </span>
                <p className="font-display italic text-lg font-semibold text-card leading-tight">
                  The Coat Story
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-medium px-10 shadow-elevated transition-smooth"
              data-ocid="home.lookbook_explore_button"
            >
              <Link to="/lookbook">
                Explore Lookbook <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <span className="text-muted-foreground font-body text-sm">
              4 collections · 40+ looks
            </span>
          </div>
        </div>
      </section>

      {/* ── Brand Value Bar ───────────────────────────────────────────────── */}
      <section
        className="py-14 bg-card border-y border-border"
        data-ocid="home.values_section"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {VALUE_PROPS.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="flex flex-col items-center text-center gap-3"
                  data-ocid={`home.value_prop.${i + 1}`}
                >
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">
                      {vp.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {vp.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Editorial CTA Banner ──────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30" data-ocid="home.editorial_section">
        <div className="container mx-auto px-6 max-w-2xl text-center flex flex-col items-center gap-6">
          <span className="text-xs uppercase tracking-widest font-body text-accent font-medium">
            The Fashion Nest Edit
          </span>
          <h2 className="font-display italic text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Style without compromise.
          </h2>
          <p className="text-muted-foreground font-body text-base max-w-md leading-relaxed">
            Every piece in our collection is chosen for its craftsmanship,
            versatility, and timeless appeal. From emerging designers to
            established houses — curated for the discerning wardrobe.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-medium px-10 transition-smooth shadow-elevated"
            data-ocid="home.explore_collection_button"
          >
            <Link to="/products">
              Explore the Collection <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
