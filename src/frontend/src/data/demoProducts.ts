// ── Demo Product Data ─────────────────────────────────────────────────────────
// All prices in Indian Rupees (₹). This is the PRIMARY data source for the app.
// No backend calls needed — products always load instantly.

export interface DemoProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in rupees
  compareAtPrice?: number; // original price for sale items
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
}

export interface DemoCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

// ── Image URLs ─────────────────────────────────────────────────────────────────
const IMG = {
  saree1:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
  saree2:
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
  saree3:
    "https://images.unsplash.com/photo-1615886357793-df6dc618d7c2?w=400&h=500&fit=crop",
  kurti1:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
  kurti2:
    "https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?w=400&h=500&fit=crop",
  lehenga1:
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=500&fit=crop",
  lehenga2:
    "https://images.unsplash.com/photo-1609208609489-a221dcb89a64?w=400&h=500&fit=crop",
  menKurta1:
    "https://images.unsplash.com/photo-1599416793065-a1b9b53f29e6?w=400&h=500&fit=crop",
  menKurta2:
    "https://images.unsplash.com/photo-1594938374182-a55e3c86cc63?w=400&h=500&fit=crop",
  sherwani:
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop",
  jewelry1:
    "https://images.unsplash.com/photo-1614886137799-acea95d3b60e?w=400&h=500&fit=crop",
  jewelry2:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop",
  jewelry3:
    "https://images.unsplash.com/photo-1596364983613-ede6e83b5aa3?w=400&h=500&fit=crop",
  collection1:
    "https://images.unsplash.com/photo-1630350736680-1dcf88bdec22?w=400&h=500&fit=crop",
  collection2:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
  collection3:
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
  anarkali:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
  sale1:
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=500&fit=crop",
  sale2:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
  designer1:
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
  designer2:
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&h=500&fit=crop",
};

// ── NEW ARRIVALS (8 products) — Fresh trending pieces with isNewArrival: true ─
const NEW_ARRIVALS: DemoProduct[] = [
  {
    id: "na-1",
    name: "Kanjivaram Silk Saree — New Season",
    description:
      "Freshly woven Kanjivaram silk saree with this season's signature temple border in vivid jewel tones.",
    price: 8999,
    category: "new-arrivals",
    image: IMG.saree1,
    sizes: ["Free Size"],
    colors: ["Ruby Red", "Peacock Blue", "Emerald"],
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-2",
    name: "Embroidered Anarkali Suit",
    description:
      "Floor-length Anarkali with heavy thread embroidery on chiffon. Just arrived for the festive season.",
    price: 3499,
    category: "new-arrivals",
    image: IMG.anarkali,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Purple", "Teal"],
    rating: 4.6,
    reviewCount: 29,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-3",
    name: "Pattu Silk Half Saree",
    description:
      "Traditional South Indian half saree in pure Pattu silk with contrasting border — freshly launched.",
    price: 5999,
    category: "new-arrivals",
    image: IMG.saree2,
    sizes: ["Free Size"],
    colors: ["Gold", "Pink", "Blue"],
    rating: 4.9,
    reviewCount: 18,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-4",
    name: "Contemporary Cotton Kurta Set",
    description:
      "Modern cotton kurta with palazzo pants — a new silhouette for the season.",
    price: 2299,
    category: "new-arrivals",
    image: IMG.kurti1,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Ivory", "Sage", "Blush"],
    rating: 4.5,
    reviewCount: 37,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-5",
    name: "Floral Georgette Saree",
    description:
      "Light georgette saree with vibrant floral prints — the latest addition to our saree catalogue.",
    price: 4299,
    category: "new-arrivals",
    image: IMG.saree3,
    sizes: ["Free Size"],
    colors: ["Yellow", "Pink", "Orange"],
    rating: 4.4,
    reviewCount: 22,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-6",
    name: "Classic Dhoti Kurta — New Cut",
    description:
      "Freshly designed dhoti kurta in premium handloom cotton. A modern take on the South Indian classic.",
    price: 3199,
    category: "new-arrivals",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Pale Gold"],
    rating: 4.7,
    reviewCount: 15,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-7",
    name: "Block Print Cotton Kurti",
    description:
      "Soft cotton kurti with hand block prints. New season colours just in.",
    price: 1299,
    category: "new-arrivals",
    image: IMG.kurti2,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Green", "Rust"],
    rating: 4.3,
    reviewCount: 56,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
  {
    id: "na-8",
    name: "Festive Kurta Pajama — New Launch",
    description:
      "Richly embroidered festive kurta with matching pajama. Brand new for the celebration season.",
    price: 3299,
    category: "new-arrivals",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Maroon", "Emerald"],
    rating: 4.7,
    reviewCount: 11,
    inStock: true,
    isNewArrival: true,
    tags: ["New Arrival"],
  },
];

// ── WOMEN (10 products) — Women's ethnic wear only ────────────────────────────
const WOMEN: DemoProduct[] = [
  {
    id: "w-1",
    name: "Kanjivaram Pure Silk Saree",
    description:
      "The finest Kanjivaram silk saree with a rich temple border. A traditional masterpiece for special occasions.",
    price: 12999,
    category: "women",
    image: IMG.saree1,
    sizes: ["Free Size"],
    colors: ["Red", "Green", "Blue", "Purple"],
    rating: 4.9,
    reviewCount: 183,
    inStock: true,
    isFeatured: true,
    tags: ["South India"],
  },
  {
    id: "w-2",
    name: "Kerala Cotton Saree",
    description:
      "Elegant off-white Kerala cotton saree with gold kasavu border. A South Indian classic.",
    price: 3499,
    category: "women",
    image: IMG.saree3,
    sizes: ["Free Size"],
    colors: ["Ivory", "Off-White"],
    rating: 4.7,
    reviewCount: 134,
    inStock: true,
    isFeatured: true,
    tags: ["South India"],
  },
  {
    id: "w-3",
    name: "Pattu Silk Saree",
    description:
      "Traditional Pattu silk saree from Tamil Nadu with contrasting border and zari pallu.",
    price: 8499,
    category: "women",
    image: IMG.saree2,
    sizes: ["Free Size"],
    colors: ["Pink", "Gold", "Maroon"],
    rating: 4.8,
    reviewCount: 97,
    inStock: true,
    isFeatured: true,
    tags: ["South India"],
  },
  {
    id: "w-4",
    name: "Half Saree Set with Dupatta",
    description:
      "Traditional half saree set — lehenga, dupatta, and blouse in matching silk. For teenage girls and young women.",
    price: 6999,
    category: "women",
    image: IMG.lehenga2,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Green", "Yellow", "Pink"],
    rating: 4.6,
    reviewCount: 62,
    inStock: true,
    tags: ["South India"],
  },
  {
    id: "w-5",
    name: "Pavadai Sattai",
    description:
      "Classic South Indian Pavadai Sattai with embroidered blouse. A cherished traditional outfit.",
    price: 4299,
    category: "women",
    image: IMG.lehenga1,
    sizes: ["XS", "S", "M"],
    colors: ["Red", "Blue", "Yellow"],
    rating: 4.5,
    reviewCount: 44,
    inStock: true,
    tags: ["South India"],
  },
  {
    id: "w-6",
    name: "Embroidered Lehenga Choli",
    description:
      "Heavy embroidered bridal lehenga with matching choli and dupatta. Exquisite handwork throughout.",
    price: 9499,
    category: "women",
    image: IMG.lehenga1,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Pink", "Maroon"],
    rating: 4.8,
    reviewCount: 91,
    inStock: true,
    tags: ["Bridal"],
  },
  {
    id: "w-7",
    name: "Silk Kurti",
    description:
      "Straight-cut pure silk kurti with subtle prints. Effortlessly elegant for office and events.",
    price: 2499,
    category: "women",
    image: IMG.kurti1,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Teal", "Maroon", "Navy"],
    rating: 4.4,
    reviewCount: 167,
    inStock: true,
    tags: ["Everyday"],
  },
  {
    id: "w-8",
    name: "Cotton Salwar Suit",
    description:
      "Comfortable cotton salwar suit with digital print. Comes with matching dupatta.",
    price: 1999,
    category: "women",
    image: IMG.kurti2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Green", "Orange"],
    rating: 4.3,
    reviewCount: 239,
    inStock: true,
    tags: ["Everyday"],
  },
  {
    id: "w-9",
    name: "Banarasi Silk Saree",
    description:
      "Opulent Banarasi silk saree with intricate brocade work and pure gold zari. A generational treasure.",
    price: 14999,
    category: "women",
    image: IMG.saree1,
    sizes: ["Free Size"],
    colors: ["Deep Red", "Royal Blue", "Forest Green"],
    rating: 4.9,
    reviewCount: 58,
    inStock: true,
    tags: ["Bridal"],
  },
  {
    id: "w-10",
    name: "Georgette Saree",
    description:
      "Lightweight georgette saree perfect for summer events. Beautiful drape with sequin work.",
    price: 3999,
    category: "women",
    image: IMG.collection3,
    sizes: ["Free Size"],
    colors: ["Peach", "Lavender", "Sky Blue"],
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    tags: ["Everyday"],
  },
];

// ── MEN (10 products) — Men's ethnic wear only ────────────────────────────────
const MEN: DemoProduct[] = [
  {
    id: "m-1",
    name: "Traditional Dhoti Set",
    description:
      "Crisp white dhoti with matching angavastram. Essential South Indian traditional wear.",
    price: 2499,
    category: "men",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Ivory", "Off-White"],
    rating: 4.6,
    reviewCount: 88,
    inStock: true,
    isFeatured: true,
    tags: ["Traditional"],
  },
  {
    id: "m-2",
    name: "Silk Sherwani",
    description:
      "Elegant silk sherwani with subtle zari embroidery. Perfect for weddings and formal ceremonies.",
    price: 12999,
    category: "men",
    image: IMG.sherwani,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Ivory", "Champagne", "Navy"],
    rating: 4.8,
    reviewCount: 54,
    inStock: true,
    isFeatured: true,
    tags: ["Wedding"],
  },
  {
    id: "m-3",
    name: "Cotton Kurta",
    description:
      "Breathable cotton kurta with simple elegance. Perfect for everyday wear and casual gatherings.",
    price: 1499,
    category: "men",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["White", "Blue", "Green", "Yellow"],
    rating: 4.4,
    reviewCount: 312,
    inStock: true,
    isFeatured: true,
    tags: ["Everyday"],
  },
  {
    id: "m-4",
    name: "Festive Kurta Pajama Set",
    description:
      "Richly embroidered festive kurta with matching pajama. A complete look for special celebrations.",
    price: 3299,
    category: "men",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Maroon", "Emerald"],
    rating: 4.7,
    reviewCount: 76,
    inStock: true,
    isFeatured: true,
    tags: ["Festive"],
  },
  {
    id: "m-5",
    name: "Nehru Jacket",
    description:
      "Classic Nehru collar jacket in raw silk. Layer over any kurta for an instantly elevated look.",
    price: 2999,
    category: "men",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Maroon"],
    rating: 4.5,
    reviewCount: 143,
    inStock: true,
    tags: ["Formal"],
  },
  {
    id: "m-6",
    name: "Linen Kurta",
    description:
      "Premium linen kurta — cool, comfortable and chic. Perfect for South Indian summers.",
    price: 1799,
    category: "men",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "White", "Olive"],
    rating: 4.3,
    reviewCount: 198,
    inStock: true,
    tags: ["Everyday"],
  },
  {
    id: "m-7",
    name: "Embroidered Sherwani",
    description:
      "Heavily embroidered groom's sherwani with intricate thread work. Available with churidar.",
    price: 18999,
    category: "men",
    image: IMG.sherwani,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gold", "Ivory", "Deep Red"],
    rating: 4.9,
    reviewCount: 32,
    inStock: true,
    tags: ["Bridal"],
  },
  {
    id: "m-8",
    name: "Casual Kurta",
    description:
      "Relaxed-fit casual kurta in soft cotton blend. Great for weekend outings and casual dinners.",
    price: 999,
    category: "men",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Grey", "Blue", "Black", "White"],
    rating: 4.2,
    reviewCount: 445,
    inStock: true,
    tags: ["Casual"],
  },
  {
    id: "m-9",
    name: "Angarkha Style Kurta",
    description:
      "Traditional Angarkha-style kurta with diagonal closure and potli buttons. Artisanal craftsmanship.",
    price: 2299,
    category: "men",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Indigo", "Rust", "Mustard"],
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    tags: ["Traditional"],
  },
  {
    id: "m-10",
    name: "Dhoti Kurta Set",
    description:
      "Complete dhoti kurta set in handloom cotton. A quintessential South Indian look for festive days.",
    price: 3499,
    category: "men",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream"],
    rating: 4.7,
    reviewCount: 94,
    inStock: true,
    tags: ["Traditional"],
  },
];

// ── DESIGNERS (8 products) — Luxury/couture items ₹15,000+ ───────────────────
const DESIGNERS: DemoProduct[] = [
  {
    id: "d-1",
    name: "Sabyasachi Inspired Bridal Lehenga",
    description:
      "Opulent bridal lehenga with hand-embroidered blouse and embellished dupatta. Luxury at its finest.",
    price: 45000,
    category: "designers",
    image: IMG.designer1,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Ivory", "Deep Burgundy"],
    rating: 4.9,
    reviewCount: 28,
    inStock: true,
    isFeatured: true,
    tags: ["Bridal"],
  },
  {
    id: "d-2",
    name: "Manish Malhotra Inspired Couture Saree",
    description:
      "Couture-level net saree with Swarovski crystal embellishments. Red carpet ready.",
    price: 32000,
    category: "designers",
    image: IMG.saree1,
    sizes: ["Free Size"],
    colors: ["Black", "Royal Blue", "Emerald"],
    rating: 4.8,
    reviewCount: 19,
    inStock: true,
    isFeatured: true,
    tags: ["Designer"],
  },
  {
    id: "d-3",
    name: "Tarun Tahiliani Anarkali Gown",
    description:
      "Floor-length Anarkali with delicate hand embroidery and flared skirt. A timeless couture silhouette.",
    price: 28000,
    category: "designers",
    image: IMG.anarkali,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Blush", "Mint"],
    rating: 4.7,
    reviewCount: 41,
    inStock: true,
    isFeatured: true,
    tags: ["Designer"],
  },
  {
    id: "d-4",
    name: "Ritu Kumar Heritage Silk Saree",
    description:
      "Heritage block-printed silk saree with traditional motifs. Crafted in Varanasi by master weavers.",
    price: 22000,
    category: "designers",
    image: IMG.saree2,
    sizes: ["Free Size"],
    colors: ["Ochre", "Jade", "Cobalt"],
    rating: 4.8,
    reviewCount: 35,
    inStock: true,
    isFeatured: true,
    tags: ["Designer"],
  },
  {
    id: "d-5",
    name: "Luxury Bridal Saree with Zardozi",
    description:
      "Custom-crafted bridal saree with heavy zardozi work. Complete with matching blouse and petticoat.",
    price: 35000,
    category: "designers",
    image: IMG.designer2,
    sizes: ["Free Size"],
    colors: ["Deep Red", "Gold"],
    rating: 4.9,
    reviewCount: 22,
    inStock: true,
    isFeatured: true,
    tags: ["Bridal"],
  },
  {
    id: "d-6",
    name: "Couture Lehenga Choli — Bespoke",
    description:
      "The ultimate statement bridal lehenga — 3 months of handwork, 10,000+ sequins. One-of-a-kind.",
    price: 55000,
    category: "designers",
    image: IMG.lehenga1,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Peach", "Ivory"],
    rating: 5.0,
    reviewCount: 14,
    inStock: true,
    isFeatured: true,
    tags: ["Bridal"],
  },
  {
    id: "d-7",
    name: "Designer Embroidered Groom Sherwani",
    description:
      "Masterpiece groom's sherwani with hand-embroidered goldwork. Comes with matching churidar and dupatta.",
    price: 38000,
    category: "designers",
    image: IMG.sherwani,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Ivory", "Gold", "Champagne"],
    rating: 4.9,
    reviewCount: 17,
    inStock: true,
    isFeatured: true,
    tags: ["Bridal"],
  },
  {
    id: "d-8",
    name: "Luxury Mirror Work Lehenga",
    description:
      "Haute couture lehenga with extensive mirror and thread embellishment. A showstopper for receptions.",
    price: 42000,
    category: "designers",
    image: IMG.designer1,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Indigo", "Teal", "Rust"],
    rating: 4.8,
    reviewCount: 9,
    inStock: true,
    isFeatured: true,
    tags: ["Designer"],
  },
];

// ── SALE (10 products) — All with compareAtPrice showing original price ────────
const SALE: DemoProduct[] = [
  {
    id: "s-1",
    name: "Cotton Saree",
    description:
      "Beautiful cotton saree with traditional border. Lightweight and comfortable for daily wear.",
    price: 1499,
    compareAtPrice: 2999,
    category: "sale",
    image: IMG.sale2,
    sizes: ["Free Size"],
    colors: ["Blue", "Pink", "Yellow"],
    rating: 4.3,
    reviewCount: 167,
    inStock: true,
    isFeatured: true,
    tags: ["Sale"],
  },
  {
    id: "s-2",
    name: "Printed Kurti",
    description:
      "Trendy printed kurti in comfortable fabric. Great value for regular wear.",
    price: 649,
    compareAtPrice: 1299,
    category: "sale",
    image: IMG.kurti2,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Green", "Blue"],
    rating: 4.2,
    reviewCount: 298,
    inStock: true,
    isFeatured: true,
    tags: ["Sale"],
  },
  {
    id: "s-3",
    name: "Casual Kurta — Men's Sale",
    description:
      "Comfortable everyday men's kurta in breathable cotton. Perfect wardrobe staple at sale price.",
    price: 499,
    compareAtPrice: 999,
    category: "sale",
    image: IMG.menKurta2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Grey"],
    rating: 4.1,
    reviewCount: 412,
    inStock: true,
    isFeatured: true,
    tags: ["Sale"],
  },
  {
    id: "s-4",
    name: "Palazzo Set",
    description:
      "Stylish palazzo set with matching top and dupatta. Comfortable and fashionable at sale price.",
    price: 1249,
    compareAtPrice: 2499,
    category: "sale",
    image: IMG.anarkali,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Teal", "Mustard", "Pink"],
    rating: 4.4,
    reviewCount: 183,
    inStock: true,
    isFeatured: true,
    tags: ["Sale"],
  },
  {
    id: "s-5",
    name: "Silk Blend Saree",
    description:
      "Elegant silk blend saree at an unbeatable price. Great for parties and festivals.",
    price: 1799,
    compareAtPrice: 3599,
    category: "sale",
    image: IMG.saree3,
    sizes: ["Free Size"],
    colors: ["Gold", "Maroon", "Navy"],
    rating: 4.5,
    reviewCount: 121,
    inStock: true,
    tags: ["Sale"],
  },
  {
    id: "s-6",
    name: "Embroidered Festive Kurta — Men",
    description:
      "Beautifully embroidered festive men's kurta. Limited stock at this sale price!",
    price: 899,
    compareAtPrice: 1799,
    category: "sale",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Maroon", "Forest Green"],
    rating: 4.3,
    reviewCount: 94,
    inStock: true,
    tags: ["Sale"],
  },
  {
    id: "s-7",
    name: "Chanderi Silk Saree",
    description:
      "Lightweight Chanderi silk saree with delicate motifs. An affordable luxury at sale price.",
    price: 2499,
    compareAtPrice: 4999,
    category: "sale",
    image: IMG.sale1,
    sizes: ["Free Size"],
    colors: ["Ivory", "Peach", "Lavender"],
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    tags: ["Sale"],
  },
  {
    id: "s-8",
    name: "Phulkari Embroidery Dupatta",
    description:
      "Premium dupatta with authentic Phulkari embroidery. Add elegance to any simple suit.",
    price: 699,
    compareAtPrice: 1399,
    category: "sale",
    image: IMG.collection3,
    sizes: ["Free Size"],
    colors: ["Pink", "Orange", "Blue"],
    rating: 4.4,
    reviewCount: 145,
    inStock: true,
    tags: ["Sale"],
  },
  {
    id: "s-9",
    name: "Cotton Lehenga Set",
    description:
      "Casual cotton lehenga set — comfortable and colourful for festivals.",
    price: 1599,
    compareAtPrice: 3199,
    category: "sale",
    image: IMG.lehenga2,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Yellow", "Green"],
    rating: 4.3,
    reviewCount: 209,
    inStock: true,
    tags: ["Sale"],
  },
  {
    id: "s-10",
    name: "Nehru Jacket — Sale",
    description:
      "Smart Nehru collar jacket in cotton. Layer over any kurta for a sharp look.",
    price: 799,
    compareAtPrice: 1599,
    category: "sale",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Maroon", "Navy"],
    rating: 4.2,
    reviewCount: 167,
    inStock: true,
    tags: ["Sale"],
  },
];

// ── ACCESSORIES (8 products) — Jewelry only ───────────────────────────────────
const ACCESSORIES: DemoProduct[] = [
  {
    id: "acc-1",
    name: "Temple Gold Necklace Set",
    description:
      "Traditional South Indian temple jewellery necklace with matching earrings. Antique gold finish.",
    price: 4999,
    category: "accessories",
    image: IMG.jewelry1,
    sizes: ["Free Size"],
    colors: ["Gold"],
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    isFeatured: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-2",
    name: "Kundan Earrings",
    description:
      "Exquisite Kundan drop earrings with meenakari work. A statement piece for festive occasions.",
    price: 2499,
    category: "accessories",
    image: IMG.jewelry2,
    sizes: ["Free Size"],
    colors: ["Gold", "Silver"],
    rating: 4.7,
    reviewCount: 134,
    inStock: true,
    isFeatured: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-3",
    name: "Glass Bangles Set (12 pcs)",
    description:
      "Vibrant glass bangles set of 12 pieces in assorted colours. Perfect for everyday wear.",
    price: 599,
    category: "accessories",
    image: IMG.jewelry3,
    sizes: ["2.4", "2.6", "2.8"],
    colors: ["Multicolor", "Red", "Green"],
    rating: 4.5,
    reviewCount: 289,
    inStock: true,
    isFeatured: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-4",
    name: "Pearl Anklets Pair",
    description:
      "Delicate pearl anklets with silver chain. Adds a traditional touch to any ethnic outfit.",
    price: 1299,
    category: "accessories",
    image: IMG.jewelry1,
    sizes: ["Free Size"],
    colors: ["Silver", "Gold"],
    rating: 4.6,
    reviewCount: 87,
    inStock: true,
    isFeatured: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-5",
    name: "Oxidised Jhumka Earrings",
    description:
      "Trendy oxidised silver jhumka earrings with intricate filigree work. Bohemian and elegant.",
    price: 899,
    category: "accessories",
    image: IMG.jewelry2,
    sizes: ["Free Size"],
    colors: ["Oxidised Silver"],
    rating: 4.4,
    reviewCount: 198,
    inStock: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-6",
    name: "Maang Tikka",
    description:
      "Elegant maang tikka with Kundan stones and pearl drops. Bridal or festive hair accessory.",
    price: 1499,
    category: "accessories",
    image: IMG.jewelry1,
    sizes: ["Free Size"],
    colors: ["Gold", "Antique Gold"],
    rating: 4.7,
    reviewCount: 63,
    inStock: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-7",
    name: "Silk Thread Bracelet Set",
    description:
      "Handcrafted silk thread bracelets set of 3. Colourful and playful accessories.",
    price: 399,
    category: "accessories",
    image: IMG.jewelry3,
    sizes: ["Free Size"],
    colors: ["Multicolor", "Red-Gold", "Blue-Gold"],
    rating: 4.3,
    reviewCount: 312,
    inStock: true,
    tags: ["Jewelry"],
  },
  {
    id: "acc-8",
    name: "Meenakari Pendant Set",
    description:
      "Beautiful Meenakari pendant necklace with matching earrings in vibrant enamel colours.",
    price: 3499,
    category: "accessories",
    image: IMG.jewelry2,
    sizes: ["Free Size"],
    colors: ["Blue", "Green", "Red"],
    rating: 4.7,
    reviewCount: 74,
    inStock: true,
    tags: ["Jewelry"],
  },
];

// ── COLLECTIONS (8 products) — Seasonal/themed curated sets ──────────────────
const COLLECTIONS: DemoProduct[] = [
  {
    id: "col-1",
    name: "Summer Silk Collection",
    description:
      "Curated summer silk saree — light, airy and perfect for sun-drenched days and celebrations.",
    price: 6999,
    category: "collections",
    image: IMG.collection1,
    sizes: ["Free Size"],
    colors: ["Yellow", "Peach", "Sky Blue"],
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    isFeatured: true,
    tags: ["Summer"],
  },
  {
    id: "col-2",
    name: "Winter Woolen Kurta Set",
    description:
      "Warm and stylish woolen kurta set for winter. Rich colours inspired by Kashmiri embroidery.",
    price: 4999,
    category: "collections",
    image: IMG.collection2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Maroon", "Teal", "Navy"],
    rating: 4.6,
    reviewCount: 61,
    inStock: true,
    isFeatured: true,
    tags: ["Winter"],
  },
  {
    id: "col-3",
    name: "Spring Pastel Lehenga",
    description:
      "Pastel-hued lehenga set inspired by spring blooms. Lightweight fabric with floral embroidery.",
    price: 8499,
    category: "collections",
    image: IMG.lehenga2,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blush", "Lavender", "Mint"],
    rating: 4.8,
    reviewCount: 53,
    inStock: true,
    isFeatured: true,
    tags: ["Spring"],
  },
  {
    id: "col-4",
    name: "Autumn Rust Saree",
    description:
      "Earthy rust-toned saree with autumn-inspired block prints. Season's must-have.",
    price: 5499,
    category: "collections",
    image: IMG.sale1,
    sizes: ["Free Size"],
    colors: ["Rust", "Burnt Orange", "Ochre"],
    rating: 4.5,
    reviewCount: 47,
    inStock: true,
    isFeatured: true,
    tags: ["Autumn"],
  },
  {
    id: "col-5",
    name: "Festival Collection Saree",
    description:
      "Festive saree collection — every piece handpicked for its craftsmanship and vibrancy.",
    price: 9999,
    category: "collections",
    image: IMG.collection3,
    sizes: ["Free Size"],
    colors: ["Gold", "Red", "Green"],
    rating: 4.8,
    reviewCount: 72,
    inStock: true,
    tags: ["Festive"],
  },
  {
    id: "col-6",
    name: "Wedding Season Bridal Lehenga",
    description:
      "Statement bridal lehenga from the wedding season collection. Embellished to perfection.",
    price: 24999,
    category: "collections",
    image: IMG.designer1,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Deep Red", "Maroon", "Pink"],
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    tags: ["Bridal"],
  },
  {
    id: "col-7",
    name: "Summer Men's Linen Kurta Set",
    description:
      "Curated summer linen kurta set for men — breathable, minimal, and seasonal.",
    price: 3299,
    category: "collections",
    image: IMG.menKurta1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "White", "Sage"],
    rating: 4.5,
    reviewCount: 116,
    inStock: true,
    tags: ["Summer"],
  },
  {
    id: "col-8",
    name: "Winter Shawl Kurta Ensemble",
    description:
      "Curated winter set — embroidered kurta with matching pashmina shawl. Cold-weather luxury.",
    price: 7499,
    category: "collections",
    image: IMG.collection2,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Deep Maroon", "Navy", "Forest Green"],
    rating: 4.6,
    reviewCount: 44,
    inStock: true,
    tags: ["Winter"],
  },
];

// ── Combined ───────────────────────────────────────────────────────────────────

export const ALL_DEMO_PRODUCTS: DemoProduct[] = [
  ...NEW_ARRIVALS,
  ...WOMEN,
  ...MEN,
  ...DESIGNERS,
  ...SALE,
  ...ACCESSORIES,
  ...COLLECTIONS,
];

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: "cat-1",
    name: "New Arrivals",
    slug: "new-arrivals",
    productCount: NEW_ARRIVALS.length,
  },
  { id: "cat-2", name: "Women", slug: "women", productCount: WOMEN.length },
  { id: "cat-3", name: "Men", slug: "men", productCount: MEN.length },
  {
    id: "cat-4",
    name: "Designers",
    slug: "designers",
    productCount: DESIGNERS.length,
  },
  { id: "cat-5", name: "Sale", slug: "sale", productCount: SALE.length },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    productCount: ACCESSORIES.length,
  },
  {
    id: "cat-7",
    name: "Collections",
    slug: "collections",
    productCount: COLLECTIONS.length,
  },
];

export function getDemoProductsByCategory(category: string): DemoProduct[] {
  const slug = category.toLowerCase();
  return ALL_DEMO_PRODUCTS.filter((p) => p.category === slug);
}

export function getDemoFeaturedProducts(): DemoProduct[] {
  return ALL_DEMO_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
}

export function getDemoNewArrivals(): DemoProduct[] {
  return NEW_ARRIVALS;
}

export function getDemoProductById(id: string): DemoProduct | undefined {
  return ALL_DEMO_PRODUCTS.find((p) => p.id === id);
}
