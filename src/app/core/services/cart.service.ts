import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartPanelOpenSubject = new BehaviorSubject<boolean>(false);
  public cartPanelOpen$ = this.cartPanelOpenSubject.asObservable();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private api: ApiService) {}

  addProductToCart(productId: number, payload: { quantity: number; size: string; color: string }): Observable<CartItem> {
    return this.api.post<CartItem>(`cart/products/${productId}`, payload);
  }

  updateProductInCart(productId: number, payload: { quantity: number }): Observable<CartItem> {
    return this.api.patch<CartItem>(`cart/products/${productId}`, payload);
  }

  removeProductFromCart(productId: number): Observable<void> {
    return this.api.delete<void>(`cart/products/${productId}`);
  }

  getCart(): Observable<CartItem[]> {
    return this.api.get<CartItem[]>('cart');
  }

  checkout(payload: { address: string; paymentMethod: string }): Observable<any> {
    return this.api.post<any>('cart/checkout', payload);
  }

  openCartPanel(): void {
    this.cartPanelOpenSubject.next(true);
    this.refreshCart();
  }

  closeCartPanel(): void {
    this.cartPanelOpenSubject.next(false);
  }

  toggleCartPanel(): void {
    const isOpen = this.cartPanelOpenSubject.value;
    if (isOpen) {
      this.closeCartPanel();
    } else {
      this.openCartPanel();
    }
  }

  refreshCart(): void {
    this.getCart().subscribe({
      next: (items) => {
        this.cartItemsSubject.next(items);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }

  get isCartPanelOpen(): boolean {
    return this.cartPanelOpenSubject.value;
  }

  get cartItemsCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

}
