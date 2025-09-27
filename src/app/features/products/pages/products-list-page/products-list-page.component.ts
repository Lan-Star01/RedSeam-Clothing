import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './products-list-page.component.html',
  styleUrl: './products-list-page.component.css'
})
export class ProductsListPageComponent implements OnInit {
  products: any[] = [];
  loading = false;

  currentPage = 1;
  lastPage = 1;
  total = 0;
  perPage = 10;
  hasNextPage = false;
  hasPrevPage = false;

  sortBy = '';
  priceFrom: number | null = null;
  priceTo: number | null = null;
  priceFilterApplied = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    const filters: any = { page: this.currentPage };

    if (this.sortBy) {
      filters.sort = this.sortBy;
    }

    if (this.priceFrom !== null) {
      filters.priceFrom = this.priceFrom;
    }

    if (this.priceTo !== null) {
      filters.priceTo = this.priceTo;
    }

    this.productService.getProducts(filters).subscribe({
      next: (res: any) => {
        this.products = res.data || res;

        this.currentPage = res.meta.current_page;
        this.lastPage = res.meta.last_page;
        this.total = res.meta.total;
        this.perPage = res.meta.per_page;
        this.hasNextPage = !!res.links.next;
        this.hasPrevPage = !!res.links.prev;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onProductClick(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  onPreviousPage(): void {
    if (this.hasPrevPage) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  getVisiblePages(): (number | string)[] {
    if (this.lastPage <= 5) {
      const pages: number[] = [];
      for (let i = 1; i <= this.lastPage; i++) {
        pages.push(i);
      }
      return pages;
    }

    const pages: (number | string)[] = [];

    if (this.currentPage === 1) {
      pages.push(1, 2, '...', this.lastPage - 1, this.lastPage);
    } else 
    if (this.currentPage >= this.lastPage - 1) {
      pages.push(1, 2, '...', this.lastPage - 1, this.lastPage);
    } else {
      pages.push(this.currentPage, this.currentPage + 1, '...', this.lastPage - 1, this.lastPage);
    }

    return pages;
  }

  onPageButtonClick(page: number | string): void {
    if (typeof page === 'number') {
      this.onPageChange(page);
    }
  }

  setSorting(sortValue: string): void {
    this.sortBy = sortValue;
    this.currentPage = 1;
    this.loadProducts();
  }

  getSortDisplayText(): string {
    switch(this.sortBy) {
      case '-created_at': return 'New products first';
      case 'price': return 'Price, low to high';
      case '-price': return 'Price, high to low';
      default: return 'Sort by';
    }
  }

  onPriceFilterChange(): void {
    this.priceFilterApplied = true;
    this.currentPage = 1;
    this.loadProducts();
  }

  clearPriceFilter(): void {
    this.priceFrom = null;
    this.priceTo = null;
    this.priceFilterApplied = false;
    this.currentPage = 1;
    this.loadProducts();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}

