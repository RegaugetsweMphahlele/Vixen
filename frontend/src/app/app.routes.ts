import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'browse', loadComponent: () => import('./pages/browse/browse.component').then(m => m.BrowseComponent), canActivate: [AuthGuard] },
  { path: 'movie/:id', loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent), canActivate: [AuthGuard] },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), canActivate: [AuthGuard] },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [AuthGuard] },
  { path: 'my-rentals', loadComponent: () => import('./pages/my-rentals/my-rentals.component').then(m => m.MyRentalsComponent), canActivate: [AuthGuard] },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '' }
];