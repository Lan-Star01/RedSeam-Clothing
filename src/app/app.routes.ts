import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/pages/products-list-page/products-list-page.component').then(
        (m) => m.ProductsListPageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/pages/product-detail-page/product-detail-page.component').then(
        (m) => m.ProductDetailPageComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/cart/pages/checkout-page/checkout-page.component').then(
        (m) => m.CheckoutPageComponent
      ),
  },
];
