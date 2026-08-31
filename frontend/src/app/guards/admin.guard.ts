import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  if (auth.isAdmin()) {
    return true;
  }

  // If not admin, redirect to browse
  return router.parseUrl('/browse');
};