import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent implements OnInit, OnDestroy {
  isOpen = false;
  cartItems: CartItem[] = [];
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cartPanelOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.isLoading = true;
        }
      })
    );

    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closePanel(): void {
    this.cartService.closeCartPanel();
  }

  removeItem(productId: number): void {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateProductInCart(productId, { quantity }).subscribe({
      next: () => {
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getItemsSubtotal(): number {

    return this.cartItems.reduce((total, item) => total + item.total_price, 0);
  }

  getGrandTotal(): number {
    const deliveryFee = 5;
    return this.getItemsSubtotal() + deliveryFee;
  }

  goToCheckout(): void {
    this.cartService.closeCartPanel();
    this.router.navigate(['/checkout']);
  }

}
