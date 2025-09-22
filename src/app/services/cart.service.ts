import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../home/modal/products.modal';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'ecommerce_cart';

  // Private signal for cart items
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // Public computed signals
  public readonly items = computed(() => this.cartItems());
  public readonly itemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  public readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.CART_KEY) {
        this.cartItems.set(this.loadCartFromStorage());
      }
    });
  }

  /**
   * Add a product to the cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity };
      this.cartItems.set([...currentItems, newItem]);
    }

    this.saveCartToStorage();
  }

  /**
   * Remove a product from the cart
   */
  removeFromCart(productId: number): void {
    const currentItems = this.cartItems();
    const filteredItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.set(filteredItems);
    this.saveCartToStorage();
  }

  /**
   * Update quantity of a specific product in the cart
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  /**
   * Check if a product is in the cart
   */
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  /**
   * Get quantity of a specific product in the cart
   */
  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Clear the entire cart
   */
  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): CartItem[] {
    try {
      const cartData = localStorage.getItem(this.CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  /**
   * Save cart to localStorage
   */
  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
}
