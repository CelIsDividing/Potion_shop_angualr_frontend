import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Korisnik je ulogovan, dozvoli pristup
  }

  // Korisnik nije ulogovan, preusmeri ga na login
  return router.parseUrl('/login');
};