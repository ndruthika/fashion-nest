export interface Category {
  id: bigint;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId: bigint | null;
  sortOrder?: bigint;
  isActive?: boolean;
  createdAt?: bigint;
}

export interface ProductVariant {
  color: string;
  size: string;
  stock: bigint;
}

export interface Product {
  id: bigint;
  name: string;
  slug: string;
  description: string;
  price: bigint; // in paise (1 INR = 100 paise)
  priceInCents?: bigint; // alias for price (backend field name)
  compareAtPrice?: bigint | null;
  categoryId: bigint;
  images: string[];
  sizes: string[];
  colors: string[];
  sku: string;
  stockQuantity: bigint;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival?: boolean;
  tags: string[];
  createdAt?: bigint;
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: bigint;
  productName: string;
  productImage: string;
  price: bigint;
  quantity: bigint;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: bigint;
  totalPrice: bigint;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "paid"
  | "processing";

export interface OrderItem {
  productId: bigint;
  productName: string;
  productImage?: string;
  price: bigint;
  priceInCents?: bigint;
  quantity: bigint;
  size: string;
  color: string;
}

export interface Order {
  id: bigint;
  userId?: string;
  items: OrderItem[];
  totalPrice?: bigint;
  totalInCents?: bigint;
  status: OrderStatus;
  stripeSessionId?: string;
  shippingAddress: SavedAddress;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface SavedAddress {
  id?: string;
  fullName: string;
  line1?: string;
  line2?: string;
  street?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  addressLabel?: string;
}

export interface UserProfile {
  principal?: string;
  displayName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  savedAddresses: SavedAddress[];
  wishlist?: bigint[];
  isAdmin?: boolean;
  createdAt?: bigint;
}

export interface ProductFilters {
  categoryId?: bigint;
  minPrice?: bigint;
  maxPrice?: bigint;
  sizes?: string[];
  colors?: string[];
  search?: string;
  isFeatured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name";
}
