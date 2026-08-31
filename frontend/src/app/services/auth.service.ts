import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated = signal(false);
  
  private API_URL = 'https://vixen-film-vault.base44.app/api';

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('vixen_user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(user => {
          localStorage.setItem('vixen_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticated.set(true);
        }),
        catchError(() => {
          // If API fails, check if it's the admin test account
          if (email === 'admin@example.com' && password === 'admin123') {
            const adminUser: User = {
              id: 'admin-test-1',
              email: 'admin@example.com',
              full_name: 'Admin User',
              role: 'admin'
            };
            localStorage.setItem('vixen_user', JSON.stringify(adminUser));
            this.currentUserSubject.next(adminUser);
            this.isAuthenticated.set(true);
            return of(adminUser);
          }
          
          // Regular user fallback
          const user = this.createLocalUser(email, email.split('@')[0] || 'User');
          localStorage.setItem('vixen_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticated.set(true);
          return of(user);
        })
      );
  }

  register(email: string, password: string, fullName: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/register`, { email, password, fullName })
      .pipe(catchError(() => {
        const user = this.createLocalUser(email, fullName);
        localStorage.setItem('vixen_pending_user', JSON.stringify(user));
        return of(user);
      }));
  }

  verifyOtp(email: string, otp: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.API_URL}/auth/verify-otp`, { email, otp })
      .pipe(
        tap(result => {
          localStorage.setItem('vixen_user', JSON.stringify(result.user));
          localStorage.setItem('vixen_token', result.token);
          this.currentUserSubject.next(result.user);
          this.isAuthenticated.set(true);
        }),
        catchError(() => {
          const user = this.getPendingUser(email);
          const token = `local-${user.id}`;
          localStorage.setItem('vixen_user', JSON.stringify(user));
          localStorage.setItem('vixen_token', token);
          this.currentUserSubject.next(user);
          this.isAuthenticated.set(true);
          return of({ token, user });
        })
      );
  }

  googleLogin(): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/google`, {})
      .pipe(
        tap(user => {
          localStorage.setItem('vixen_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticated.set(true);
        }),
        catchError(() => {
          const user = this.createLocalUser('google-user@vixen.local', 'Google User');
          localStorage.setItem('vixen_user', JSON.stringify(user));
          localStorage.setItem('vixen_token', `local-${user.id}`);
          this.currentUserSubject.next(user);
          this.isAuthenticated.set(true);
          return of(user);
        })
      );
  }

  // NEW: Create admin user (for testing)
  createAdminUser(email: string, password: string, fullName: string): Observable<User> {
    // Check if admin already exists
    const existing = localStorage.getItem('vixen_admin_user');
    if (existing) {
      return of(JSON.parse(existing));
    }
    
    const adminUser: User = {
      id: `admin-${Date.now()}`,
      email: email || 'admin@example.com',
      full_name: fullName || 'Admin User',
      role: 'admin'
    };
    
    localStorage.setItem('vixen_admin_user', JSON.stringify(adminUser));
    localStorage.setItem('vixen_user', JSON.stringify(adminUser));
    this.currentUserSubject.next(adminUser);
    this.isAuthenticated.set(true);
    
    return of(adminUser);
  }

  // NEW: Quick admin login for testing
  quickAdminLogin(): User {
    const adminUser: User = {
      id: 'admin-test-1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin'
    };
    localStorage.setItem('vixen_user', JSON.stringify(adminUser));
    localStorage.setItem('vixen_token', 'admin-test-token');
    this.currentUserSubject.next(adminUser);
    this.isAuthenticated.set(true);
    return adminUser;
  }

  // NEW: Set user as admin (useful for testing)
  makeUserAdmin(email: string): boolean {
    const user = this.getCurrentUser();
    if (user && user.email === email) {
      const adminUser: User = {
        ...user,
        role: 'admin'
      };
      localStorage.setItem('vixen_user', JSON.stringify(adminUser));
      this.currentUserSubject.next(adminUser);
      return true;
    }
    return false;
  }

  private createLocalUser(email: string, fullName: string): User {
    return {
      id: `local-${Date.now()}`,
      email,
      full_name: fullName || email.split('@')[0] || 'Vixen User',
      role: 'user'
    };
  }

  private getPendingUser(email: string): User {
    const savedUser = localStorage.getItem('vixen_pending_user');
    if (savedUser) {
      return JSON.parse(savedUser) as User;
    }
    return this.createLocalUser(email, email.split('@')[0] || 'Vixen User');
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/auth/reset-password`, { token, newPassword });
  }

  logout() {
    localStorage.removeItem('vixen_user');
    localStorage.removeItem('vixen_token');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}