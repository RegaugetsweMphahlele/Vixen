import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-vixen-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar fixed-top navbar-expand-lg py-2" 
         style="background: rgba(27,26,23,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(245,238,225,0.06);">
      <div class="container">
        <a class="navbar-brand font-display fw-light" style="color: #F5EEE1; font-size: 1.5rem; letter-spacing: -0.02em;" routerLink="/">
          VI<span style="color: #BB5F3A;">X</span>EN
        </a>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent" 
                style="border-color: rgba(255,255,255,0.1);">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navContent">
          <ul class="navbar-nav ms-auto align-items-center gap-2 gap-lg-3">
            <li class="nav-item">
              <a class="nav-link" routerLink="/browse" routerLinkActive="active" 
                 style="color: rgba(245,238,225,0.7); transition: color 0.3s ease; padding: 0.5rem 0.75rem; font-size: 0.95rem;"
                 (mouseenter)="onNavHover($event, true)"
                 (mouseleave)="onNavHover($event, false)">
                Browse
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/my-rentals" routerLinkActive="active" 
                 style="color: rgba(245,238,225,0.7); transition: color 0.3s ease; padding: 0.5rem 0.75rem; font-size: 0.95rem;"
                 (mouseenter)="onNavHover($event, true)"
                 (mouseleave)="onNavHover($event, false)">
                My Rentals
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active"
                 style="color: rgba(245,238,225,0.7); transition: color 0.3s ease; padding: 0.5rem 0.75rem;"
                 (mouseenter)="onNavHover($event, true)"
                 (mouseleave)="onNavHover($event, false)">
                <i class="bi bi-cart3 fs-5"></i>
                <span *ngIf="cartCount > 0" 
                      class="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style="background: #BB5F3A; color: #F5EEE1; font-size: 0.6rem; padding: 0.35rem 0.6rem; min-width: 20px;">
                  {{ cartCount }}
                </span>
              </a>
            </li>
            
            <li class="nav-item" *ngIf="auth.isAuthenticated()">
              <span class="badge rounded-pill px-3 py-2" 
                    style="background: #2F4438; color: #F5EEE1; font-weight: 400; font-size: 0.85rem;">
                👤 {{ getUserName() }}
              </span>
            </li>
            
            <li class="nav-item" *ngIf="auth.isAuthenticated() && auth.isAdmin()">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active"
                 style="color: rgba(245,238,225,0.7); transition: color 0.3s ease; padding: 0.5rem 0.75rem; font-size: 0.9rem;"
                 (mouseenter)="onNavHover($event, true)"
                 (mouseleave)="onNavHover($event, false)">
                ⚙️ Admin
              </a>
            </li>
            
            <li class="nav-item">
              <button class="btn btn-sm" (click)="logout()" 
                      style="background: transparent; border: none; color: rgba(245,238,225,0.5); transition: color 0.3s ease; padding: 0.5rem 0.75rem;"
                      (mouseenter)="onButtonHover($event, true)"
                      (mouseleave)="onButtonHover($event, false)">
                <i class="bi bi-box-arrow-right fs-5"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link.active {
      color: #F5EEE1 !important;
      font-weight: 500;
    }
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: #BB5F3A;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      width: 70%;
    }
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
  `]
})
export class VixenNavComponent implements OnInit {
  cartCount = 0;

  constructor(public auth: AuthService, private rentalService: RentalService) {}

  ngOnInit() {
    this.rentalService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  getUserName(): string {
    const user = this.auth.getCurrentUser();
    if (user && user.full_name) {
      const names = user.full_name.split(' ');
      return names.length > 1 ? names[0] + ' ' + names[names.length - 1][0] + '.' : names[0];
    }
    return 'User';
  }

  onNavHover(event: Event, isHovering: boolean) {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.color = isHovering ? '#F5EEE1' : 'rgba(245,238,225,0.7)';
    }
  }

  onButtonHover(event: Event, isHovering: boolean) {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.color = isHovering ? '#F5EEE1' : 'rgba(245,238,225,0.5)';
    }
  }

  logout() {
    this.auth.logout();
  }
}