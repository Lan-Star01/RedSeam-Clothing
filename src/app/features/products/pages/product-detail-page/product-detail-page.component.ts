import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
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
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
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
        this.selectedColor = product.available_colors[0] || '';
        this.selectedImageIndex = 0;
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
    if (this.product && index < this.product.available_colors.length) {
      this.selectedColor = this.product.available_colors[index];
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    if (this.product) {
      const colorIndex = this.product.available_colors.indexOf(color);
      if (colorIndex !== -1 && colorIndex < this.product.images.length) {
        this.selectedImageIndex = colorIndex;
      }
    }
  }

  

}
