import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { OperatorFunction } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: any;
  loading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    const hasFieldError = !!(field && field.invalid && (field.dirty || field.touched));

    if (fieldName === 'password' && this.error) {
      return true;
    }

    return hasFieldError;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid email';
      if (field.errors['minlength']) {
        if (fieldName === 'email') return 'Email must contain at least 3 characters';
        if (fieldName === 'password') return 'Password must contain at least 3 characters';
      }
    }

    if (fieldName === 'password' && this.error) {
      return this.error;
    }

    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email!, password!)
      .pipe(
        tap({
          next: (user) => {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          },
          error: () => {
            this.error = 'Invalid email or password';
            this.loading = false;
          },
        })
      )
      .subscribe();
  }
}
