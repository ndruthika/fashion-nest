import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LookbookImage {
  id: string;
  src: string;
  label: string;
  theme: string;
  span?: "tall" | "wide" | "normal";
}

interface SeasonProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  tag: string;
}

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonConfig {
  key: Season;
  label: string;
  subtitle: string;
  accent: string;
  heroImage: string;
  heroTitle: string;
  heroTag: string;
}

// ─── Season Config ────────────────────────────────────────────────────────────

const SEASONS: SeasonConfig[] = [
  {
    key: "spring",
    label: "Spring Collection",
    subtitle: "Bloom into softness — airy silhouettes and pastel clarity",
    accent: "from-rose-100/60 to-pink-50/40",
    heroImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&h=600&fit=crop&q=85",
    heroTitle: "Spring Bloom",
    heroTag: "Spring / Summer 2026",
  },
  {
    key: "summer",
    label: "Summer Vibes",
    subtitle: "Sun-drenched palettes — effortless ease and coastal warmth",
    accent: "from-amber-100/60 to-yellow-50/40",
    heroImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&h=600&fit=crop&q=85",
    heroTitle: "Summer Luxe",
    heroTag: "Summer Edit 2026",
  },
  {
    key: "autumn",
    label: "Autumn Edit",
    subtitle: "Earthen richness — layered textures and golden hour dressing",
    accent: "from-orange-100/60 to-amber-50/40",
    heroImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1400&h=600&fit=crop&q=85",
    heroTitle: "Autumn Layers",
    heroTag: "Autumn / Winter 2026",
  },
  {
    key: "winter",
    label: "Winter Luxe",
    subtitle: "Crisp opulence — structured lines and velvet midnight tones",
    accent: "from-slate-100/60 to-zinc-50/40",
    heroImage:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1400&h=600&fit=crop&q=85",
    heroTitle: "Winter Opulence",
    heroTag: "Winter Collection 2026",
  },
];

// ─── Season Products ──────────────────────────────────────────────────────────

const SEASON_PRODUCTS: Record<Season, SeasonProduct[]> = {
  spring: [
    {
      id: "sp-p1",
      name: "Kanjivaram Silk Saree",
      price: 18500,
      originalPrice: 24000,
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Women",
    },
    {
      id: "sp-p2",
      name: "Pastel Linen Co-ord Set",
      price: 4200,
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=540&fit=crop&q=85",
      tag: "Women",
    },
    {
      id: "sp-p3",
      name: "Half Saree with Zari",
      price: 8900,
      originalPrice: 11000,
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Women",
    },
    {
      id: "sp-p4",
      name: "Floral Organza Dupatta",
      price: 2100,
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=540&fit=crop&q=85",
      tag: "Accessories",
    },
    {
      id: "sp-p5",
      name: "Ruffle Blouse — Ivory",
      price: 3400,
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Women",
    },
    {
      id: "sp-p6",
      name: "Gold Bangles Set",
      price: 6500,
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=540&fit=crop&q=85",
      tag: "Accessories",
    },
    {
      id: "sp-p7",
      name: "Pavadai Sattai — Rose",
      price: 5200,
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "South India",
    },
    {
      id: "sp-p8",
      name: "Cotton Kurta — Sage",
      price: 2800,
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=540&fit=crop&q=85",
      tag: "Men",
    },
  ],
  summer: [
    {
      id: "su-p1",
      name: "Kerala Cotton Saree",
      price: 7200,
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Women",
    },
    {
      id: "su-p2",
      name: "Silk Cami Dress",
      price: 9800,
      originalPrice: 13500,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Women",
    },
    {
      id: "su-p3",
      name: "Pearl Necklace Set",
      price: 4500,
      image:
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=540&fit=crop&q=85",
      tag: "Accessories",
    },
    {
      id: "su-p4",
      name: "Linen Kurta Pyjama",
      price: 3600,
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Men",
    },
    {
      id: "su-p5",
      name: "Maxi Slip Dress — Ivory",
      price: 11200,
      image:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=540&fit=crop&q=85",
      tag: "Women",
    },
    {
      id: "su-p6",
      name: "Pattu Silk Half Saree",
      price: 14500,
      originalPrice: 18000,
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "South India",
    },
    {
      id: "su-p7",
      name: "Embroidered Lehenga",
      price: 22000,
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=540&fit=crop&q=85",
      badge: "DESIGNER",
      tag: "Designers",
    },
    {
      id: "su-p8",
      name: "Gold Anklets Pair",
      price: 3200,
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=540&fit=crop&q=85",
      tag: "Accessories",
    },
  ],
  autumn: [
    {
      id: "au-p1",
      name: "Kashmiri Embroidered Shawl",
      price: 8500,
      image:
        "https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Women",
    },
    {
      id: "au-p2",
      name: "Silk Velvet Blazer",
      price: 16800,
      originalPrice: 22000,
      image:
        "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Designers",
    },
    {
      id: "au-p3",
      name: "Chanderi Saree — Amber",
      price: 12400,
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=540&fit=crop&q=85",
      tag: "South India",
    },
    {
      id: "au-p4",
      name: "Sherwani — Ivory Gold",
      price: 28000,
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=540&fit=crop&q=85",
      badge: "DESIGNER",
      tag: "Men",
    },
    {
      id: "au-p5",
      name: "Corduroy Wide Trousers",
      price: 5600,
      image:
        "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=400&h=540&fit=crop&q=85",
      tag: "Women",
    },
    {
      id: "au-p6",
      name: "Kundan Earrings — Statement",
      price: 4200,
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Accessories",
    },
    {
      id: "au-p7",
      name: "Camel Woollen Coat",
      price: 19500,
      originalPrice: 26000,
      image:
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Women",
    },
    {
      id: "au-p8",
      name: "Dupion Silk Lehenga",
      price: 31000,
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=540&fit=crop&q=85",
      badge: "DESIGNER",
      tag: "Designers",
    },
  ],
  winter: [
    {
      id: "wi-p1",
      name: "Banarasi Silk Saree — Deep Red",
      price: 24500,
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=540&fit=crop&q=85",
      badge: "DESIGNER",
      tag: "South India",
    },
    {
      id: "wi-p2",
      name: "Velvet Blouse — Midnight",
      price: 5800,
      image:
        "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Women",
    },
    {
      id: "wi-p3",
      name: "Structured Power Suit",
      price: 32000,
      originalPrice: 42000,
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Designers",
    },
    {
      id: "wi-p4",
      name: "Dhoti Kurta — Ivory",
      price: 7500,
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=540&fit=crop&q=85",
      badge: "NEW",
      tag: "Men",
    },
    {
      id: "wi-p5",
      name: "Sequin Column Gown",
      price: 41000,
      image:
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=540&fit=crop&q=85",
      badge: "DESIGNER",
      tag: "Women",
    },
    {
      id: "wi-p6",
      name: "Temple Necklace — Gold",
      price: 9800,
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=540&fit=crop&q=85",
      tag: "Accessories",
    },
    {
      id: "wi-p7",
      name: "Cashmere Wrap Coat",
      price: 38000,
      originalPrice: 52000,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=540&fit=crop&q=85",
      badge: "SALE",
      tag: "Women",
    },
    {
      id: "wi-p8",
      name: "Cable Knit Midi Dress",
      price: 12200,
      image:
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=540&fit=crop&q=85",
      tag: "Women",
    },
  ],
};

// ─── Gallery Images ───────────────────────────────────────────────────────────

const IMAGES: Record<Season, LookbookImage[]> = {
  spring: [
    {
      id: "sp1",
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&auto=format&fit=crop",
      label: "Spring Bloom",
      theme: "Satin Slip Dress",
      span: "tall",
    },
    {
      id: "sp2",
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=85&auto=format&fit=crop",
      label: "Petal Light",
      theme: "Linen Co-ord Set",
      span: "normal",
    },
    {
      id: "sp3",
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=85&auto=format&fit=crop",
      label: "Garden Edit",
      theme: "Floral Midi Skirt",
      span: "normal",
    },
    {
      id: "sp4",
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85&auto=format&fit=crop",
      label: "Ivory Hour",
      theme: "Ruffle Blouse",
      span: "tall",
    },
    {
      id: "sp5",
      src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=85&auto=format&fit=crop",
      label: "Soft Drama",
      theme: "Wrap Midi Dress",
      span: "normal",
    },
    {
      id: "sp6",
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=85&auto=format&fit=crop",
      label: "Pastel Layers",
      theme: "Organza Overlay",
      span: "normal",
    },
  ],
  summer: [
    {
      id: "su1",
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=85&auto=format&fit=crop",
      label: "Golden Ratio",
      theme: "Silk Cami Set",
      span: "tall",
    },
    {
      id: "su2",
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=85&auto=format&fit=crop",
      label: "Coastal Edit",
      theme: "Linen Shirt",
      span: "normal",
    },
    {
      id: "su3",
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=85&auto=format&fit=crop",
      label: "Sun Luxe",
      theme: "Cut-Out Maxi",
      span: "normal",
    },
    {
      id: "su4",
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=85&auto=format&fit=crop",
      label: "Terracotta Hour",
      theme: "Broderie Dress",
      span: "tall",
    },
    {
      id: "su5",
      src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=85&auto=format&fit=crop",
      label: "Riviera Mood",
      theme: "Stripe Bandeau Top",
      span: "normal",
    },
    {
      id: "su6",
      src: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=85&auto=format&fit=crop",
      label: "Dusk Glow",
      theme: "Halter Neck Gown",
      span: "normal",
    },
  ],
  autumn: [
    {
      id: "au1",
      src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=85&auto=format&fit=crop",
      label: "Golden Hour",
      theme: "Modern Knit",
      span: "tall",
    },
    {
      id: "au2",
      src: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=600&q=85&auto=format&fit=crop",
      label: "Caramel Luxe",
      theme: "Camel Overcoat",
      span: "normal",
    },
    {
      id: "au3",
      src: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=85&auto=format&fit=crop",
      label: "Tawny Edit",
      theme: "Leather Trench",
      span: "normal",
    },
    {
      id: "au4",
      src: "https://images.unsplash.com/photo-1519235624215-85175d5eb36e?w=800&q=85&auto=format&fit=crop",
      label: "Dusk Layers",
      theme: "Chunky Knit Sweater",
      span: "tall",
    },
    {
      id: "au5",
      src: "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=600&q=85&auto=format&fit=crop",
      label: "Forest Floor",
      theme: "Tweed Blazer",
      span: "normal",
    },
    {
      id: "au6",
      src: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=85&auto=format&fit=crop",
      label: "Evening Drama",
      theme: "Velvet Blazer Set",
      span: "normal",
    },
  ],
  winter: [
    {
      id: "wi1",
      src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=85&auto=format&fit=crop",
      label: "Midnight Luxe",
      theme: "Velvet Gown",
      span: "tall",
    },
    {
      id: "wi2",
      src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=85&auto=format&fit=crop",
      label: "Crisp Lines",
      theme: "Structured Blazer",
      span: "normal",
    },
    {
      id: "wi3",
      src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=85&auto=format&fit=crop",
      label: "Snow Drift",
      theme: "Cashmere Coat",
      span: "normal",
    },
    {
      id: "wi4",
      src: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&q=85&auto=format&fit=crop",
      label: "Obsidian Hour",
      theme: "Leather Suit",
      span: "tall",
    },
    {
      id: "wi5",
      src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=85&auto=format&fit=crop",
      label: "Frost Edit",
      theme: "Cable Knit Dress",
      span: "normal",
    },
    {
      id: "wi6",
      src: "https://images.unsplash.com/photo-1607522370275-f6fd7d78b8d8?w=600&q=85&auto=format&fit=crop",
      label: "Winter Bloom",
      theme: "Satin Evening Gown",
      span: "normal",
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function badgeStyle(badge: string) {
  if (badge === "SALE") return "bg-rose-600 text-white border-0";
  if (badge === "DESIGNER")
    return "bg-primary text-primary-foreground border-0";
  return "bg-accent text-accent-foreground border-0";
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function SeasonProductCard({
  product,
  index,
}: {
  product: SeasonProduct;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      data-ocid={`lookbook.product_card.${index + 1}`}
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${badgeStyle(product.badge)}`}
            >
              {product.badge}
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 bg-foreground/40 flex items-end justify-center pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <a href="/products">
                <Button
                  data-ocid={`lookbook.shop_similar.${index + 1}`}
                  size="sm"
                  className="text-xs uppercase tracking-wider bg-card text-foreground hover:bg-card/90 transition-smooth shadow-elevated"
                >
                  <ShoppingBag size={13} className="mr-1.5" />
                  Shop Similar
                </Button>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] uppercase tracking-widest text-accent font-body font-medium">
          {product.tag}
        </span>
        <p className="font-body text-sm font-medium text-foreground leading-snug line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="font-body text-sm font-semibold text-foreground">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-body text-xs text-muted-foreground line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
        <a href="/products" className="mt-2">
          <Button
            data-ocid={`lookbook.product_shop.${index + 1}`}
            variant="outline"
            size="sm"
            className="w-full text-xs font-body border-border hover:border-foreground/40 transition-smooth"
          >
            Shop Now <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: LookbookImage[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}

function Lightbox({ images, index, onClose, onNav }: LightboxProps) {
  const img = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onNav((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNav]);

  return (
    <AnimatePresence>
      <motion.div
        data-ocid="lightbox.dialog"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          type="button"
          data-ocid="lightbox.close_button"
          className="absolute top-5 right-5 text-white/80 hover:text-white transition-smooth z-10"
          aria-label="Close lightbox"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Prev */}
        <button
          type="button"
          data-ocid="lightbox.pagination_prev"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-smooth z-10"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onNav((index - 1 + images.length) % images.length);
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Image */}
        <motion.div
          key={img.id}
          className="relative max-w-3xl max-h-[85vh] mx-16"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={img.src}
            alt={img.theme}
            className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
          <div className="mt-4 text-center">
            <p className="text-white/60 text-xs uppercase tracking-widest font-body">
              {img.label}
            </p>
            <p className="text-white font-display text-xl mt-1">{img.theme}</p>
            <a href="/products">
              <Button
                data-ocid="lightbox.shop_similar_button"
                variant="secondary"
                size="sm"
                className="mt-3 text-xs uppercase tracking-wider"
              >
                <ShoppingBag size={13} className="mr-1.5" />
                Shop Similar
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Next */}
        <button
          type="button"
          data-ocid="lightbox.pagination_next"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-smooth z-10"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNav((index + 1) % images.length);
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Counter */}
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-body tracking-widest">
          {index + 1} / {images.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────

interface GalleryCardProps {
  image: LookbookImage;
  index: number;
  onClick: () => void;
}

function GalleryCard({ image, index, onClick }: GalleryCardProps) {
  const rowSpan = image.span === "tall" ? "row-span-2" : "row-span-1";

  return (
    <motion.button
      type="button"
      data-ocid={`lookbook.item.${index + 1}`}
      className={`gallery-image relative cursor-pointer ${rowSpan} min-h-[220px]`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: "easeOut" }}
      onClick={onClick}
      aria-label={`View ${image.theme}`}
    >
      <img
        src={image.src}
        alt={image.theme}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="gallery-overlay">
        <div className="w-full">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
            {image.label}
          </p>
          <p className="text-white font-display text-lg leading-tight mb-3">
            {image.theme}
          </p>
          <a href="/products" onClick={(e) => e.stopPropagation()}>
            <Button
              data-ocid={`lookbook.shop_similar.${index + 1}`}
              size="sm"
              className="text-xs uppercase tracking-wider bg-white text-foreground hover:bg-white/90 transition-smooth"
            >
              <ShoppingBag size={13} className="mr-1.5" />
              Shop Similar
            </Button>
          </a>
        </div>
      </div>
    </motion.button>
  );
}

// ─── LookbookPage ─────────────────────────────────────────────────────────────

export default function LookbookPage() {
  const [activeSeason, setActiveSeason] = useState<Season>("spring");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<"products" | "gallery">("products");

  const activeConfig = SEASONS.find((s) => s.key === activeSeason)!;
  const activeImages = IMAGES[activeSeason];
  const activeProducts = SEASON_PRODUCTS[activeSeason];

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navLightbox = useCallback((i: number) => setLightboxIndex(i), []);

  return (
    <div className="min-h-screen bg-background" data-ocid="lookbook.page">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[440px] md:min-h-[520px] flex items-end overflow-hidden"
        data-ocid="lookbook.hero_section"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeConfig.heroImage}
            src={activeConfig.heroImage}
            alt={activeConfig.heroTitle}
            className="absolute inset-0 h-full w-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pb-0 max-w-6xl w-full">
          <div className="pb-10 md:pb-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSeason}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-accent/90 text-accent-foreground border-0 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
                  <Sparkles size={10} className="mr-1.5" />
                  {activeConfig.heroTag}
                </Badge>
                <h1 className="font-display italic text-5xl md:text-7xl font-semibold text-card leading-[1.05] tracking-tight mb-3">
                  {activeConfig.heroTitle}
                </h1>
                <p className="text-card/75 font-body text-base md:text-lg max-w-md leading-relaxed">
                  {activeConfig.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Season Tabs — overlapping the hero bottom */}
          <nav
            data-ocid="lookbook.season_tabs"
            className="flex gap-0 overflow-x-auto border-t border-card/20"
            aria-label="Season navigation"
          >
            {SEASONS.map((s) => (
              <button
                type="button"
                key={s.key}
                data-ocid={`lookbook.tab.${s.key}`}
                onClick={() => setActiveSeason(s.key)}
                className={`relative px-5 py-4 text-sm font-body font-medium whitespace-nowrap transition-smooth
                  ${
                    activeSeason === s.key
                      ? "text-card"
                      : "text-card/55 hover:text-card/80"
                  }`}
                aria-selected={activeSeason === s.key}
              >
                {s.label}
                {activeSeason === s.key && (
                  <motion.span
                    layoutId="tab-underline-hero"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-card rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ── View Toggle + Section Header ─────────────────────────────────── */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
              {activeConfig.label}
            </p>
            <span className="text-border">·</span>
            <p className="text-xs text-muted-foreground font-body">
              {view === "products"
                ? `${activeProducts.length} pieces`
                : `${activeImages.length} looks`}
            </p>
          </div>
          <div
            className="flex items-center gap-1 p-1 bg-muted rounded-lg"
            data-ocid="lookbook.view_toggle"
          >
            <button
              type="button"
              data-ocid="lookbook.toggle.products"
              onClick={() => setView("products")}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-smooth ${
                view === "products"
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Shop Products
            </button>
            <button
              type="button"
              data-ocid="lookbook.toggle.gallery"
              onClick={() => setView("gallery")}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-smooth ${
                view === "gallery"
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Editorial Gallery
            </button>
          </div>
        </div>
      </div>

      {/* ── Products or Gallery ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {view === "products" ? (
            <motion.div
              key={`products-${activeSeason}`}
              data-ocid="lookbook.products_grid"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeProducts.map((product, i) => (
                <SeasonProductCard
                  key={product.id}
                  product={product}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`gallery-${activeSeason}`}
              data-ocid="lookbook.gallery"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeImages.map((img, i) => (
                <GalleryCard
                  key={img.id}
                  image={img}
                  index={i}
                  onClick={() => openLightbox(i)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer CTA ──────────────────────────────────────────────────── */}
        <motion.div
          className="mt-16 pb-8 text-center flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-body">
            Curated styles for every season
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/products">
              <Button
                data-ocid="lookbook.explore_all_button"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-medium px-10 shadow-elevated transition-smooth"
              >
                Explore All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/products?category=women">
              <Button
                data-ocid="lookbook.women_button"
                variant="outline"
                className="uppercase tracking-widest text-xs px-8 py-5 border-foreground/30 hover:border-foreground transition-smooth"
              >
                Women's Collection
              </Button>
            </a>
          </div>
        </motion.div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={activeImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </div>
  );
}
