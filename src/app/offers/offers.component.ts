import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home/home-service/home.service';
import { Product } from '../home/modal/products.modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subject, takeUntil } from 'rxjs';

export interface ProductWithDiscount extends Product {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    NzCardModule,
    NzSpinModule,
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit, OnDestroy {
  private service = inject(HomeService);
  private router = inject(Router);
  private $destroy = new Subject<void>();

  products = signal<ProductWithDiscount[]>([]);
  isLoading = signal<boolean>(false);
  readonly discountPercentage = 10;

  ngOnInit(): void {
    this.loadOffers();
  }

  private loadOffers(): void {
    this.isLoading.set(true);
    
    this.service.getAllPosts()
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (allProducts) => {
          // Apply 10% discount to products
          const productsWithDiscount: ProductWithDiscount[] = allProducts
            .slice(0, 20) // Show first 20 products as offers
            .map(product => ({
              ...product,
              originalPrice: product.price,
              discountedPrice: this.calculateDiscountedPrice(product.price),
              discountPercentage: this.discountPercentage,
            }));

          this.products.set(productsWithDiscount);
          
          setTimeout(() => {
            this.isLoading.set(false);
          }, 300);
        },
        error: (error) => {
          console.error('Error fetching offers:', error);
          this.isLoading.set(false);
          this.products.set([]);
        },
      });
  }

  private calculateDiscountedPrice(originalPrice: number): number {
    return Math.round(originalPrice * (1 - this.discountPercentage / 100) * 100) / 100;
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}

