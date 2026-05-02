import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: ProductId;
    categoryId: CategoryId;
    name: string;
    createdAt: Timestamp;
    isNewArrival: boolean;
    description: string;
    variants: Array<ProductVariant>;
    isFeatured: boolean;
    compareAtPrice?: bigint;
    priceInCents: bigint;
    images: Array<ExternalBlob>;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    color: string;
    size: string;
    productId: ProductId;
    productName: string;
    quantity: bigint;
    priceInCents: bigint;
}
export interface UpdateProductInput {
    id: ProductId;
    categoryId: CategoryId;
    name: string;
    isNewArrival: boolean;
    description: string;
    variants: Array<ProductVariant>;
    isFeatured: boolean;
    compareAtPrice?: bigint;
    priceInCents: bigint;
    images: Array<ExternalBlob>;
}
export interface SavedAddress {
    street: string;
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
    addressLabel: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreateOrderInput {
    shippingAddress: ShippingAddress;
    stripeSessionId?: string;
}
export interface Cart {
    totalInCents: bigint;
    items: Array<CartItem>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Category {
    id: CategoryId;
    name: string;
    createdAt: Timestamp;
    slug: string;
    description: string;
    parentId?: CategoryId;
}
export interface ShippingAddress {
    street: string;
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
}
export interface ProductVariant {
    color: string;
    size: string;
    stock: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ProductFilter {
    categoryId?: CategoryId;
    inStockOnly: boolean;
    color?: string;
    size?: string;
    maxPriceInCents?: bigint;
    searchQuery?: string;
    minPriceInCents?: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    subtotalInCents: bigint;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    totalInCents: bigint;
    shippingAddress: ShippingAddress;
    buyer: Principal;
    items: Array<OrderItem>;
    stripeSessionId?: string;
    shippingInCents: bigint;
}
export interface CreateProductInput {
    categoryId: CategoryId;
    name: string;
    isNewArrival: boolean;
    description: string;
    variants: Array<ProductVariant>;
    isFeatured: boolean;
    compareAtPrice?: bigint;
    priceInCents: bigint;
    images: Array<ExternalBlob>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export type CartItemId = bigint;
export interface CartItem {
    id: CartItemId;
    color: string;
    size: string;
    productId: ProductId;
    quantity: bigint;
    priceInCents: bigint;
}
export type OrderId = bigint;
export interface UserProfile {
    displayName: string;
    createdAt: Timestamp;
    savedAddresses: Array<SavedAddress>;
    email: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSavedAddress(address: SavedAddress): Promise<boolean>;
    addToCart(productId: ProductId, size: string, color: string, quantity: bigint): Promise<CartItemId>;
    addToWishlist(productId: ProductId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCategory(name: string, slug: string, description: string, parentId: CategoryId | null): Promise<Category>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    createProduct(input: CreateProductInput): Promise<Product>;
    deleteCategory(id: CategoryId): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getCategories(): Promise<Array<Category>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getMyOrders(): Promise<Array<Order>>;
    getNewArrivals(): Promise<Array<Product>>;
    getOrder(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<ProductId>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromCart(itemId: CartItemId): Promise<boolean>;
    removeFromWishlist(productId: ProductId): Promise<void>;
    removeSavedAddress(addressLabel: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(filter: ProductFilter): Promise<Array<Product>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(itemId: CartItemId, quantity: bigint): Promise<boolean>;
    updateCategory(id: CategoryId, name: string, slug: string, description: string, parentId: CategoryId | null): Promise<boolean>;
    updateOrderStatus(id: OrderId, status: OrderStatus): Promise<boolean>;
    updateOrderStripeSession(id: OrderId, sessionId: string): Promise<boolean>;
    updateProduct(input: UpdateProductInput): Promise<boolean>;
}
