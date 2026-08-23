import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { Rental } from '../models/rental.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private API_URL = 'https://vixen-film-vault.base44.app/api';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cartCountSubject.next(this.getLocalCart().length);
  }

  getRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/rentals`)
      .pipe(catchError(() => of([...this.getLocalRentals(), ...this.getLocalCart()])));
  }

  getCartItems(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/rentals/cart`)
      .pipe(
        tap(items => this.cartCountSubject.next(items.length)),
        catchError(() => {
          const items = this.getLocalCart();
          this.cartCountSubject.next(items.length);
          return of(items);
        })
      );
  }

  addToCart(movie: Movie): Observable<Rental> {
    return this.http.post<Rental>(`${this.API_URL}/rentals/cart`, { 
      movie_id: movie.id,
      amount_paid: movie.rental_price,
      rental_duration_hours: movie.rental_duration_hours
    }).pipe(
      tap(() => this.updateCartCount()),
      catchError(() => {
        const items = this.getLocalCart();
        const existing = items.find(item => item.movie_id === movie.id);
        if (existing) return of(existing);
        const rental: Rental = {
          id: `local-rental-${Date.now()}`,
          user_id: 'local-user',
          movie_id: movie.id || `local-movie-${Date.now()}`,
          movie_title: movie.title,
          movie_poster: movie.poster_url,
          rental_start: new Date().toISOString(),
          rental_expiry: new Date(Date.now() + movie.rental_duration_hours * 3600000).toISOString(),
          status: 'cart',
          amount_paid: movie.rental_price,
          rental_duration_hours: movie.rental_duration_hours
        };
        this.saveLocalCart([...items, rental]);
        return of(rental);
      })
    );
  }

  removeFromCart(rentalId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/rentals/cart/${rentalId}`)
      .pipe(
        tap(() => this.updateCartCount()),
        catchError(() => {
          this.saveLocalCart(this.getLocalCart().filter(item => item.id !== rentalId));
          return of(void 0);
        })
      );
  }

  checkout(): Observable<Rental[]> {
    return this.http.post<Rental[]>(`${this.API_URL}/rentals/checkout`, {})
      .pipe(
        timeout(3000),
        tap(() => this.cartCountSubject.next(0)),
        catchError(() => {
          const rentals = this.getLocalCart().map(item => ({
            ...item,
            status: 'active' as const,
            rental_start: new Date().toISOString(),
            rental_expiry: new Date(Date.now() + item.rental_duration_hours * 3600000).toISOString()
          }));
          this.saveLocalRentals([...this.getLocalRentals(), ...rentals]);
          this.saveLocalCart([]);
          return of(rentals);
        })
      );
  }

  getActiveRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/rentals/active`)
      .pipe(catchError(() => of(this.getLocalRentals().filter(rental =>
        rental.status === 'active' && new Date(rental.rental_expiry).getTime() > Date.now()
      ))));
  }

  getExpiredRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/rentals/expired`)
      .pipe(catchError(() => of(this.getLocalRentals().filter(rental =>
        rental.status === 'expired' || new Date(rental.rental_expiry).getTime() <= Date.now()
      ))));
  }

  private updateCartCount() {
    this.getCartItems().subscribe(items => {
      this.cartCountSubject.next(items.length);
    });
  }

  private getLocalCart(): Rental[] {
    const savedCart = localStorage.getItem('vixen_cart');
    return savedCart ? JSON.parse(savedCart) as Rental[] : [];
  }

  private getLocalRentals(): Rental[] {
    const savedRentals = localStorage.getItem('vixen_rentals');
    return savedRentals ? JSON.parse(savedRentals) as Rental[] : [];
  }

  private saveLocalRentals(items: Rental[]) {
    localStorage.setItem('vixen_rentals', JSON.stringify(items));
  }

  private saveLocalCart(items: Rental[]) {
    localStorage.setItem('vixen_cart', JSON.stringify(items));
    this.cartCountSubject.next(items.length);
  }

  getRentalTimer(rental: Rental): string {
    const expiry = new Date(rental.rental_expiry).getTime();
    const now = new Date().getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}