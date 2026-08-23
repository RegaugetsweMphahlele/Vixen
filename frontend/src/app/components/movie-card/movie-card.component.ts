import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { Rental } from '../../models/rental.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card-vixen position-relative overflow-hidden" 
         style="border-radius: 16px; cursor: pointer; background: rgba(47,68,56,0.3); border: 1px solid rgba(245,238,225,0.06); transition: all 0.3s ease;"
         [routerLink]="['/movie', movie.id]"
         (mouseenter)="onCardHover($event, true)"
         (mouseleave)="onCardHover($event, false)">
      
      <div class="position-relative" style="aspect-ratio: 2/3; overflow: hidden;">
        <img [src]="movie.poster_url" [alt]="movie.title" 
             class="w-100 h-100" 
             style="object-fit: cover; transition: transform 0.5s ease;"
             (error)="handleImageError($event)">
        
        <!-- Rating Badge -->
        <div class="position-absolute top-0 end-0 m-2 px-2 py-1 rounded" 
             style="background: rgba(27,26,23,0.85); backdrop-filter: blur(4px); border: 1px solid rgba(245,238,225,0.1);">
          <span style="color: #D9A441; font-size: 0.8rem;">★</span>
          <span class="text-white" style="font-size: 0.8rem; font-weight: 500;">{{ movie.rating || 'N/A' }}</span>
        </div>
        
        <!-- Status Badges -->
        <div *ngIf="userRental" class="position-absolute top-0 start-0 m-2">
          <span *ngIf="userRental.status === 'active'" 
                class="badge px-3 py-2" 
                style="background: #8B9A82; color: #1B1A17; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.05em;">
            RENTED
          </span>
          <span *ngIf="userRental.status === 'cart'" 
                class="badge px-3 py-2" 
                style="background: #D9A441; color: #1B1A17; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.05em;">
            IN CART
          </span>
        </div>
        
        <!-- Hover Overlay -->
        <div #hoverOverlay class="position-absolute bottom-0 start-0 w-100 p-3" 
             style="background: linear-gradient(to top, rgba(27,26,23,0.95), transparent); 
                    opacity: 0; transition: opacity 0.3s ease;"
             (mouseenter)="showOverlay(hoverOverlay)"
             (mouseleave)="hideOverlay(hoverOverlay)">
          <button class="btn w-100 py-2" 
                  [ngClass]="getButtonClass()"
                  style="border-radius: 9999px; font-weight: 600; font-size: 0.9rem;"
                  (click)="$event.stopPropagation(); onActionClick()">
            {{ getButtonText() }}
          </button>
        </div>
      </div>
      
      <div class="p-3">
        <h6 class="font-display fw-light text-white mb-0" style="font-size: 1rem; line-height: 1.3;">
          {{ movie.title }}
        </h6>
        <div class="d-flex justify-content-between align-items-center mt-1">
          <span class="text-sage" style="font-size: 0.8rem;">{{ movie.year }} · {{ movie.genre }}</span>
          <span *ngIf="movie.rating" style="color: #D9A441; font-size: 0.8rem;">
            ★ {{ movie.rating }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-vixen {
      transition: transform 0.3s ease, border-color 0.3s ease;
      height: 100%;
    }
    .card-vixen:hover {
      transform: translateY(-6px);
      border-color: rgba(245,238,225,0.2);
    }
    .card-vixen:hover .hover-overlay {
      opacity: 1 !important;
    }
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-rust:hover {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .btn-success {
      background-color: #8B9A82;
      color: #1B1A17;
      border: none;
    }
    .btn-success:hover {
      background-color: #7a8a72;
    }
    .btn-warning {
      background-color: #D9A441;
      color: #1B1A17;
      border: none;
    }
    .btn-warning:hover {
      background-color: #c8943a;
    }
    .text-sage { color: #8B9A82; }
  `]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() userRental?: Rental | null;
  @Output() actionClick = new EventEmitter<Movie>();

  onCardHover(event: Event, isHovering: boolean) {
    const card = event.currentTarget as HTMLElement;
    if (card) {
      if (isHovering) {
        card.style.transform = 'translateY(-6px)';
        card.style.borderColor = 'rgba(245,238,225,0.2)';
      } else {
        card.style.transform = 'translateY(0)';
        card.style.borderColor = 'rgba(245,238,225,0.06)';
      }
    }
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80';
    }
  }

  showOverlay(element: HTMLElement) {
    if (element) {
      element.style.opacity = '1';
    }
  }

  hideOverlay(element: HTMLElement) {
    if (element) {
      element.style.opacity = '0';
    }
  }

  getButtonClass(): string {
    if (this.userRental?.status === 'active') {
      return 'btn-success';
    } else if (this.userRental?.status === 'cart') {
      return 'btn-warning';
    }
    return 'btn-rust';
  }

  getButtonText(): string {
    if (this.userRental?.status === 'active') {
      return '▶ Watch Now';
    } else if (this.userRental?.status === 'cart') {
      return '🛒 In Cart';
    }
    return 'Rent R' + this.movie.rental_price.toFixed(2);
  }

  onActionClick() {
    // Emit the action to the parent component
    this.actionClick.emit(this.movie);
  }
}