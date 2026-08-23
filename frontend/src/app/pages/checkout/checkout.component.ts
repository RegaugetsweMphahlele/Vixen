import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental.model';
import { VixenNavComponent } from '../../components/vixen-nav/vixen-nav.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, VixenNavComponent],
  template: `
    <app-vixen-nav></app-vixen-nav>
    
    <div class="dark-theme" style="min-height: 100vh; padding-top: 72px;">
      <div class="container py-4">
        <h1 class="font-display fw-light text-white mb-4">Checkout</h1>
        
        <div *ngIf="!success">
          <div class="row g-4">
            <!-- Payment Form -->
            <div class="col-lg-8">
              <div class="card-vixen p-4">
                <h5 class="text-white mb-3">Payment Details</h5>
                
                <form #paymentForm="ngForm" (ngSubmit)="onSubmit()">
                  <p *ngIf="paymentError" class="small mb-3" style="color: #ffb199;">{{ paymentError }}</p>
                  <div class="mb-3">
                    <label class="text-white-50 small">Cardholder Name</label>
                    <input type="text" 
                           class="form-control bg-transparent text-white border-secondary" 
                           [(ngModel)]="cardholderName" 
                           name="cardholderName" 
                           required
                           style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                  </div>
                  
                  <div class="mb-3">
                    <label class="text-white-50 small">Card Number</label>
                    <input type="text" 
                           class="form-control bg-transparent text-white border-secondary" 
                           [(ngModel)]="cardNumber" 
                           name="cardNumber" 
                           required
                           pattern="[0-9 ]{16,19}"
                           maxlength="19"
                           inputmode="numeric"
                           (input)="formatCardNumber($event)"
                           placeholder="1234 5678 9012 3456"
                           style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                  </div>
                  
                  <div class="row g-3">
                    <div class="col-6">
                      <label class="text-white-50 small">Expiry (MM/YY)</label>
                      <input type="text" 
                             class="form-control bg-transparent text-white border-secondary" 
                             [(ngModel)]="expiry" 
                             name="expiry" 
                             required
                             pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                             maxlength="5"
                             inputmode="numeric"
                             (input)="formatExpiry($event)"
                             placeholder="MM/YY"
                             style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                    </div>
                    <div class="col-6">
                      <label class="text-white-50 small">CVV</label>
                      <input type="password" 
                             class="form-control bg-transparent text-white border-secondary" 
                             [(ngModel)]="cvv" 
                             name="cvv" 
                             required
                             pattern="[0-9]{3,4}"
                             maxlength="4"
                             style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <label class="text-white-50 small">Billing Address</label>
                    <input type="text" 
                           class="form-control bg-transparent text-white border-secondary mb-2" 
                           [(ngModel)]="address" 
                           name="address" 
                           required
                           placeholder="Street address"
                           style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                    
                    <div class="row g-2">
                      <div class="col-6">
                        <input type="text" 
                               class="form-control bg-transparent text-white border-secondary" 
                               [(ngModel)]="city" 
                               name="city" 
                               required
                               placeholder="City"
                               style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                      </div>
                      <div class="col-6">
                        <input type="text" 
                               class="form-control bg-transparent text-white border-secondary" 
                               [(ngModel)]="postalCode" 
                               name="postalCode" 
                               required
                               placeholder="Postal code"
                               style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <select class="form-select bg-transparent text-white border-secondary" 
                            [(ngModel)]="country" 
                            name="country" 
                            required
                            style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
                      <option value="">Select country</option>
                      <option value="South Africa">South Africa</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="col-lg-4">
              <div class="card-vixen p-4" style="position: sticky; top: 100px;">
                <h5 class="text-white mb-3">Order Summary</h5>
                
                <div *ngFor="let item of cartItems" class="d-flex justify-content-between text-white-50 mb-2">
                  <span>{{ item.movie_title }}</span>
                  <span>R{{ item.amount_paid.toFixed(2) }}</span>
                </div>
                
                <hr class="hairline-light">
                
                <div class="d-flex justify-content-between text-white mb-3">
                  <span class="font-display fw-light">Total</span>
                  <span class="font-display" style="color: #BB5F3A; font-size: 1.5rem;">
                    R{{ total.toFixed(2) }}
                  </span>
                </div>
                
                <button class="btn btn-rust w-100" 
                        (click)="onSubmit()" 
                  [disabled]="cartItems.length === 0 || isProcessing">
                  {{ isProcessing ? 'Processing...' : 'Pay R' + total.toFixed(2) + ' & Rent Now' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Success State -->
        <div *ngIf="success" class="text-center py-5">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          <h2 class="font-display fw-light text-white mt-3">Rental Confirmed!</h2>
          <p class="text-white-50">You now have access to these films:</p>
          
          <div class="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <div *ngFor="let item of cartItems" class="card-vixen p-2" style="width: 150px;">
              <img [src]="item.movie_poster" 
                   [alt]="item.movie_title"
                   style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
              <p class="text-white small text-center mt-2">{{ item.movie_title }}</p>
            </div>
          </div>
          
          <a routerLink="/my-rentals" class="btn btn-rust mt-4">Go to My Rentals</a>
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
    .btn-rust:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .form-control, .form-select {
      border-color: rgba(245,238,225,0.2) !important;
      color: #F5EEE1 !important;
      -webkit-text-fill-color: #F5EEE1 !important;
      caret-color: #F5EEE1;
    }
    .form-control::placeholder {
      color: rgba(245,238,225,0.7) !important;
      opacity: 1;
    }
    .form-control:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #1B1A17 inset !important;
      -webkit-text-fill-color: #F5EEE1 !important;
    }
    .form-control:focus, .form-select:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 2px rgba(187,95,58,0.2) !important;
    }
    .hairline-light {
      border: 0;
      border-top: 1px solid rgba(245,238,225,0.08);
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: Rental[] = [];
  total = 0;
  success = false;
  isProcessing = false;

  cardholderName = '';
  cardNumber = '';
  expiry = '';
  cvv = '';
  address = '';
  city = '';
  postalCode = '';
  country = '';
  paymentError = '';

  constructor(private rentalService: RentalService, private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.rentalService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.amount_paid, 0);
      
      if (items.length === 0) {
        this.router.navigate(['/browse']);
      }
    });
  }

  onSubmit() {
    this.paymentError = '';
    if (this.cartItems.length === 0 || this.isProcessing) return;

    this.cardNumber = this.cardNumber.replace(/\s/g, '');
    if (!this.cardholderName || !/^\d{16}$/.test(this.cardNumber) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiry) ||
        !/^\d{3,4}$/.test(this.cvv) || !this.address || !this.city ||
        !this.postalCode || !this.country) {
      this.paymentError = 'Please complete all payment and billing details correctly.';
      return;
    }
    
    this.isProcessing = true;
    
    setTimeout(() => {
      this.rentalService.checkout().subscribe({
        next: () => {
          this.success = true;
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('Checkout failed', err);
          this.isProcessing = false;
        }
      });
    }, 1500);
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    this.expiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }
}