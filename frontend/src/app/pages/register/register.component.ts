import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex" style="background: #1B1A17;">
      <!-- Left Panel -->
      <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5" 
           style="background: #2F4438; min-height: 100vh; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50%; right: -20%; width: 80%; height: 200%; background: rgba(187,95,58,0.08); border-radius: 50%;"></div>
        <div style="position: relative; z-index: 1;">
          <div class="font-display fw-light text-white" style="font-size: 4.5rem; letter-spacing: -0.02em;">
            VI<span style="color: #BB5F3A;">X</span>EN
          </div>
          <p class="font-body mt-3" style="color: #8B9A82; font-size: 1.2rem; max-width: 300px; line-height: 1.6;">
            Join the boutique film community.
          </p>
          <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <span style="width: 40px; height: 2px; background: #BB5F3A;"></span>
            <span style="color: #8B9A82; font-size: 0.9rem;">Create your account</span>
          </div>
        </div>
      </div>
      
      <!-- Right Panel -->
      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4" 
           style="background: #1B1A17; min-height: 100vh;">
        <div class="w-100" style="max-width: 420px;">
          <div class="mb-4">
            <h2 class="font-display fw-light text-white" style="font-size: 2.5rem;">
              {{ step === 1 ? 'Create your account' : 'Verify your email' }}
            </h2>
            <p class="text-white-50" style="font-size: 0.95rem;">
              {{ step === 1 ? 'Join the VIXEN community.' : 'Enter the 6-digit code sent to your email.' }}
            </p>
            <p *ngIf="authError" class="small mt-3 mb-0" style="color: #ffb199;">{{ authError }}</p>
          </div>
          
          <!-- Step 1: Registration -->
          <form *ngIf="step === 1" (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="mb-3">
              <label class="text-white-50 small mb-1 fw-semibold" style="font-size: 0.8rem; letter-spacing: 0.05em;">FULL NAME</label>
              <input type="text" 
                     class="form-control bg-transparent text-white" 
                     [(ngModel)]="fullName" 
                     name="fullName" 
                     placeholder="John Doe" 
                     required
                     style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); color: #F5EEE1 !important;">
            </div>
            
            <div class="mb-3">
              <label class="text-white-50 small mb-1 fw-semibold" style="font-size: 0.8rem; letter-spacing: 0.05em;">EMAIL ADDRESS</label>
              <input type="email" 
                     class="form-control bg-transparent text-white" 
                     [(ngModel)]="email" 
                     name="email" 
                     placeholder="you@example.com" 
                     required
                     style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); color: #F5EEE1 !important;">
            </div>
            
            <div class="mb-3">
              <label class="text-white-50 small mb-1 fw-semibold" style="font-size: 0.8rem; letter-spacing: 0.05em;">PASSWORD</label>
              <input type="password" 
                     class="form-control bg-transparent text-white" 
                     [(ngModel)]="password" 
                     name="password" 
                     placeholder="Min 6 characters" 
                     required
                     minlength="6"
                     style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); color: #F5EEE1 !important;">
            </div>
            
            <div class="mb-4">
              <label class="text-white-50 small mb-1 fw-semibold" style="font-size: 0.8rem; letter-spacing: 0.05em;">CONFIRM PASSWORD</label>
              <input type="password" 
                     class="form-control bg-transparent text-white" 
                     [(ngModel)]="confirmPassword" 
                     name="confirmPassword" 
                     placeholder="Confirm your password" 
                     required
                     style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); color: #F5EEE1 !important;">
            </div>
            
            <button type="submit" class="btn btn-rust w-100 py-3" 
                    [disabled]="registerForm.invalid || password !== confirmPassword"
                    style="font-size: 1rem; font-weight: 600; border-radius: 8px;">
              Create Account
            </button>
          </form>
          
          <!-- Step 2: OTP Verification -->
          <div *ngIf="step === 2" class="text-center">
            <div class="mb-4">
              <div style="width: 80px; height: 80px; background: rgba(187,95,58,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <i class="bi bi-envelope-paper" style="font-size: 2rem; color: #BB5F3A;"></i>
              </div>
              <p class="text-white-50 mt-3" style="font-size: 0.95rem;">
                We've sent a 6-digit code to <br><strong class="text-white">{{ email }}</strong>
              </p>
            </div>
            
            <div class="d-flex justify-content-center gap-2 mb-4">
              <input *ngFor="let i of [0,1,2,3,4,5]" 
                     type="text"
                     maxlength="1"
                     class="form-control bg-transparent text-white border-secondary text-center"
                     style="width: 50px; height: 60px; font-size: 1.5rem; background: rgba(255,255,255,0.05) !important; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); color: #F5EEE1 !important;"
                     [(ngModel)]="otpArray[i]"
                     (input)="onOtpInput($event, i)"
                     (keydown)="onOtpKeydown($event, i)">
            </div>
            
            <button class="btn btn-rust w-100 py-3" 
                    (click)="verifyOtp()" 
                    [disabled]="otpArray.some(d => !d)"
                    style="font-size: 1rem; font-weight: 600; border-radius: 8px;">
              Verify Email
            </button>
            
            <button class="btn btn-link text-white-50 w-100 mt-2" 
                    (click)="resendOtp()"
                    style="text-decoration: none; font-size: 0.95rem;">
              <i class="bi bi-arrow-repeat me-1"></i> Resend Code
            </button>
          </div>
          
          <div class="position-relative my-4" *ngIf="step === 1">
            <hr style="border-color: rgba(255,255,255,0.08);">
            <span class="position-absolute top-50 start-50 translate-middle px-3" 
                  style="background: #1B1A17; color: #8B9A82; font-size: 0.85rem;">
              or
            </span>
          </div>
          
          <button class="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2" 
                  *ngIf="step === 1"
                  style="background: rgba(255,255,255,0.05); color: #F5EEE1; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; transition: all 0.3s ease;"
                  (click)="googleLogin()"
                  (mouseenter)="$any($event.target).style.background = 'rgba(255,255,255,0.1)'"
                  (mouseleave)="$any($event.target).style.background = 'rgba(255,255,255,0.05)'">
            <i class="bi bi-google" style="font-size: 1.2rem;"></i>
            Continue with Google
          </button>
          
          <p class="text-center mt-4" style="color: #8B9A82; font-size: 0.95rem;">
            Already have an account? 
            <a routerLink="/login" class="text-decoration-none" style="color: #BB5F3A; font-weight: 600; transition: color 0.3s ease;"
               (mouseenter)="$any($event.target).style.color = '#d47a4a'"
               (mouseleave)="$any($event.target).style.color = '#BB5F3A'">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-rust {
      background-color: #BB5F3A;
      color: #F5EEE1;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn-rust:hover:not(:disabled) {
      transform: scale(1.02);
      background-color: #a54f2f;
      color: #F5EEE1;
    }
    .btn-rust:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .form-control {
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
    .form-control:focus {
      border-color: #BB5F3A !important;
      box-shadow: 0 0 0 3px rgba(187,95,58,0.2) !important;
    }
  `]
})
export class RegisterComponent {
  step = 1;
  email = '';
  password = '';
  confirmPassword = '';
  fullName = '';
  authError = '';
  otpArray: string[] = ['', '', '', '', '', ''];

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.authError = '';
    this.auth.register(this.email, this.password, this.fullName).subscribe({
      next: () => {
        this.step = 2;
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.authError = 'Unable to create your account. Check your details and try again.';
      }
    });
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 5) {
      const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeydown(event: any, index: number) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      const prevInput = event.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) prevInput.focus();
    }
  }

  verifyOtp() {
    const otp = this.otpArray.join('');
    this.auth.verifyOtp(this.email, otp).subscribe({
      next: () => this.router.navigate(['/browse']),
      error: (err) => console.error('OTP verification failed', err)
    });
  }

  resendOtp() {
    this.auth.register(this.email, this.password, this.fullName).subscribe({
      next: () => console.log('OTP resent'),
      error: (err) => console.error('Resend failed', err)
    });
  }

  googleLogin() {
    this.authError = '';
    this.auth.googleLogin().subscribe({
      next: () => this.router.navigate(['/browse']),
      error: (err) => {
        console.error('Google login failed', err);
        this.authError = 'Google sign-in is unavailable right now. Please try again later.';
      }
    });
  }
}