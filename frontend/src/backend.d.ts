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
export type Time = bigint;
export interface CartItem {
    name: string;
    productId: string;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: string;
    user: Principal;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    rating: bigint;
    image: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCartItem(productsToAdd: Array<CartItem>): Promise<void>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getMyOrders(): Promise<Array<Order>>;
    getOrders(user: Principal): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(totalAmount: bigint): Promise<boolean>;
    removeCartItem(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchText: string): Promise<Array<Product>>;
    updateCartItemQuantity(productId: string, quantity: bigint): Promise<void>;
    updateProduct(product: Product): Promise<boolean>;
}
