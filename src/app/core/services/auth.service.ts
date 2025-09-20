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
      this.currentUserSubject.next(JSON.parse(user));
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
    avatar: string;
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

  setUser(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
}
