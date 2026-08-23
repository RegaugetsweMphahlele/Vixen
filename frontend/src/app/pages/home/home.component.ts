import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- NAV -->
    <nav class="navbar fixed-top navbar-expand-lg py-3" 
         style="background: rgba(245,238,225,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(27,26,23,0.08); z-index: 1000;">
      <div class="container">
        <a class="navbar-brand font-display fw-light" style="color: #1B1A17; font-size: 1.8rem; letter-spacing: -0.02em; text-decoration: none;" routerLink="/">
          VI<span style="color: #BB5F3A;">X</span>EN
        </a>
        <div class="d-flex gap-3 align-items-center">
          <a routerLink="/login" class="text-decoration-none" style="color: #1B1A17; font-weight: 500; font-size: 0.95rem; transition: color 0.3s ease;" 
             (mouseenter)="onNavLinkHover($event, true)"
             (mouseleave)="onNavLinkHover($event, false)">Sign in</a>
          <a routerLink="/register" class="btn btn-ink rounded-0 px-4 py-2" 
             style="font-size: 0.9rem; letter-spacing: 0.05em; text-decoration: none; background: #1B1A17; color: #F5EEE1; transition: all 0.3s ease;"
             (mouseenter)="onRegisterBtnHover($event, true)"
             (mouseleave)="onRegisterBtnHover($event, false)">Become a member →</a>
        </div>
      </div>
    </nav>

    <!-- HERO SECTION WITH SLIDESHOW -->
    <section style="min-height: 100vh; background: #F5EEE1; padding-top: 80px; position: relative; overflow: hidden;">
      <div class="container position-relative" style="z-index: 2; padding-top: 40px;">
        <div class="row g-5 align-items-center min-vh-100" style="min-height: calc(100vh - 80px);">
          <!-- Left Column -->
          <div class="col-lg-6 animate-fade-up">
            <div class="d-flex align-items-center gap-3 mb-4">
              <span style="width: 40px; height: 2px; background: #BB5F3A;"></span>
              <span class="font-display fw-light" style="font-size: 0.75rem; letter-spacing: 0.2em; color: #8B9A82;">Vol. 01 — The Rental Edition</span>
              <span style="width: 40px; height: 2px; background: #BB5F3A;"></span>
            </div>
            
            <h1 class="font-display fw-light" style="font-size: clamp(3.5rem, 9vw, 6.5rem); line-height: 1.05; color: #1B1A17; margin-bottom: 1.5rem;">
              Cinema,<br>rented<br>
              <span class="font-display fst-italic" style="color: #BB5F3A;">on your own time.</span>
            </h1>
            
            <p class="font-body" style="font-size: 1.2rem; max-width: 480px; color: #4A4540; line-height: 1.9; font-weight: 400;">
              A boutique library of the world's finest films. Rent a title for forty-eight hours, 
              watch it where and when you like, then let it return to the shelf.
            </p>
            
            <div class="d-flex flex-wrap gap-3 mt-5">
              <a routerLink="/register" class="btn btn-ink rounded-0 px-5 py-3" 
                 style="font-size: 1.1rem; font-weight: 500; background: #1B1A17; color: #F5EEE1; text-decoration: none; transition: all 0.3s ease;"
                 (mouseenter)="onStartBtnHover($event, true)"
                 (mouseleave)="onStartBtnHover($event, false)">
                Start watching →
              </a>
              <a routerLink="/browse" class="text-decoration-underline" 
                 style="color: #1B1A17; font-weight: 500; padding: 0.75rem 0; font-size: 1.1rem; cursor: pointer; transition: color 0.3s ease;"
                 (mouseenter)="onBrowseLinkHover($event, true)"
                 (mouseleave)="onBrowseLinkHover($event, false)">
                Browse the library
              </a>
            </div>
            
            <div class="d-flex gap-4 mt-5">
              <div>
                <span class="font-display fw-light" style="font-size: 1.5rem; color: #1B1A17;">200+</span>
                <span style="display: block; font-size: 0.8rem; color: #8B9A82;">Curated Films</span>
              </div>
              <div>
                <span class="font-display fw-light" style="font-size: 1.5rem; color: #1B1A17;">48h</span>
                <span style="display: block; font-size: 0.8rem; color: #8B9A82;">Rental Window</span>
              </div>
              <div>
                <span class="font-display fw-light" style="font-size: 1.5rem; color: #1B1A17;">4.8★</span>
                <span style="display: block; font-size: 0.8rem; color: #8B9A82;">Average Rating</span>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Image Slideshow -->
          <div class="col-lg-6 animate-fade-up" style="animation-delay: 0.2s;">
            <div class="position-relative" style="aspect-ratio: 4/5; max-width: 480px; margin: 0 auto;">
              <!-- Slideshow Container -->
              <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.15); background: #2F4438; height: 100%; position: relative;">
                <img 
                  [src]="currentImage" 
                  alt="Featured Film"
                  style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.8s ease;"
                  (error)="handleImageError($event)"
                >
                
                <!-- Slide Indicators -->
                <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5;">
                  <span *ngFor="let dot of slideImages; let i = index" 
                        [style.background]="currentIndex === i ? '#BB5F3A' : 'rgba(255,255,255,0.3)'"
                        style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; transition: all 0.3s ease; cursor: pointer;"
                        (click)="goToSlide(i)"></span>
                </div>
              </div>
              
              <!-- Now Showing Badge -->
              <div style="position: absolute; bottom: -20px; right: -20px; background: #BB5F3A; padding: 1rem 1.5rem; border-radius: 4px; box-shadow: 0 10px 30px rgba(187,95,58,0.3); z-index: 5;">
                <span style="color: #F5EEE1; font-weight: 600; font-size: 0.9rem; letter-spacing: 0.05em;">
                  ★ Now Showing
                </span>
              </div>
              
              <!-- Film Info Overlay -->
              <div style="position: absolute; bottom: 30px; left: 30px; right: 30px; background: rgba(27,26,23,0.85); backdrop-filter: blur(10px); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(245,238,225,0.08); z-index: 5;">
                <span style="display: block; font-size: 0.7rem; color: #8B9A82; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.25rem;">
                  {{ currentMovie?.director || 'Now Playing' }}
                </span>
                <h3 style="font-family: 'Fraunces', serif; font-weight: 300; color: #F5EEE1; font-size: 1.25rem; margin: 0;">
                  {{ currentMovie?.title || 'The Astral Frontier' }}
                </h3>
                <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">
                  {{ currentMovie?.year || '2024' }} · 
                  {{ currentMovie?.genre || 'Sci-Fi' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 01 - Selection -->
    <section style="background: #1B1A17; color: #F5EEE1; padding: 100px 0; position: relative;">
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, rgba(245,238,225,0.1), transparent);"></div>
      
      <div class="container">
        <div class="row mb-5">
          <div class="col-lg-8">
            <span style="color: #8B9A82; font-size: 0.8rem; letter-spacing: 0.2em; display: block; margin-bottom: 0.5rem;">CURATED SELECTION</span>
            <h2 class="font-display fw-light" style="font-size: clamp(2.5rem, 5vw, 3.5rem);">
              This week's <span class="font-display fst-italic" style="color: #D9A441;">selection</span>
            </h2>
            <p style="color: #8B9A82; font-size: 1.1rem; margin-top: 0.5rem;">Handpicked films for your evening.</p>
          </div>
        </div>
        
        <div style="border-top: 1px solid rgba(245,238,225,0.06);">
          <div *ngFor="let movie of displayMovies.slice(0, 6); let i = index" 
               class="d-flex align-items-center py-4" 
               style="border-bottom: 1px solid rgba(245,238,225,0.04); cursor: pointer; transition: all 0.3s ease;"
               (mouseenter)="onRowHover($event, true)"
               (mouseleave)="onRowHover($event, false)"
               [routerLink]="['/movie', movie.id]">
            <span class="font-display fw-light me-4" style="color: #8B9A82; font-size: 1.5rem; min-width: 50px; font-feature-settings: 'tnum';">
              {{ (i + 1).toString().padStart(2, '0') }}
            </span>
            <div style="flex: 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <span class="font-display fw-light" style="font-size: 1.2rem; transition: color 0.3s ease;"
                    (mouseenter)="onMovieTitleHover($event, true)"
                    (mouseleave)="onMovieTitleHover($event, false)">
                {{ movie.title }}
              </span>
              <div style="display: flex; gap: 1.5rem; color: #8B9A82; font-size: 0.85rem;">
                <span>{{ movie.director || 'Unknown' }}</span>
                <span>{{ movie.genre || 'Drama' }}</span>
                <span>{{ movie.year || '2024' }}</span>
              </div>
            </div>
            <i class="bi bi-arrow-right" style="color: #8B9A82; font-size: 1.25rem; transition: transform 0.3s ease;"
               (mouseenter)="onArrowHover($event, true)"
               (mouseleave)="onArrowHover($event, false)"></i>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 2.5rem;">
          <a routerLink="/browse" style="color: #8B9A82; text-decoration: none; font-weight: 500; transition: color 0.3s ease;"
             (mouseenter)="onViewAllHover($event, true)"
             (mouseleave)="onViewAllHover($event, false)">
            View all films →
          </a>
        </div>
      </div>
    </section>

    <!-- SECTION 02 - The Ritual -->
    <section style="background: #F5EEE1; padding: 100px 0;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
          <span style="color: #8B9A82; font-size: 0.8rem; letter-spacing: 0.2em; display: block;">THE RITUAL</span>
          <h2 class="font-display fw-light" style="font-size: clamp(2.5rem, 5vw, 3.5rem); color: #1B1A17;">
            How a rental <span class="font-display fst-italic" style="color: #BB5F3A;">unfolds.</span>
          </h2>
          <p style="color: #4A4540; font-size: 1.1rem; max-width: 500px; margin: 0.5rem auto 0;">Three simple steps to cinematic bliss.</p>
        </div>
        
        <div class="row g-5 mt-2">
          <div class="col-md-4 text-center animate-fade-up">
            <div style="width: 80px; height: 80px; background: rgba(187,95,58,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <span class="font-display fw-light fst-italic" style="font-size: 2rem; color: #BB5F3A;">01</span>
            </div>
            <h3 class="font-display fw-light fs-2" style="color: #1B1A17;">Choose your film</h3>
            <p style="max-width: 300px; margin: 0 auto; color: #4A4540; line-height: 1.8;">
              Browse a library curated by hand. No infinite scroll, no algorithm — only films worth your evening.
            </p>
          </div>
          <div class="col-md-4 text-center animate-fade-up" style="animation-delay: 0.15s;">
            <div style="width: 80px; height: 80px; background: rgba(187,95,58,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <span class="font-display fw-light fst-italic" style="font-size: 2rem; color: #BB5F3A;">02</span>
            </div>
            <h3 class="font-display fw-light fs-2" style="color: #1B1A17;">Rent for forty-eight hours</h3>
            <p style="max-width: 300px; margin: 0 auto; color: #4A4540; line-height: 1.8;">
              A single, transparent price. Your access begins the moment you press play, not before.
            </p>
          </div>
          <div class="col-md-4 text-center animate-fade-up" style="animation-delay: 0.3s;">
            <div style="width: 80px; height: 80px; background: rgba(187,95,58,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <span class="font-display fw-light fst-italic" style="font-size: 2rem; color: #BB5F3A;">03</span>
            </div>
            <h3 class="font-display fw-light fs-2" style="color: #1B1A17;">Watch, then release</h3>
            <p style="max-width: 300px; margin: 0 auto; color: #4A4540; line-height: 1.8;">
              Stream in the highest quality. When the hours pass, the film returns to the shelf.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 03 - By Mood -->
    <section style="background: #EDE4D3; padding: 100px 0;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
          <span style="color: #8B9A82; font-size: 0.8rem; letter-spacing: 0.2em; display: block;">DISCOVER</span>
          <h2 class="font-display fw-light" style="font-size: clamp(2.5rem, 5vw, 3.5rem); color: #1B1A17;">
            Find your <span class="font-display fst-italic" style="color: #BB5F3A;">genre.</span>
          </h2>
          <p style="color: #4A4540; font-size: 1.1rem; max-width: 400px; margin: 0.5rem auto 0;">Discover films by mood and style.</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; max-width: 900px; margin: 0 auto;">
          <span *ngFor="let genre of genres; let i = index" 
                class="font-display fst-italic" 
                style="color: #2F4438; cursor: pointer; transition: all 0.3s ease; padding: 0.5rem 1.25rem; border-radius: 4px; font-size: 1.1rem; border: 1px solid transparent;"
                (mouseenter)="onGenreHover($event, true)"
                (mouseleave)="onGenreHover($event, false)"
                [routerLink]="['/browse']">
            {{ (i + 1).toString().padStart(2, '0') }} {{ genre }}
          </span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section style="background: #2F4438; color: #F5EEE1; padding: 120px 0; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50%; right: -10%; width: 60%; height: 200%; background: rgba(187,95,58,0.05); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -50%; left: -10%; width: 40%; height: 200%; background: rgba(217,164,65,0.03); border-radius: 50%;"></div>
      
      <div class="container text-center position-relative" style="z-index: 2;">
        <span style="color: #8B9A82; font-size: 0.8rem; letter-spacing: 0.2em; display: block; margin-bottom: 0.5rem;">INVITATION</span>
        <h2 class="font-display fw-light" style="font-size: clamp(3rem, 6vw, 4.5rem);">
          The shelf is <span class="font-display fst-italic" style="color: #D9A441;">open.</span>
        </h2>
        <p style="font-size: 1.2rem; color: #8B9A82; max-width: 500px; margin: 1rem auto 2.5rem; line-height: 1.6;">
          Create an account in a moment. Your first film is waiting.
        </p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
          <a routerLink="/register" class="btn btn-rust px-5 py-3" 
             style="font-size: 1.1rem; background: #BB5F3A; color: #F5EEE1; border: none; border-radius: 9999px; text-decoration: none; transition: all 0.3s ease; font-weight: 600;"
             (mouseenter)="onCtaBtnHover($event, true)"
             (mouseleave)="onCtaBtnHover($event, false)">
            Become a member →
          </a>
          <a routerLink="/login" style="color: #8B9A82; padding: 0.75rem 0; font-size: 1.05rem; text-decoration: underline; transition: color 0.3s ease;"
             (mouseenter)="onLoginLinkHover($event, true)"
             (mouseleave)="onLoginLinkHover($event, false)">
            I already have an account
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer style="background: #1B1A17; color: #8B9A82; padding: 60px 0; border-top: 1px solid rgba(245,238,225,0.04);">
      <div class="container">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
          <div>
            <span class="font-display fw-light" style="font-size: 2rem; color: #F5EEE1; display: block;">VIXEN</span>
            <p style="font-size: 0.9rem; margin-top: 0.25rem; color: #8B9A82;">Premium movie rentals. Curated, not algorithmic.</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 0.85rem; margin: 0;">© 2024 Vixen — Premium movie rentals.</p>
            <p style="font-size: 0.8rem; color: #5a6b5a; margin-top: 0.25rem;">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .btn-ink {
      background-color: #1B1A17;
      color: #F5EEE1;
      border: none;
      padding: 0.75rem 2rem;
      font-weight: 600;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .btn-ink:hover {
      background-color: #2d2b27;
      color: #F5EEE1;
      transform: translateY(-2px);
    }
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      border-radius: 9999px;
      padding: 0.75rem 2rem;
      font-weight: 600;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .btn-rust:hover {
      transform: scale(1.05);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .animate-fade-up {
      animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredMovies: Movie[] = [];
  allMovies: Movie[] = [];
  displayMovies: Movie[] = [];
  genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Horror', 
            'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Fantasy', 'Crime'];
  
  // Slideshow properties
  currentIndex = 0;
  currentImage = '/assets/movies/The%20Fast%20and%20the%20Furious.jpg';
  currentMovie: Movie | null = null;
  private slideInterval: any;
  
  // High-quality movie images for slideshow
  slideImages: string[] = [
    '/assets/movies/The%20Fast%20and%20the%20Furious.jpg',
    '/assets/movies/The%20Notebook.jpg',
    '/assets/movies/download%20(9).jpg',
    '/assets/movies/download%20(10).jpg',
    '/assets/movies/download%20(11).jpg'
  ];
  
  slideMovies: Movie[] = [
    { id: '1', title: 'The Astral Frontier', director: 'Sofia Reyes', genre: 'Sci-Fi', year: 2024, rating: 4.3, rental_price: 45, description: 'A journey beyond the stars.', duration_minutes: 120, poster_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80', backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80', cast: 'Sofia Reyes, John Smith', rental_duration_hours: 48, is_featured: true, age_rating: 'PG-13' },
    { id: '2', title: 'Oppenheimer', director: 'Christopher Nolan', genre: 'Drama', year: 2023, rating: 4.8, rental_price: 55, description: 'The man behind the bomb.', duration_minutes: 180, poster_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', backdrop_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80', cast: 'Cillian Murphy, Emily Blunt', rental_duration_hours: 72, is_featured: false, age_rating: 'R' },
    { id: '3', title: 'Dune: Part Two', director: 'Denis Villeneuve', genre: 'Sci-Fi', year: 2024, rating: 4.7, rental_price: 50, description: 'The epic continues.', duration_minutes: 166, poster_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80', backdrop_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=80', cast: 'Timothée Chalamet, Zendaya', rental_duration_hours: 72, is_featured: false, age_rating: 'PG-13' },
    { id: '4', title: 'Past Lives', director: 'Celine Song', genre: 'Romance', year: 2023, rating: 4.7, rental_price: 40, description: 'A love story across time.', duration_minutes: 105, poster_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', backdrop_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80', cast: 'Greta Lee, Teo Yoo', rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13' },
    { id: '5', title: 'Poor Things', director: 'Yorgos Lanthimos', genre: 'Comedy', year: 2023, rating: 4.2, rental_price: 45, description: 'A fantastical tale.', duration_minutes: 141, poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80', backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80', cast: 'Emma Stone, Mark Ruffalo', rental_duration_hours: 48, is_featured: false, age_rating: 'R' }
  ];

  constructor(
    public auth: AuthService,
    private movieService: MovieService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMovies();
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        if (movies && movies.length > 0) {
          this.allMovies = movies;
          this.displayMovies = movies;
          this.featuredMovies = movies.filter(m => m.is_featured);
          if (this.featuredMovies.length > 0) {
            this.currentMovie = this.featuredMovies[0];
            this.currentImage = this.getMovieImage(this.featuredMovies[0]);
          }
        } else {
          this.useSampleMovies();
        }
      },
      error: () => {
        this.useSampleMovies();
      }
    });
  }

  private useSampleMovies() {
    this.allMovies = this.slideMovies;
    this.displayMovies = this.slideMovies;
    this.featuredMovies = this.slideMovies.filter(m => m.is_featured);
    this.currentMovie = this.slideMovies[0];
    this.currentImage = this.slideImages[0];
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
      this.changeDetector.detectChanges();
    }, 2000);
  }

  private getMovieImage(movie: Movie) {
    return `/assets/movies/${encodeURIComponent(movie.title)}.jpg`;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slideImages.length;
    this.currentImage = this.slideImages[this.currentIndex];
    if (this.slideMovies[this.currentIndex]) {
      this.currentMovie = this.slideMovies[this.currentIndex];
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.currentImage = this.slideImages[index];
    if (this.slideMovies[index]) {
      this.currentMovie = this.slideMovies[index];
    }
    // Reset the interval
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startSlideshow();
    }
  }

  // Event handlers
  onNavLinkHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.color = isHovering ? '#BB5F3A' : '#1B1A17';
  }

  onRegisterBtnHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.background = isHovering ? '#2d2b27' : '#1B1A17';
  }

  onStartBtnHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) {
      el.style.background = isHovering ? '#2d2b27' : '#1B1A17';
      el.style.transform = isHovering ? 'translateY(-2px)' : 'translateY(0)';
    }
  }

  onBrowseLinkHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.color = isHovering ? '#BB5F3A' : '#1B1A17';
  }

  onCtaBtnHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) {
      el.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
      el.style.background = isHovering ? '#a54f2f' : '#BB5F3A';
    }
  }

  onLoginLinkHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.color = isHovering ? '#F5EEE1' : '#8B9A82';
  }

  onRowHover(event: Event, isHovering: boolean) {
    const el = event.currentTarget as HTMLElement;
    if (el) el.style.backgroundColor = isHovering ? 'rgba(245,238,225,0.03)' : 'transparent';
  }

  onMovieTitleHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.color = isHovering ? '#D9A441' : '#F5EEE1';
  }

  onArrowHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.transform = isHovering ? 'translateX(4px)' : 'translateX(0)';
  }

  onViewAllHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) el.style.color = isHovering ? '#F5EEE1' : '#8B9A82';
  }

  onGenreHover(event: Event, isHovering: boolean) {
    const el = event.target as HTMLElement;
    if (el) {
      if (isHovering) {
        el.style.color = '#BB5F3A';
        el.style.backgroundColor = 'rgba(187,95,58,0.08)';
        el.style.borderColor = 'rgba(187,95,58,0.2)';
        el.style.transform = 'scale(1.05)';
      } else {
        el.style.color = '#2F4438';
        el.style.backgroundColor = 'transparent';
        el.style.borderColor = 'transparent';
        el.style.transform = 'scale(1)';
      }
    }
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.slideImages[0];
    }
  }
}