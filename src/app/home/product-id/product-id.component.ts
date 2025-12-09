import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../modal/products.modal';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-id',
  imports: [CommonModule],
  templateUrl: './product-id.component.html',
  styleUrl: './product-id.component.css'
})
export class ProductIdComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  id = signal<string | null>(null);

  // Computed properties for cart state
  isInCart = computed(() => {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.isInCart(currentProduct.id) : false;
  });

  cartQuantity = computed(() => {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.getProductQuantity(currentProduct.id) : 0;
  });

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    this.product.set(this.route.snapshot.data['product']);
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct, 1);
    }
  }

  /**
   * Remove product from cart
   */
  removeFromCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.removeFromCart(currentProduct.id);
    }
  }

  /**
   * Update product quantity in cart
   */
  updateQuantity(quantity: number): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.updateQuantity(currentProduct.id, quantity);
    }
  }

  /**
   * Add product to cart and navigate to cart page
   */
  buyNow(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      // Add to cart if not already in cart
      if (!this.isInCart()) {
        this.cartService.addToCart(currentProduct, 1);
      }
      // Navigate to cart page
      this.router.navigate(['/cart']);
    }
  }
}
