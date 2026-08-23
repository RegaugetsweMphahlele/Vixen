import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { RentalService } from '../../services/rental.service';
import { Movie } from '../../models/movie.model';
import { Rental } from '../../models/rental.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';
import { RentalTimerComponent } from '../../components/rental-timer/rental-timer.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, VixenNavComponent, RentalTimerComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <div *ngIf="movie">
        <!-- Backdrop -->
        <div class="position-relative" style="height: 384px; overflow: hidden;">
          <img [src]="movie.backdrop_url || movie.poster_url" 
               [alt]="movie.title"
               class="w-100 h-100" 
               style="object-fit: cover; object-position: center;">
          <div class="position-absolute bottom-0 start-0 w-100" 
               style="height: 60%; background: linear-gradient(to bottom, transparent, #1B1A17);">
          </div>
        </div>
        
        <!-- Content -->
        <div class="container position-relative" style="margin-top: -80px;">
          <div class="row g-4">
            <!-- Poster -->
            <div class="col-md-3">
              <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                <img [src]="movie.poster_url" 
                     [alt]="movie.title"
                     class="w-100" 
                     style="aspect-ratio: 2/3; object-fit: cover;">
              </div>
            </div>
            
            <!-- Details -->
            <div class="col-md-9">
              <h1 class="font-display fw-light text-white" style="font-size: clamp(2.5rem, 4vw, 3.5rem);">
                {{ movie.title }}
              </h1>
              
              <div class="d-flex flex-wrap gap-3 align-items-center text-white-50 mb-3">
                <span style="color: #D9A441;">★ {{ movie.rating || 'N/A' }}</span>
                <span>{{ movie.year }}</span>
                <span>{{ movie.duration_minutes || 'N/A' }} min</span>
                <span class="badge" style="background: #2F4438; color: #F5EEE1; padding: 0.4rem 1rem;">{{ movie.genre }}</span>
                <span class="badge" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #F5EEE1; padding: 0.4rem 1rem;">{{ movie.age_rating || 'PG' }}</span>
              </div>
              
              <p class="text-white-50" style="max-width: 600px; line-height: 1.8;">{{ movie.description || 'No description available.' }}</p>
              
              <div class="mt-3">
                <p><strong class="text-white">Director:</strong> <span class="text-white-50">{{ movie.director || 'Unknown' }}</span></p>
                <p><strong class="text-white">Cast:</strong> <span class="text-white-50">{{ movie.cast || 'Not specified' }}</span></p>
              </div>
              
              <!-- Rental Box -->
              <div class="card-vixen p-4 mt-4" style="max-width: 400px; background: rgba(47,68,56,0.4); border: 1px solid rgba(245,238,225,0.08);">
                <div *ngIf="userRental && userRental.status === 'active'">
                  <h4 class="text-white mb-2">🎬 Currently Renting</h4>
                  <app-rental-timer [rental]="userRental"></app-rental-timer>
                  <button class="btn btn-rust w-100 mt-3 py-2" style="border-radius: 9999px;">
                    <i class="bi bi-play-fill"></i> Watch Now
                  </button>
                </div>
                
                <div *ngIf="userRental && userRental.status === 'cart'">
                  <h4 class="text-white mb-2">🛒 In Cart</h4>
                  <p class="text-white-50">This film is in your cart. Proceed to checkout.</p>
                  <button class="btn btn-outline-light w-100 mt-2 py-2" routerLink="/cart" style="border-radius: 9999px;">
                    View Cart
                  </button>
                </div>
                
                <div *ngIf="!userRental || userRental.status === 'expired'">
                  <div class="d-flex align-items-baseline gap-3 mb-2">
                    <span class="font-display fw-light" style="font-size: 2.5rem; color: #BB5F3A;">
                      R{{ movie.rental_price.toFixed(2) }}
                    </span>
                    <span class="text-white-50" style="font-size: 0.9rem;">{{ movie.rental_duration_hours || 48 }}h access</span>
                  </div>
                  <p class="text-white-50 small">Rent for {{ movie.rental_duration_hours || 48 }} hours. Watch anytime.</p>
                  <button class="btn btn-rust w-100 mt-2 py-2" (click)="addToCart()" style="border-radius: 9999px;">
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-vixen {
      border-radius: 16px;
    }
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .btn-rust:hover {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .btn-outline-light {
      border-color: rgba(255,255,255,0.2);
      color: #F5EEE1;
      transition: all 0.2s ease;
    }
    .btn-outline-light:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.4);
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  userRental: Rental | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private rentalService: RentalService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadMovie(id);
    }
  }

  loadMovie(id: string) {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loadUserRental();
      },
      error: () => {
        // Load sample movie if API fails
        this.movie = this.getSampleMovie(id);
        this.loadUserRental();
      }
    });
  }

  getSampleMovie(id: string): Movie {
    return {
      id: id,
      title: 'The Astral Frontier',
      director: 'Sofia Reyes',
      genre: 'Sci-Fi',
      year: 2024,
      rating: 4.3,
      rental_price: 45,
      rental_duration_hours: 48,
      is_featured: true,
      age_rating: 'PG-13',
      description: 'A journey beyond the stars. When humanity discovers a gateway to another dimension, a team of explorers must venture into the unknown.',
      duration_minutes: 120,
      poster_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
      backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
      cast: 'Sofia Reyes, John Smith, Emma Watson'
    };
  }

  loadUserRental() {
    if (!this.movie) return;
    this.rentalService.getRentals().subscribe(rentals => {
      this.userRental = rentals.find(r => r.movie_id === this.movie?.id) || null;
    });
  }

  addToCart() {
    if (this.movie) {
      this.rentalService.addToCart(this.movie).subscribe(() => {
        this.loadUserRental();
      });
    }
  }
}