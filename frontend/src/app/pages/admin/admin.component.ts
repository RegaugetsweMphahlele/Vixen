import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { RentalService } from '../../services/rental.service';
import { AuthService } from '../../services/auth.service';
import { Movie, GENRES } from '../../models/movie.model';
import { Rental } from '../../models/rental.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-container" style="min-height: 100vh; background: #1B1A17; padding: 20px;">
      <!-- Admin Header -->
      <div class="admin-header" style="background: #2F4438; border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(245,238,225,0.08);">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 class="font-display fw-light text-white" style="font-size: 2.5rem; margin: 0;">
              <i class="bi bi-shield-lock-fill" style="color: #BB5F3A; margin-right: 15px;"></i>
              Admin Dashboard
            </h1>
            <p class="text-white-50" style="margin: 5px 0 0 0;">Manage your movie library, rentals, and users.</p>
          </div>
          <div class="d-flex gap-2">
            <span class="badge" style="background: #BB5F3A; color: #F5EEE1; padding: 8px 16px; font-size: 0.9rem;">
              <i class="bi bi-person-fill me-1"></i> {{ auth.getCurrentUser()?.full_name || 'Admin' }}
            </span>
            <button class="btn btn-sm" (click)="logout()" style="background: rgba(255,255,255,0.1); color: #F5EEE1; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 16px;">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards with Real Data -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background: rgba(47,68,56,0.4); border-radius: 16px; padding: 20px; border: 1px solid rgba(245,238,225,0.06); text-align: center; transition: all 0.3s ease;">
            <i class="bi bi-film" style="font-size: 2rem; color: #BB5F3A;"></i>
            <h2 class="text-white mb-0" style="font-size: 2rem; font-weight: 300;">{{ movies.length }}</h2>
            <span style="color: #8B9A82; font-size: 0.9rem;">Total Films</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background: rgba(47,68,56,0.4); border-radius: 16px; padding: 20px; border: 1px solid rgba(245,238,225,0.06); text-align: center; transition: all 0.3s ease;">
            <i class="bi bi-people" style="font-size: 2rem; color: #BB5F3A;"></i>
            <h2 class="text-white mb-0" style="font-size: 2rem; font-weight: 300;">{{ users.length }}</h2>
            <span style="color: #8B9A82; font-size: 0.9rem;">Total Users</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background: rgba(47,68,56,0.4); border-radius: 16px; padding: 20px; border: 1px solid rgba(245,238,225,0.06); text-align: center; transition: all 0.3s ease;">
            <i class="bi bi-cart-check" style="font-size: 2rem; color: #BB5F3A;"></i>
            <h2 class="text-white mb-0" style="font-size: 2rem; font-weight: 300;">{{ activeRentals.length }}</h2>
            <span style="color: #8B9A82; font-size: 0.9rem;">Active Rentals</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background: rgba(47,68,56,0.4); border-radius: 16px; padding: 20px; border: 1px solid rgba(245,238,225,0.06); text-align: center; transition: all 0.3s ease;">
            <i class="bi bi-currency-rand" style="font-size: 2rem; color: #D9A441;"></i>
            <h2 class="text-white mb-0" style="font-size: 2rem; font-weight: 300;">R{{ totalRevenue.toFixed(2) }}</h2>
            <span style="color: #8B9A82; font-size: 0.9rem;">Total Revenue</span>
          </div>
        </div>
      </div>

      <!-- Admin Tabs -->
      <div class="admin-tabs" style="background: rgba(47,68,56,0.3); border-radius: 16px; border: 1px solid rgba(245,238,225,0.06); overflow: hidden;">
        <div class="tab-header" style="display: flex; border-bottom: 1px solid rgba(245,238,225,0.06); overflow-x: auto; background: rgba(0,0,0,0.2);">
          <button class="tab-btn" *ngFor="let tab of tabs" 
                  (click)="activeTab = tab.id"
                  [style.background]="activeTab === tab.id ? 'rgba(187,95,58,0.2)' : 'transparent'"
                  [style.color]="activeTab === tab.id ? '#F5EEE1' : '#8B9A82'"
                  style="border: none; padding: 15px 25px; cursor: pointer; transition: all 0.3s ease; font-weight: 500; font-size: 0.95rem; white-space: nowrap; border-bottom: 2px solid transparent;"
                  [style.border-bottom-color]="activeTab === tab.id ? '#BB5F3A' : 'transparent'">
            <i [class]="tab.icon" style="margin-right: 8px;"></i> {{ tab.label }}
            <span class="badge" *ngIf="tab.count" style="background: #BB5F3A; color: #F5EEE1; margin-left: 8px; font-size: 0.7rem; padding: 2px 8px; border-radius: 9999px;">{{ tab.count }}</span>
          </button>
        </div>

        <div class="tab-content" style="padding: 25px;">
          <!-- Movies Tab -->
          <div *ngIf="activeTab === 'movies'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="text-white mb-0">Movie Library</h5>
              <button class="btn btn-rust" (click)="showAddForm()" style="border-radius: 9999px; padding: 8px 20px;">
                <i class="bi bi-plus-circle me-1"></i> Add Film
              </button>
            </div>

            <!-- Add/Edit Form -->
            <div *ngIf="showForm" class="card-vixen p-4 mb-4" style="background: rgba(47,68,56,0.3); border-color: rgba(245,238,225,0.08); border-radius: 12px;">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white mb-0">{{ editingMovie ? 'Edit Film' : 'Add New Film' }}</h6>
                <button class="btn btn-sm" (click)="cancelEdit()" style="background: transparent; color: #8B9A82; border: none;">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              
              <form #movieForm="ngForm" (ngSubmit)="saveMovie()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="text-white-50 small fw-semibold">TITLE *</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.title" name="title" required>
                  </div>
                  <div class="col-md-6">
                    <label class="text-white-50 small fw-semibold">DIRECTOR *</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.director" name="director" required>
                  </div>
                  <div class="col-md-4">
                    <label class="text-white-50 small fw-semibold">GENRE *</label>
                    <select class="form-select form-select-dark" [(ngModel)]="currentMovie.genre" name="genre" required>
                      <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="text-white-50 small fw-semibold">YEAR *</label>
                    <input type="number" class="form-control form-control-dark" [(ngModel)]="currentMovie.year" name="year" required>
                  </div>
                  <div class="col-md-4">
                    <label class="text-white-50 small fw-semibold">RATING</label>
                    <input type="number" class="form-control form-control-dark" [(ngModel)]="currentMovie.rating" name="rating" step="0.1" min="0" max="5">
                  </div>
                  <div class="col-md-3">
                    <label class="text-white-50 small fw-semibold">PRICE (R) *</label>
                    <input type="number" class="form-control form-control-dark" [(ngModel)]="currentMovie.rental_price" name="rental_price" required>
                  </div>
                  <div class="col-md-3">
                    <label class="text-white-50 small fw-semibold">DURATION (HOURS)</label>
                    <input type="number" class="form-control form-control-dark" [(ngModel)]="currentMovie.rental_duration_hours" name="rental_duration_hours">
                  </div>
                  <div class="col-md-3">
                    <label class="text-white-50 small fw-semibold">AGE RATING</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.age_rating" name="age_rating">
                  </div>
                  <div class="col-md-3">
                    <label class="text-white-50 small fw-semibold">DURATION (MIN)</label>
                    <input type="number" class="form-control form-control-dark" [(ngModel)]="currentMovie.duration_minutes" name="duration_minutes">
                  </div>
                  <div class="col-12">
                    <label class="text-white-50 small fw-semibold">DESCRIPTION</label>
                    <textarea class="form-control form-control-dark" [(ngModel)]="currentMovie.description" name="description" rows="2"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="text-white-50 small fw-semibold">POSTER URL</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.poster_url" name="poster_url">
                  </div>
                  <div class="col-md-6">
                    <label class="text-white-50 small fw-semibold">BACKDROP URL</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.backdrop_url" name="backdrop_url">
                  </div>
                  <div class="col-md-6">
                    <label class="text-white-50 small fw-semibold">CAST</label>
                    <input type="text" class="form-control form-control-dark" [(ngModel)]="currentMovie.cast" name="cast">
                  </div>
                  <div class="col-md-6 d-flex align-items-center">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" [(ngModel)]="currentMovie.is_featured" name="is_featured" id="isFeatured">
                      <label class="form-check-label text-white" for="isFeatured">Featured Film</label>
                    </div>
                  </div>
                </div>
                <div class="mt-3 d-flex gap-2">
                  <button type="submit" class="btn btn-rust" [disabled]="movieForm.invalid" style="border-radius: 9999px; padding: 8px 30px;">
                    {{ editingMovie ? 'Update Film' : 'Add Film' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelEdit()" style="border-radius: 9999px; padding: 8px 30px;">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Movie List - Real Data -->
            <div class="table-responsive">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Film</th>
                    <th>Director</th>
                    <th>Genre</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style="text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let movie of movies">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <img [src]="movie.poster_url" style="width: 35px; height: 50px; object-fit: cover; border-radius: 4px;" (error)="handleImageError($event)">
                        <span style="color: #F5EEE1;">{{ movie.title }}</span>
                      </div>
                    </td>
                    <td style="color: #8B9A82;">{{ movie.director || 'N/A' }}</td>
                    <td><span class="badge genre-badge">{{ movie.genre }}</span></td>
                    <td style="color: #8B9A82;">{{ movie.year }}</td>
                    <td style="color: #D9A441;">R{{ movie.rental_price.toFixed(2) }}</td>
                    <td>
                      <span *ngIf="movie.is_featured" class="badge featured-badge">⭐ Featured</span>
                      <span *ngIf="!movie.is_featured" class="badge standard-badge">Standard</span>
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-sm action-btn" (click)="editMovie(movie)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm action-btn" (click)="deleteMovie(movie.id!)" title="Delete">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Rentals Tab - Real Data -->
          <div *ngIf="activeTab === 'rentals'">
            <h5 class="text-white mb-3">Rental History</h5>
            <div *ngIf="allRentals.length === 0" class="text-center py-4">
              <i class="bi bi-inbox text-white-50" style="font-size: 3rem;"></i>
              <p class="text-white-50 mt-2">No rentals found.</p>
            </div>
            <div class="table-responsive" *ngIf="allRentals.length > 0">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>Film</th>
                    <th>User</th>
                    <th>Start Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let rental of allRentals">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <img [src]="rental.movie_poster" style="width: 30px; height: 40px; object-fit: cover; border-radius: 4px;" (error)="handleImageError($event)">
                        <span style="color: #F5EEE1;">{{ rental.movie_title }}</span>
                      </div>
                    </td>
                    <td style="color: #8B9A82;">
                      {{ getUserName(rental.user_id) }}
                    </td>
                    <td style="color: #8B9A82;">{{ rental.rental_start | date:'shortDate' }}</td>
                    <td style="color: #8B9A82;">{{ rental.rental_expiry | date:'shortDate' }}</td>
                    <td>
                      <span class="badge" [class.rental-active]="rental.status === 'active'" [class.rental-expired]="rental.status === 'expired'" [class.rental-cart]="rental.status === 'cart'">
                        {{ rental.status | uppercase }}
                      </span>
                    </td>
                    <td style="text-align: right; color: #D9A441;">R{{ rental.amount_paid.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Users Tab - Real Data -->
          <div *ngIf="activeTab === 'users'">
            <h5 class="text-white mb-3">Registered Users</h5>
            <div *ngIf="users.length === 0" class="text-center py-4">
              <i class="bi bi-person-x text-white-50" style="font-size: 3rem;"></i>
              <p class="text-white-50 mt-2">No users found.</p>
            </div>
            <div class="table-responsive" *ngIf="users.length > 0">
              <table class="table admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style="text-align: right;">Rentals</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of users">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="user-avatar">{{ (user.full_name || 'U')[0] | uppercase }}</div>
                        <span style="color: #F5EEE1;">{{ user.full_name || 'Unknown' }}</span>
                      </div>
                    </td>
                    <td style="color: #8B9A82;">{{ user.email }}</td>
                    <td>
                      <span class="badge" [class.role-admin]="user.role === 'admin'" [class.role-user]="user.role === 'user'">
                        {{ user.role | uppercase }}
                      </span>
                    </td>
                    <td style="text-align: right; color: #8B9A82;">{{ getUserRentalCount(user.id) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .stat-card {
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(187,95,58,0.3) !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }

    .form-control-dark {
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(245,238,225,0.15) !important;
      color: #F5EEE1 !important;
      border-radius: 8px !important;
      padding: 10px 14px !important;
    }
    .form-control-dark:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 3px rgba(187,95,58,0.2) !important;
    }
    .form-control-dark::placeholder {
      color: rgba(255,255,255,0.3) !important;
    }

    .form-select-dark {
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(245,238,225,0.15) !important;
      color: #F5EEE1 !important;
      border-radius: 8px !important;
      padding: 10px 14px !important;
    }
    .form-select-dark:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 3px rgba(187,95,58,0.2) !important;
    }
    .form-select-dark option {
      background: #1B1A17 !important;
    }

    .form-check-input {
      background-color: rgba(255,255,255,0.05);
      border-color: rgba(245,238,225,0.3);
    }
    .form-check-input:checked {
      background-color: #BB5F3A;
      border-color: #BB5F3A;
    }

    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      transition: all 0.3s ease;
    }
    .btn-rust:hover {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .btn-rust:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-outline-secondary {
      color: #8B9A82;
      border: 1px solid rgba(245,238,225,0.15);
      background: transparent;
      transition: all 0.3s ease;
    }
    .btn-outline-secondary:hover {
      color: #F5EEE1;
      border-color: rgba(245,238,225,0.3);
      background: rgba(255,255,255,0.05);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }
    .admin-table thead th {
      color: #8B9A82;
      font-weight: 500;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 8px;
      border-bottom: 1px solid rgba(245,238,225,0.06);
    }
    .admin-table tbody td {
      padding: 12px 8px;
      border-bottom: 1px solid rgba(245,238,225,0.04);
      vertical-align: middle;
    }
    .admin-table tbody tr:hover {
      background: rgba(255,255,255,0.02);
    }

    .genre-badge {
      background: #2F4438;
      color: #F5EEE1;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
    }

    .featured-badge {
      background: #D9A441;
      color: #1B1A17;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .standard-badge {
      background: rgba(139,154,130,0.2);
      color: #8B9A82;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
    }

    .rental-active {
      background: #8B9A82;
      color: #1B1A17;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .rental-expired {
      background: #BB5F3A;
      color: #F5EEE1;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
    .rental-cart {
      background: #D9A441;
      color: #1B1A17;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
    }

    .role-admin {
      background: #BB5F3A;
      color: #F5EEE1;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .role-user {
      background: #2F4438;
      color: #8B9A82;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: #2F4438;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #F5EEE1;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .action-btn {
      background: transparent;
      color: #8B9A82;
      border: 1px solid rgba(245,238,225,0.08);
      border-radius: 6px;
      padding: 4px 8px;
      margin: 0 2px;
      transition: all 0.3s ease;
    }
    .action-btn:hover {
      color: #F5EEE1;
      border-color: #BB5F3A;
    }

    .tab-btn {
      border: none;
      padding: 15px 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 0.95rem;
      white-space: nowrap;
      background: transparent;
      color: #8B9A82;
      border-bottom: 2px solid transparent;
    }
    .tab-btn:hover {
      color: #F5EEE1;
      background: rgba(255,255,255,0.03);
    }

    .card-vixen {
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 10px;
      }
      .admin-header {
        padding: 20px !important;
      }
      .tab-btn {
        padding: 12px 16px;
        font-size: 0.85rem;
      }
      .stat-card {
        padding: 15px !important;
      }
      .stat-card h2 {
        font-size: 1.5rem !important;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  // Data from database
  movies: Movie[] = [];
  allRentals: Rental[] = [];
  users: User[] = [];
  activeRentals: Rental[] = [];
  totalRevenue = 0;
  
  // UI State
  activeTab = 'movies';
  showForm = false;
  editingMovie = false;
  genres = GENRES;
  
  tabs = [
    { id: 'movies', label: 'Films', icon: 'bi bi-film', count: 0 },
    { id: 'rentals', label: 'Rentals', icon: 'bi bi-clock-history', count: 0 },
    { id: 'users', label: 'Users', icon: 'bi bi-people', count: 0 }
  ];
  
  currentMovie: Movie = {
    title: '',
    description: '',
    genre: 'Drama',
    year: new Date().getFullYear(),
    duration_minutes: 0,
    rating: 0,
    poster_url: '',
    backdrop_url: '',
    director: '',
    cast: '',
    rental_price: 0,
    rental_duration_hours: 48,
    is_featured: false,
    age_rating: 'PG'
  };

  // Cache for user names
  private userCache: Map<string, string> = new Map();

  constructor(
    public auth: AuthService,
    private movieService: MovieService,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load movies from API
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.tabs[0].count = movies.length;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.movies = [];
        this.tabs[0].count = 0;
      }
    });

    // Load rentals from API
    this.rentalService.getRentals().subscribe({
      next: (rentals) => {
        this.allRentals = rentals;
        this.activeRentals = rentals.filter(r => r.status === 'active');
        this.totalRevenue = rentals.reduce((sum, r) => sum + r.amount_paid, 0);
        this.tabs[1].count = rentals.length;
      },
      error: (err) => {
        console.error('Error loading rentals:', err);
        this.allRentals = [];
        this.activeRentals = [];
        this.totalRevenue = 0;
        this.tabs[1].count = 0;
      }
    });

    // Load users from API
    this.auth.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          // In a real app, you'd have an endpoint to get all users
          // For now, we'll show the current user
          this.users = [user];
          this.tabs[2].count = 1;
          
          // Cache the user's name
          this.userCache.set(user.id, user.full_name || user.email);
        }
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.users = [];
        this.tabs[2].count = 0;
      }
    });
  }

  // Get user name from cache or API
  getUserName(userId: string): string {
    if (this.userCache.has(userId)) {
      return this.userCache.get(userId) || 'Unknown User';
    }
    
    // Try to find in users list
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.userCache.set(userId, user.full_name || user.email);
      return user.full_name || user.email;
    }
    
    return 'Unknown User';
  }

  showAddForm() {
    this.showForm = true;
    this.editingMovie = false;
    this.currentMovie = {
      title: '',
      description: '',
      genre: 'Drama',
      year: new Date().getFullYear(),
      duration_minutes: 0,
      rating: 0,
      poster_url: '',
      backdrop_url: '',
      director: '',
      cast: '',
      rental_price: 0,
      rental_duration_hours: 48,
      is_featured: false,
      age_rating: 'PG'
    };
  }

  editMovie(movie: Movie) {
    this.showForm = true;
    this.editingMovie = true;
    this.currentMovie = { ...movie };
  }

  cancelEdit() {
    this.showForm = false;
    this.editingMovie = false;
  }

  saveMovie() {
    if (this.editingMovie && this.currentMovie.id) {
      this.movieService.updateMovie(this.currentMovie.id, this.currentMovie).subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      this.movieService.createMovie(this.currentMovie).subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  deleteMovie(id: string) {
    if (confirm('Are you sure you want to delete this film?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  getUserRentalCount(userId: string): number {
    return this.allRentals.filter(r => r.user_id === userId).length;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80';
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}