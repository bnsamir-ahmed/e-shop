import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from './cart.service';
import { Product } from '../home/modal/products.modal';

export interface Order {
  id: string;
  orderDate: string;
  items: CartItem[];
  totalPrice: number;
  shippingInfo: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  status: 'completed' | 'pending' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private readonly ORDER_HISTORY_KEY = 'ecommerce_order_history';

  // Private signal for order history
  private orderHistory = signal<Order[]>(this.loadOrdersFromStorage());

  // Public computed signals
  public readonly orders = computed(() => this.orderHistory());
  public readonly orderCount = computed(() => this.orderHistory().length);

  constructor() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.ORDER_HISTORY_KEY) {
        this.orderHistory.set(this.loadOrdersFromStorage());
      }
    });
  }

  /**
   * Add a new order to history
   */
  addOrder(items: CartItem[], shippingInfo: Order['shippingInfo']): void {
    const newOrder: Order = {
      id: this.generateOrderId(),
      orderDate: new Date().toISOString(),
      items: [...items],
      totalPrice: items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      shippingInfo: { ...shippingInfo },
      status: 'completed'
    };

    const currentOrders = this.orderHistory();
    this.orderHistory.set([newOrder, ...currentOrders]);
    this.saveOrdersToStorage();
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Order | undefined {
    return this.orderHistory().find(order => order.id === orderId);
  }

  /**
   * Get all products from order history
   */
  getAllOrderedProducts(): Product[] {
    const allProducts: Product[] = [];
    const productMap = new Map<number, Product>();

    this.orderHistory().forEach(order => {
      order.items.forEach(item => {
        if (!productMap.has(item.product.id)) {
          productMap.set(item.product.id, item.product);
          allProducts.push(item.product);
        }
      });
    });

    return allProducts;
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Load orders from localStorage
   */
  private loadOrdersFromStorage(): Order[] {
    try {
      const ordersData = localStorage.getItem(this.ORDER_HISTORY_KEY);
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      return [];
    }
  }

  /**
   * Save orders to localStorage
   */
  private saveOrdersToStorage(): void {
    try {
      localStorage.setItem(this.ORDER_HISTORY_KEY, JSON.stringify(this.orderHistory()));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }
}

