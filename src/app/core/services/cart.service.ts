import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

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
}
