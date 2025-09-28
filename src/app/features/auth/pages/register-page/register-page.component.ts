import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../../core/models/user.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  registerForm: any;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      avatar: [null]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length === 0 ? null : errors);
      }
      return null;
    }
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    fileInput?.click();
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ avatar: file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.avatarPreview = null;
    this.registerForm.patchValue({ avatar: null });

    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    const hasFieldError = !!(field && field.invalid && (field.dirty || field.touched));

    if (fieldName === 'confirmPassword' && this.error) {
      return true;
    }

    return hasFieldError;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid email';
      if (field.errors['minlength']) {
        if (fieldName === 'username') return 'Username must contain at least 3 characters';
        if (fieldName === 'password') return 'Password must contain at least 3 characters';
      }
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }

    if (fieldName === 'confirmPassword' && this.error) {
      return this.error;
    }

    return '';
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    const formData = new FormData();
    const formValue = this.registerForm.value;

    formData.append('name', formValue.username);
    formData.append('email', formValue.email);
    formData.append('password', formValue.password);
    formData.append('password_confirmation', formValue.confirmPassword);

    if (formValue.avatar) {
      formData.append('avatar', formValue.avatar);
    }

    this.authService
      .register({
        name: formValue.username,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        avatar: formValue.avatar
      })
      .pipe(
        tap({
          next: (user) => {
            this.authService.setUser(user.user, user.token);
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            this.error = error.error?.message || 'Registration failed. Please try again.';
            this.loading = false;
          },
        })
      )
      .subscribe();
  }
}
