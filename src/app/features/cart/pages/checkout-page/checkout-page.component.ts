import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/cart.model';
import { Subscription } from 'rxjs';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuccessModalComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  showSuccessModal = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
      })
    );
    this.cartService.refreshCart();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initializeForm(): void {
    const userStr = localStorage.getItem('user');
    let userEmail = '';

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userEmail = user.email || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [userEmail, [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
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

  onPayment(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      const checkoutPayload = {
        name: this.checkoutForm.value.firstName,
        surname: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        address: this.checkoutForm.value.address,
        zip_code: this.checkoutForm.value.zipCode,
        paymentMethod: 'credit-card'
      };

      this.cartService.checkout(checkoutPayload).subscribe({
        next: (response) => {
          this.cartService.clearCart();
          this.showSuccessModal = true;
        },
        error: (error) => {
          console.error('Checkout failed:', error);
        }
      });
    }
  }

  onModalClose(): void {
    this.showSuccessModal = false;
  }
}
