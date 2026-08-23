import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie, GENRES } from '../../models/movie.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, VixenNavComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="font-display fw-light text-white">Admin Panel</h1>
          <button class="btn btn-rust" (click)="showForm = !showForm">
            {{ showForm ? 'Cancel' : 'Add New Film' }}
          </button>
        </div>
        
        <!-- Add/Edit Form -->
        <div *ngIf="showForm" class="card-vixen p-4 mb-4">
          <h5 class="text-white mb-3">{{ editingMovie ? 'Edit Film' : 'Add New Film' }}</h5>
          
          <form #movieForm="ngForm" (ngSubmit)="saveMovie()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="text-white-50 small">Title *</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.title" 
                       name="title" 
                       required>
              </div>
              
              <div class="col-md-6">
                <label class="text-white-50 small">Director *</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.director" 
                       name="director" 
                       required>
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Genre *</label>
                <select class="form-select bg-transparent text-white border-secondary" 
                        [(ngModel)]="currentMovie.genre" 
                        name="genre" 
                        required>
                  <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
                </select>
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Year *</label>
                <input type="number" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.year" 
                       name="year" 
                       required>
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Rating</label>
                <input type="number" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.rating" 
                       name="rating" 
                       step="0.1"
                       min="0" 
                       max="5">
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Rental Price (R) *</label>
                <input type="number" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.rental_price" 
                       name="rental_price" 
                       required>
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Rental Duration (hours)</label>
                <input type="number" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.rental_duration_hours" 
                       name="rental_duration_hours">
              </div>
              
              <div class="col-md-4">
                <label class="text-white-50 small">Age Rating</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.age_rating" 
                       name="age_rating">
              </div>
              
              <div class="col-12">
                <label class="text-white-50 small">Description</label>
                <textarea class="form-control bg-transparent text-white border-secondary" 
                          [(ngModel)]="currentMovie.description" 
                          name="description" 
                          rows="3"></textarea>
              </div>
              
              <div class="col-md-6">
                <label class="text-white-50 small">Poster URL</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.poster_url" 
                       name="poster_url">
              </div>
              
              <div class="col-md-6">
                <label class="text-white-50 small">Backdrop URL</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.backdrop_url" 
                       name="backdrop_url">
              </div>
              
              <div class="col-md-6">
                <label class="text-white-50 small">Cast</label>
                <input type="text" 
                       class="form-control bg-transparent text-white border-secondary" 
                       [(ngModel)]="currentMovie.cast" 
                       name="cast">
              </div>
              
              <div class="col-md-6 d-flex align-items-center">
                <div class="form-check">
                  <input type="checkbox" 
                         class="form-check-input bg-transparent" 
                         [(ngModel)]="currentMovie.is_featured" 
                         name="is_featured">
                  <label class="form-check-label text-white">Featured Film</label>
                </div>
              </div>
            </div>
            
            <div class="mt-3 d-flex gap-2">
              <button type="submit" class="btn btn-rust" [disabled]="movieForm.invalid">
                {{ editingMovie ? 'Update' : 'Create' }}
              </button>
              <button type="button" class="btn btn-outline-secondary" (click)="cancelEdit()">
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        <!-- Movie List -->
        <div class="row g-3">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Genre</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let movie of movies">
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.director }}</td>
                    <td>{{ movie.genre }}</td>
                    <td>{{ movie.year }}</td>
                    <td>R{{ movie.rental_price.toFixed(2) }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" (click)="editMovie(movie)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteMovie(movie.id!)">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </td>
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
    .card-vixen {
      background: rgba(47,68,56,0.3);
      border: 1px solid rgba(245,238,225,0.08);
      border-radius: 16px;
    }
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      border-radius: 9999px;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    .btn-rust:hover {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .table-dark {
      --bs-table-bg: transparent;
    }
    .table-dark td, .table-dark th {
      border-color: rgba(245,238,225,0.08);
    }
    .form-control, .form-select {
      border-color: rgba(245,238,225,0.2) !important;
    }
    .form-control:focus, .form-select:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 2px rgba(187,95,58,0.2) !important;
    }
  `]
})
export class AdminComponent implements OnInit {
  movies: Movie[] = [];
  genres = GENRES;
  showForm = false;
  editingMovie = false;
  
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

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
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
      this.movieService.updateMovie(this.currentMovie.id, this.currentMovie).subscribe(() => {
        this.loadMovies();
        this.cancelEdit();
      });
    } else {
      this.movieService.createMovie(this.currentMovie).subscribe(() => {
        this.loadMovies();
        this.cancelEdit();
      });
    }
  }

  deleteMovie(id: string) {
    if (confirm('Are you sure you want to delete this film?')) {
      this.movieService.deleteMovie(id).subscribe(() => {
        this.loadMovies();
      });
    }
  }
}