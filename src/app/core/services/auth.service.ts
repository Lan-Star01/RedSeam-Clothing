import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      this.currentUserSubject.next({
        user: {
          id: userData.id,
          name: userData.username,
          email: userData.email,
          profile_photo: userData.avatar
        },
        token: token
      });
    }
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.api.post<User>('login', { email, password });
  }

  register(payload: {
    avatar: File | null;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }): Observable<User> {
    const formData = new FormData();
    if (payload.avatar) {
      formData.append('avatar', payload.avatar);
    }
    formData.append('email', payload.email);
    formData.append('password', payload.password);
    formData.append('password_confirmation', payload.confirmPassword);
    formData.append('username', payload.name);


    return this.api.post<User>('register', formData);
  }

  setUser(user: any, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

}
