import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { RentalService } from '../../services/rental.service';
import { Movie } from '../../models/movie.model';
import { Rental } from '../../models/rental.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, VixenNavComponent, MovieCardComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <!-- Featured Hero -->
      <div *ngIf="featuredMovie" class="position-relative" style="height: 70vh; min-height: 400px; overflow: hidden;">
        <img [src]="featuredMovie.backdrop_url || featuredMovie.poster_url" 
             [alt]="featuredMovie.title"
             class="w-100 h-100" 
             style="object-fit: cover; object-position: center;"
             (error)="handleImageError($event)">
        <div class="position-absolute top-0 start-0 w-100 h-100" 
             style="background: linear-gradient(to right, rgba(27,26,23,0.85) 30%, transparent 70%);">
        </div>
        
        <div class="position-absolute top-50 start-0 translate-middle-y p-5" style="max-width: 600px; z-index: 2;">
          <span class="text-uppercase" style="color: #8B9A82; font-size: 0.8rem; letter-spacing: 0.15em;">Featured Film</span>
          <h1 class="font-display fw-light text-white" style="font-size: clamp(2.5rem, 5vw, 4rem);">
            {{ featuredMovie.title }}
          </h1>
          <div class="d-flex flex-wrap gap-3 text-white-50 mb-3">
            <span>★ {{ featuredMovie.rating || 'N/A' }}</span>
            <span>{{ featuredMovie.year }}</span>
            <span>{{ featuredMovie.genre }}</span>
            <span>{{ featuredMovie.duration_minutes || 'N/A' }} min</span>
          </div>
          <p class="text-white-50" style="max-width: 400px; line-height: 1.6;">{{ featuredMovie.description || 'No description available.' }}</p>
          <div class="d-flex flex-wrap gap-3 mt-3">
            <button class="btn btn-rust" (click)="handleFeaturedAction(featuredMovie)">
              {{ getFeaturedButtonText(featuredMovie) }}
            </button>
            <button class="btn btn-outline-light" [routerLink]="['/movie', featuredMovie.id]">
              More Info
            </button>
          </div>
        </div>
      </div>
      
      <!-- Search & Filter -->
      <div class="sticky-top" style="background: #1B1A17; padding: 1rem 0; z-index: 100; top: 72px; border-bottom: 1px solid rgba(245,238,225,0.06);">
        <div class="container">
          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <div class="position-relative">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50"></i>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary ps-5" 
                       [(ngModel)]="searchTerm" 
                       (ngModelChange)="filterMovies()"
                       placeholder="Search films..."
                       style="border-radius: 9999px; padding: 10px 20px 10px 45px; border-color: rgba(245,238,225,0.15);">
              </div>
            </div>
            <div class="col-md-8">
              <div class="d-flex gap-2 overflow-auto pb-2" style="scrollbar-width: none; -ms-overflow-style: none;">
                <button *ngFor="let genre of genres" 
                        class="btn btn-sm rounded-pill px-3 py-1"
                        [ngClass]="selectedGenre === genre ? 'btn-rust' : 'btn-outline-secondary text-white'"
                        (click)="selectGenre(genre)"
                        style="white-space: nowrap; transition: all 0.3s ease;">
                  {{ genre }}
                </button>
                <button class="btn btn-sm rounded-pill px-3 py-1" 
                        [ngClass]="!selectedGenre ? 'btn-rust' : 'btn-outline-secondary text-white'"
                        (click)="clearFilters()"
                        style="white-space: nowrap; transition: all 0.3s ease;">
                  All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Results Count -->
      <div class="container py-3">
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-white-50" style="font-size: 0.9rem;">
            Showing <strong class="text-white">{{ filteredMovies.length }}</strong> films
          </span>
          <span *ngIf="searchTerm" class="text-sage" style="font-size: 0.9rem;">
            Searching for: "{{ searchTerm }}"
          </span>
        </div>
      </div>
      
      <!-- Movie Grid -->
      <div class="container py-3">
        <div *ngIf="filteredMovies.length === 0" class="text-center py-5">
          <i class="bi bi-film text-white-50" style="font-size: 4rem;"></i>
          <h3 class="text-white mt-3">No films found</h3>
          <p class="text-white-50">Try adjusting your search or filters.</p>
          <button class="btn btn-rust mt-2" (click)="clearFilters()">Clear all filters</button>
        </div>
        
        <div class="row g-4">
          <div class="col-6 col-md-4 col-lg-3 col-xl-2-4" 
               *ngFor="let movie of filteredMovies">
            <app-movie-card 
              [movie]="movie" 
              [userRental]="getUserRental(movie.id!)"
              (actionClick)="handleCardAction($event)">
            </app-movie-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      border-radius: 9999px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn-rust:hover {
      transform: scale(1.05);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .btn-rust:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-outline-secondary {
      border: 1px solid rgba(245,238,225,0.15);
      color: #8B9A82;
      background: transparent;
      transition: all 0.3s ease;
    }
    .btn-outline-secondary:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(245,238,225,0.3);
      color: #F5EEE1;
    }
    .col-xl-2-4 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    @media (max-width: 1200px) {
      .col-xl-2-4 {
        flex: 0 0 25%;
        max-width: 25%;
      }
    }
    @media (max-width: 992px) {
      .col-xl-2-4 {
        flex: 0 0 33.333%;
        max-width: 33.333%;
      }
    }
    @media (max-width: 768px) {
      .col-xl-2-4 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    @media (max-width: 576px) {
      .col-xl-2-4 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    ::-webkit-scrollbar {
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: #BB5F3A;
      border-radius: 2px;
    }
  `]
})
export class BrowseComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  featuredMovie: Movie | null = null;
  rentals: Rental[] = [];
  searchTerm = '';
  selectedGenre = '';
  genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Horror', 
            'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Fantasy', 'Crime'];

  // Sample movies for when API is not available
  private sampleMovies: Movie[] = [
    { id: '1', title: 'The Astral Frontier', director: 'Sofia Reyes', genre: 'Sci-Fi', year: 2024, rating: 4.3, rental_price: 45, description: 'A journey beyond the stars. When humanity discovers a gateway to another dimension.', duration_minutes: 120, poster_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80', cast: 'Sofia Reyes, John Smith', rental_duration_hours: 48, is_featured: true, age_rating: 'PG-13' },
    { id: '2', title: 'Oppenheimer', director: 'Christopher Nolan', genre: 'Drama', year: 2023, rating: 4.8, rental_price: 55, description: 'The man behind the bomb. A gripping story of science and consequence.', duration_minutes: 180, poster_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80', cast: 'Cillian Murphy, Emily Blunt', rental_duration_hours: 72, is_featured: false, age_rating: 'R' },
    { id: '3', title: 'Dune: Part Two', director: 'Denis Villeneuve', genre: 'Sci-Fi', year: 2024, rating: 4.7, rental_price: 50, description: 'The epic continues. Paul Atreides\' journey on Arrakis reaches new heights.', duration_minutes: 166, poster_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=80', cast: 'Timothée Chalamet, Zendaya', rental_duration_hours: 72, is_featured: false, age_rating: 'PG-13' },
    { id: '4', title: 'Past Lives', director: 'Celine Song', genre: 'Romance', year: 2023, rating: 4.7, rental_price: 40, description: 'A love story across time and continents. A tale of connection and fate.', duration_minutes: 105, poster_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80', cast: 'Greta Lee, Teo Yoo', rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13' },
    { id: '5', title: 'Poor Things', director: 'Yorgos Lanthimos', genre: 'Comedy', year: 2023, rating: 4.2, rental_price: 45, description: 'A fantastical tale of discovery. A woman\'s journey through a world of wonder.', duration_minutes: 141, poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80', cast: 'Emma Stone, Mark Ruffalo', rental_duration_hours: 48, is_featured: false, age_rating: 'R' },
    { id: '6', title: 'Killers of the Flower Moon', director: 'Martin Scorsese', genre: 'Crime', year: 2023, rating: 4.5, rental_price: 55, description: 'A true crime epic. A story of greed, murder, and justice.', duration_minutes: 206, poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80', cast: 'Leonardo DiCaprio, Robert De Niro', rental_duration_hours: 72, is_featured: false, age_rating: 'R' },
    { id: '7', title: 'Inside Out 2', director: 'Kelsey Mann', genre: 'Animation', year: 2024, rating: 4.5, rental_price: 35, description: 'The emotions are back! A new adventure inside the mind of a teenager.', duration_minutes: 96, poster_url: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=1200&q=80', cast: 'Amy Poehler, Maya Hawke', rental_duration_hours: 48, is_featured: false, age_rating: 'PG' },
    { id: '8', title: 'A Quiet Place: Day One', director: 'Michael Sarnoski', genre: 'Horror', year: 2024, rating: 4.0, rental_price: 40, description: 'The origin of the silence. How it all began in New York City.', duration_minutes: 100, poster_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1200&q=80', cast: 'Lupita Nyong\'o, Joseph Quinn', rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13' },
    { id: '9', title: 'Civil War', director: 'Alex Garland', genre: 'Thriller', year: 2024, rating: 4.2, rental_price: 45, description: 'A war on American soil. Journalists race to capture the truth.', duration_minutes: 109, poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80', cast: 'Kirsten Dunst, Wagner Moura', rental_duration_hours: 48, is_featured: false, age_rating: 'R' },
    { id: '10', title: 'Challengers', director: 'Luca Guadagnino', genre: 'Drama', year: 2024, rating: 4.3, rental_price: 45, description: 'A tennis love triangle. Passion, competition, and ambition on and off the court.', duration_minutes: 131, poster_url: 'https://images.unsplash.com/photo-1461696114087-397271a7aedc?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1461696114087-397271a7aedc?w=1200&q=80', cast: 'Zendaya, Josh O\'Connor', rental_duration_hours: 48, is_featured: false, age_rating: 'R' }
  ];

  constructor(
    private movieService: MovieService,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        if (movies && movies.length > 0) {
          this.movies = movies;
          this.filteredMovies = movies;
          this.featuredMovie = movies.find(m => m.is_featured) || movies[0] || null;
        } else {
          this.useSampleMovies();
        }
      },
      error: () => {
        this.useSampleMovies();
      }
    });

    this.rentalService.getRentals().subscribe({
      next: (rentals) => {
        this.rentals = rentals;
      },
      error: () => {
        this.rentals = [];
      }
    });
  }

  private useSampleMovies() {
    this.movies = this.sampleMovies;
    this.filteredMovies = this.sampleMovies;
    this.featuredMovie = this.sampleMovies.find(m => m.is_featured) || this.sampleMovies[0] || null;
  }

  filterMovies() {
    let filtered = this.movies;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(term) ||
        (m.director && m.director.toLowerCase().includes(term)) ||
        (m.genre && m.genre.toLowerCase().includes(term))
      );
    }
    
    if (this.selectedGenre) {
      filtered = filtered.filter(m => m.genre === this.selectedGenre);
    }
    
    this.filteredMovies = filtered;
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
    this.filterMovies();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGenre = '';
    this.filterMovies();
  }

  rentMovie(movie: Movie) {
    this.rentalService.addToCart(movie).subscribe({
      next: () => {
        this.loadData(); // Refresh rentals
      },
      error: (err) => console.error('Failed to add to cart', err)
    });
  }

  getUserRental(movieId: string | undefined): Rental | null {
    if (!movieId) return null;
    return this.rentals.find(r => r.movie_id === movieId) || null;
  }

  handleCardAction(movie: Movie) {
    const rental = this.getUserRental(movie.id);
    
    if (rental?.status === 'active') {
      // Already rented - navigate to watch
      this.router.navigate(['/movie', movie.id]);
    } else if (rental?.status === 'cart') {
      // In cart - navigate to cart
      this.router.navigate(['/cart']);
    } else {
      // Add to cart
      this.rentMovie(movie);
    }
  }

  handleFeaturedAction(movie: Movie) {
    const rental = this.getUserRental(movie.id);
    
    if (rental?.status === 'active') {
      this.router.navigate(['/movie', movie.id]);
    } else if (rental?.status === 'cart') {
      this.router.navigate(['/cart']);
    } else {
      this.rentMovie(movie);
    }
  }

  getFeaturedButtonText(movie: Movie): string {
    const rental = this.getUserRental(movie.id);
    
    if (rental?.status === 'active') {
      return '▶ Watch Now';
    } else if (rental?.status === 'cart') {
      return '🛒 View Cart';
    }
    return 'Rent Now — R' + movie.rental_price.toFixed(2);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80';
    }
  }
}