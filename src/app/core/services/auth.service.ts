import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

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
}
