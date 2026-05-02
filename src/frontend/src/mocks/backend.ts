import type { backendInterface } from "../backend.d";
import { OrderStatus, UserRole } from "../backend.d";
import { ExternalBlob } from "../backend";

const sampleImage = ExternalBlob.fromURL(
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
);

const sampleProduct1 = {
  id: BigInt(1),
  categoryId: BigInt(1),
  name: "Silk Wrap Dress",
  createdAt: BigInt(Date.now()),
  isNewArrival: true,
  description: "Elegant silk wrap dress with a flattering silhouette, perfect for evening occasions.",
  variants: [
    { color: "Ivory", size: "XS", stock: BigInt(5) },
    { color: "Ivory", size: "S", stock: BigInt(8) },
    { color: "Ivory", size: "M", stock: BigInt(6) },
    { color: "Rose Gold", size: "S", stock: BigInt(4) },
    { color: "Rose Gold", size: "M", stock: BigInt(3) },
  ],
  isFeatured: true,
  priceInCents: BigInt(24900),
  images: [sampleImage],
};

const sampleProduct2 = {
  id: BigInt(2),
  categoryId: BigInt(1),
  name: "Cashmere Turtleneck",
  createdAt: BigInt(Date.now()),
  isNewArrival: false,
  description: "Luxuriously soft pure cashmere turtleneck sweater for effortless everyday elegance.",
  variants: [
    { color: "Camel", size: "S", stock: BigInt(10) },
    { color: "Camel", size: "M", stock: BigInt(7) },
    { color: "Black", size: "S", stock: BigInt(6) },
    { color: "Black", size: "M", stock: BigInt(5) },
  ],
  isFeatured: true,
  priceInCents: BigInt(18900),
  images: [ExternalBlob.fromURL("https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop")],
};

const sampleProduct3 = {
  id: BigInt(3),
  categoryId: BigInt(2),
  name: "Tailored Blazer",
  createdAt: BigInt(Date.now()),
  isNewArrival: true,
  description: "Sharp structured blazer in Italian wool blend. A wardrobe cornerstone.",
  variants: [
    { color: "Charcoal", size: "S", stock: BigInt(3) },
    { color: "Charcoal", size: "M", stock: BigInt(4) },
    { color: "Ivory", size: "S", stock: BigInt(2) },
  ],
  isFeatured: false,
  priceInCents: BigInt(32000),
  images: [ExternalBlob.fromURL("https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=500&fit=crop")],
};

const sampleProduct4 = {
  id: BigInt(4),
  categoryId: BigInt(2),
  name: "Wide Leg Trousers",
  createdAt: BigInt(Date.now()),
  isNewArrival: true,
  description: "Flowing wide-leg trousers crafted from premium crepe. Elevated and versatile.",
  variants: [
    { color: "Cream", size: "XS", stock: BigInt(4) },
    { color: "Cream", size: "S", stock: BigInt(6) },
    { color: "Terracotta", size: "S", stock: BigInt(3) },
  ],
  isFeatured: true,
  priceInCents: BigInt(15500),
  images: [ExternalBlob.fromURL("https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop")],
};

export const mockBackend: backendInterface = {
  addSavedAddress: async () => true,
  addToCart: async () => BigInt(1),
  addToWishlist: async () => undefined,
  assignCallerUserRole: async () => undefined,
  clearCart: async () => undefined,
  createCategory: async (name, slug, description) => ({
    id: BigInt(1),
    name,
    slug,
    createdAt: BigInt(Date.now()),
    description,
  }),
  createCheckoutSession: async () => "https://checkout.stripe.com/mock-session",
  createOrder: async (input) => ({
    id: BigInt(1),
    status: OrderStatus.pending,
    subtotalInCents: BigInt(24900),
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    totalInCents: BigInt(29900),
    shippingAddress: input.shippingAddress,
    buyer: {} as any,
    items: [],
    shippingInCents: BigInt(5000),
  }),
  createProduct: async (input) => ({
    id: BigInt(99),
    ...input,
    createdAt: BigInt(Date.now()),
  }),
  deleteCategory: async () => true,
  deleteProduct: async () => true,
  getAllOrders: async () => [],
  getCallerUserProfile: async () => null,
  getCallerUserRole: async () => UserRole.guest,
  getCart: async () => ({ totalInCents: BigInt(0), items: [] }),
  getCategories: async () => [
    { id: BigInt(1), name: "Dresses", slug: "dresses", createdAt: BigInt(Date.now()), description: "Elegant dresses for every occasion" },
    { id: BigInt(2), name: "Separates", slug: "separates", createdAt: BigInt(Date.now()), description: "Mix-and-match pieces" },
    { id: BigInt(3), name: "Outerwear", slug: "outerwear", createdAt: BigInt(Date.now()), description: "Coats and jackets" },
    { id: BigInt(4), name: "Accessories", slug: "accessories", createdAt: BigInt(Date.now()), description: "Finishing touches" },
  ],
  getFeaturedProducts: async () => [sampleProduct1, sampleProduct2, sampleProduct4],
  getMyOrders: async () => [],
  getNewArrivals: async () => [sampleProduct1, sampleProduct3, sampleProduct4],
  getOrder: async () => null,
  getProduct: async () => sampleProduct1,
  getStripeSessionStatus: async () => ({ __kind__: "failed", failed: { error: "mock" } }),
  getUserProfile: async () => null,
  getWishlist: async () => [],
  isCallerAdmin: async () => false,
  isStripeConfigured: async () => false,
  removeFromCart: async () => true,
  removeFromWishlist: async () => undefined,
  removeSavedAddress: async () => true,
  saveCallerUserProfile: async () => undefined,
  searchProducts: async () => [sampleProduct1, sampleProduct2, sampleProduct3, sampleProduct4],
  setStripeConfiguration: async () => undefined,
  transform: async (input) => ({ status: BigInt(200), body: new Uint8Array(), headers: [] }),
  updateCartItem: async () => true,
  updateCategory: async () => true,
  updateOrderStatus: async () => true,
  updateOrderStripeSession: async () => true,
  updateProduct: async () => true,
};
