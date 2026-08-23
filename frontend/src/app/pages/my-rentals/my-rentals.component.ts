import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';
import { RentalTimerComponent } from '../../components/rental-timer/rental-timer.component';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, RouterModule, VixenNavComponent, RentalTimerComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <div class="container py-4">
        <h1 class="font-display fw-light text-white mb-4">My Rentals</h1>
        
        <!-- Active Rentals -->
        <section *ngIf="activeRentals.length > 0" class="mb-5">
          <h4 class="text-white mb-3">Watching Now</h4>
          <div class="row g-4">
            <div *ngFor="let rental of activeRentals" class="col-6 col-md-4 col-lg-3">
              <div class="card-vixen overflow-hidden">
                <div style="position: relative; aspect-ratio: 2/3;">
                  <img [src]="rental.movie_poster" 
                       [alt]="rental.movie_title"
                       class="w-100 h-100" 
                       style="object-fit: cover;">
                  <div class="position-absolute bottom-0 start-0 w-100 p-2" 
                       style="background: linear-gradient(to top, rgba(27,26,23,0.9), transparent);">
                    <app-rental-timer [rental]="rental"></app-rental-timer>
                  </div>
                </div>
                <div class="p-3">
                  <h6 class="text-white mb-1">{{ rental.movie_title }}</h6>
                  <button class="btn btn-rust w-100 mt-2">
                    <i class="bi bi-play-fill"></i> Watch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Past Rentals -->
        <section *ngIf="expiredRentals.length > 0">
          <h4 class="text-white mb-3">Past Rentals</h4>
          <div class="row g-4">
            <div *ngFor="let rental of expiredRentals" class="col-6 col-md-4 col-lg-3">
              <div class="card-vixen overflow-hidden opacity-50">
                <div style="position: relative; aspect-ratio: 2/3;">
                  <img [src]="rental.movie_poster" 
                       [alt]="rental.movie_title"
                       class="w-100 h-100" 
                       style="object-fit: cover; filter: grayscale(1);">
                </div>
                <div class="p-3">
                  <h6 class="text-white-50 mb-1">{{ rental.movie_title }}</h6>
                  <span class="text-sage small">Expired</span>
                  <button class="btn btn-outline-light w-100 mt-2" 
                          style="border-radius: 9999px; border-color: rgba(255,255,255,0.1);">
                    Rent Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Empty State -->
        <div *ngIf="activeRentals.length === 0 && expiredRentals.length === 0" 
             class="text-center py-5">
          <i class="bi bi-clock text-white-50" style="font-size: 4rem;"></i>
          <h3 class="text-white mt-3">No rentals yet</h3>
          <p class="text-white-50">Start your film journey today.</p>
          <a routerLink="/browse" class="btn btn-rust mt-3">Browse Films</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-vixen {
      background: rgba(47,68,56,0.3);
      border: 1px solid rgba(245,238,225,0.08);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .card-vixen:hover {
      transform: translateY(-4px);
      border-color: rgba(245,238,225,0.15);
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
  `]
})
export class MyRentalsComponent implements OnInit {
  activeRentals: Rental[] = [];
  expiredRentals: Rental[] = [];

  constructor(private rentalService: RentalService) {}

  ngOnInit() {
    this.loadRentals();
  }

  loadRentals() {
    this.rentalService.getActiveRentals().subscribe(rentals => {
      this.activeRentals = rentals.filter(r => {
        const expiry = new Date(r.rental_expiry).getTime();
        return expiry > Date.now();
      });
    });

    this.rentalService.getExpiredRentals().subscribe(rentals => {
      this.expiredRentals = rentals;
    });
  }
}