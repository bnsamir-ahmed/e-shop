import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderHistoryService, Order } from '../services/order-history.service';

@Component({
  selector: 'app-account-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-history.component.html',
  styleUrl: './account-history.component.css'
})
export class AccountHistoryComponent {
  private orderHistoryService = inject(OrderHistoryService);

  // Expose order history signals
  orders = this.orderHistoryService.orders;
  orderCount = this.orderHistoryService.orderCount;

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get all unique products from order history
   */
  getAllProducts(): Array<{ product: any; order: Order }> {
    const products: Array<{ product: any; order: Order }> = [];
    
    this.orders().forEach(order => {
      order.items.forEach(item => {
        products.push({
          product: item.product,
          order: order
        });
      });
    });

    return products;
  }
}

