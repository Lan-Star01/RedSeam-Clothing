import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductDetail } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent implements OnInit {
  product: ProductDetail | null = null;
  loading = false;
  selectedImageIndex = 0;
  selectedColor = '';
  selectedSize = '';
  selectedQuantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedColor = product.available_colors && product.available_colors.length > 0 ? product.available_colors[0] : '';
        this.selectedSize = product.available_sizes && product.available_sizes.length > 0 ? product.available_sizes[0] : '';
        this.selectedImageIndex = 0;
        this.selectedQuantity = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    if (this.product && this.product.available_colors && index < this.product.available_colors.length) {
      this.selectedColor = this.product.available_colors[index];
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    if (this.product && this.product.available_colors) {
      const colorIndex = this.product.available_colors.indexOf(color);
      if (colorIndex !== -1 && this.product.images && colorIndex < this.product.images.length) {
        this.selectedImageIndex = colorIndex;
      }
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  getQuantityOptions(): number[] {
    if (!this.product || !this.product.quantity || this.product.quantity <= 0) return [1];
    const maxQuantity = this.product.quantity;
    const options: number[] = [];
    for (let i = 1; i <= maxQuantity; i++) {
      options.push(i);
    }
    return options;
  }

  selectQuantity(quantity: number): void {
    this.selectedQuantity = quantity;
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.selectedColor || !this.selectedSize) {
      alert('Please select color and size');
      return;
    }

    const payload = {
      quantity: this.selectedQuantity,
      size: this.selectedSize,
      color: this.selectedColor
    };

    this.cartService.addProductToCart(this.product.id, payload).subscribe({
      next: (response) => {
        console.log('Product added to cart successfully:', response);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }

}
