import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, VixenNavComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <div class="container py-4">
        <h1 class="font-display fw-light text-white mb-4">Your Cart</h1>
        
        <!-- Empty State -->
        <div *ngIf="cartItems.length === 0" class="text-center py-5">
          <i class="bi bi-bag text-white-50" style="font-size: 4rem;"></i>
          <h3 class="text-white mt-3">Your cart is empty</h3>
          <p class="text-white-50">Browse our collection and add some films to rent.</p>
          <a routerLink="/browse" class="btn btn-rust mt-3">Browse Films</a>
        </div>
        
        <!-- Cart Items -->
        <div *ngIf="cartItems.length > 0">
          <div class="row">
            <div class="col-lg-8">
              <div *ngFor="let item of cartItems" class="card-vixen p-3 mb-3 d-flex align-items-center gap-3">
                <img [src]="item.movie_poster" 
                     [alt]="item.movie_title"
                     style="width: 80px; height: 120px; object-fit: cover; border-radius: 8px;">
                
                <div class="flex-grow-1">
                  <h5 class="text-white mb-0">{{ item.movie_title }}</h5>
                  <span class="text-sage">{{ item.rental_duration_hours }}h access after checkout</span>
                </div>
                
                <div class="text-end">
                  <div class="text-white font-display" style="font-size: 1.25rem;">
                    R{{ item.amount_paid.toFixed(2) }}
                  </div>
                  <button class="btn btn-sm btn-outline-danger" (click)="removeFromCart(item.id!)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="col-lg-4">
              <div class="card-vixen p-4" style="position: sticky; top: 100px;">
                <h5 class="text-white mb-3">Order Summary</h5>
                <div class="d-flex justify-content-between text-white-50 mb-2">
                  <span>Subtotal</span>
                  <span>R{{ total.toFixed(2) }}</span>
                </div>
                <hr class="hairline-light">
                <div class="d-flex justify-content-between text-white mb-3">
                  <span class="font-display fw-light">Total</span>
                  <span class="font-display" style="color: #BB5F3A; font-size: 1.5rem;">
                    R{{ total.toFixed(2) }}
                  </span>
                </div>
                <a routerLink="/checkout" class="btn btn-rust w-100">
                  Proceed to Checkout →
                </a>
              </div>
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
    .btn-outline-danger {
      border-color: rgba(187,95,58,0.3);
      color: #BB5F3A;
    }
    .btn-outline-danger:hover {
      background: #BB5F3A;
      color: #F5EEE1;
    }
    .hairline-light {
      border: 0;
      border-top: 1px solid rgba(245,238,225,0.08);
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: Rental[] = [];
  total = 0;

  constructor(private rentalService: RentalService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.rentalService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.amount_paid, 0);
    });
  }

  removeFromCart(id: string) {
    this.rentalService.removeFromCart(id).subscribe(() => {
      this.loadCart();
    });
  }
}