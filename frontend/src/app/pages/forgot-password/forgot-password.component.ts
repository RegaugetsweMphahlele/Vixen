import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: #1B1A17;">
      <div class="w-100" style="max-width: 400px; padding: 2rem;">
        <div class="text-center mb-4">
          <div class="font-display fw-light text-white" style="font-size: 2.5rem;">VIXEN</div>
          <p class="text-white-50 mt-2">Reset your password</p>
        </div>
        
        <div *ngIf="!success">
          <p class="text-white-50 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
            <div class="mb-3">
              <input type="email" 
                     class="form-control bg-transparent text-white border-secondary" 
                     [(ngModel)]="email" 
                     name="email" 
                     placeholder="Email address" 
                     required
                     style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
            </div>
            
            <button type="submit" class="btn btn-rust w-100 py-2" [disabled]="resetForm.invalid">
              Send Reset Link
            </button>
          </form>
        </div>
        
        <div *ngIf="success" class="text-center">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
          <h4 class="text-white mt-3">Check your inbox</h4>
          <p class="text-white-50">We've sent a password reset link to your email address.</p>
        </div>
        
        <p class="text-center mt-4">
          <a routerLink="/login" class="text-decoration-none" style="color: #8B9A82;">
            <i class="bi bi-arrow-left"></i> Back to Sign In
          </a>
        </p>
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
      transition: transform 0.2s ease;
    }
    .btn-rust:hover {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .form-control {
      border-color: rgba(245,238,225,0.2) !important;
    }
    .form-control:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 2px rgba(187,95,58,0.2) !important;
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  success = false;

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.forgotPassword(this.email).subscribe({
      next: () => this.success = true,
      error: (err) => console.error('Password reset request failed', err)
    });
  }
}