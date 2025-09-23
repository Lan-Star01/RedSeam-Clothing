import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cartPanelOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
      })
    );

    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
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

}
