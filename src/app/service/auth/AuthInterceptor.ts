import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const creds = localStorage.getItem("credentials");

  const router = inject(Router);

  // Only intercept requests to the specific API endpoint
  if (!req.url.startsWith('http://localhost:8009/api/v1/account')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${creds}`
      }
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized request, redirecting to login...");
          localStorage.removeItem("credentials");
          router.navigate(['']);
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
