import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: #1B1A17;">
      <div class="w-100" style="max-width: 400px; padding: 2rem;">
        <div class="text-center mb-4">
          <div class="font-display fw-light text-white" style="font-size: 2.5rem;">VIXEN</div>
          <p class="text-white-50 mt-2">Create new password</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
          <div class="mb-3">
            <input type="password" 
                   class="form-control bg-transparent text-white border-secondary" 
                   [(ngModel)]="newPassword" 
                   name="newPassword" 
                   placeholder="New password" 
                   required
                   minlength="6"
                   style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
          </div>
          
          <div class="mb-3">
            <input type="password" 
                   class="form-control bg-transparent text-white border-secondary" 
                   [(ngModel)]="confirmPassword" 
                   name="confirmPassword" 
                   placeholder="Confirm new password" 
                   required
                   style="background: rgba(255,255,255,0.05) !important; border-radius: 8px; padding: 12px;">
          </div>
          
          <button type="submit" class="btn btn-rust w-100 py-2" 
                  [disabled]="resetForm.invalid || newPassword !== confirmPassword">
            Update Password
          </button>
        </form>
        
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
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Password reset failed', err)
    });
  }
}