import { Component, inject, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { HomeService } from '../home-service/home.service';
import { Product } from '../modal/products.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { debounce, debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


interface QueryParam {
  page: number;
  pageSize: number;
  title: string;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NzCardModule,
    NzInputModule,
    NzSpinModule,
    FormsModule,
    NzPaginationModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private service = inject(HomeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  // Pagination state
  pagination = signal<PaginationState>({
    currentPage: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 0
  });

  public title = signal<string>('');
  public $filter = new Subject<QueryParam>();
  public $destroy = new Subject<void>();

  search = '';

  // Page size options
  readonly pageSizeOptions = [5, 10, 20, 50];
  readonly defaultPageSize = 12;

  ngOnInit(): void {
    console.log('Component initialized');
    this.initializePagination();
    this.setupQueryParamsListener();
    this.setupFilterListener();
  }

  private initializePagination(): void {
    this.isLoading.set(true);
    this.loadProducts();
  }

  private setupQueryParamsListener(): void {
    this.route.queryParamMap
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.$destroy)
      )
      .subscribe((params) => {
        const page = parseInt(params.get('page') || '1', 12);
        const pageSize = parseInt(params.get('pageSize') || this.defaultPageSize.toString(), 12);
        const title = params.get('title') || '';

        this.title.set(title);
        this.updatePaginationState({ currentPage: page, pageSize });
        this.loadProducts();
      });
  }

  private setupFilterListener(): void {
    this.$filter
      .pipe(debounceTime(300), takeUntil(this.$destroy))
      .subscribe(() => this.loadProducts());
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    const title = this.title();
    const { currentPage, pageSize } = this.pagination();

    // Calculate offset for server-side pagination
    const offset = (currentPage - 1) * pageSize;

    const subscription = title
      ? this.service.getAllPosts({ title })
      : this.service.getAllPosts();

    subscription.subscribe({
      next: (allProducts) => {
        // For client-side pagination (since service doesn't support server-side)
        const startIndex = offset;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        this.products.set(paginatedProducts);
        this.updatePaginationState({
          totalItems: allProducts.length,
          totalPages: Math.ceil(allProducts.length / pageSize)
        });

        setTimeout(() => {
          this.isLoading.set(false);
        }, 300);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading.set(false);
        this.products.set([]);
      },
    });
  }

  private updatePaginationState(updates: Partial<PaginationState>): void {
    this.pagination.update(current => ({
      ...current,
      ...updates
    }));
  }

  onSearchSubmit(searchTerm: string): void {
    this.title.set(searchTerm);
    this.updatePaginationState({ currentPage: 1 }); // Reset to first page on search

    this.updateUrlAndTriggerFilter();
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  onPageChange(pageIndex: number): void {
    this.updatePaginationState({ currentPage: pageIndex });
    this.updateUrlAndTriggerFilter();
  }

  onPageSizeChange(pageSize: number): void {
    this.updatePaginationState({
      pageSize,
      currentPage: 1 // Reset to first page when changing page size
    });
    this.updateUrlAndTriggerFilter();
  }

  private updateUrlAndTriggerFilter(): void {
    const { currentPage, pageSize } = this.pagination();
    const queryParams: QueryParam = {
      page: currentPage,
      pageSize,
      title: this.title(),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });

    this.$filter.next(queryParams);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
