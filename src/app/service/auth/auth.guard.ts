import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const creds = localStorage.getItem('credentials');
  if (creds) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
