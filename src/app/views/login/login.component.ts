import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ToastrService } from '../../service/toastr.service';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../service/auth/AuthService';
import { AuthenticationRequest } from '../../models/AuthenticationRequest';
import { CredentialsService } from '../../service/auth/CredentialsService';
import { emailValidator } from '../../validation/EmailValidator';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private toastr: ToastrService,
    private credentialsService: CredentialsService
     ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required]]
    });
  }

  onRegisterLink(){
    this.router.navigate(['/register']);
  }

  onLogin() {
    if (this.loginForm.valid) {
      var auth = new AuthenticationRequest();
      auth.accountId = this.loginForm.value.email;
      auth.password = this.loginForm.value.password;

      this.authService
        .login(auth)
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.showToast('error', 'Please check your credentials');
            }
            console.error('Login error:' + error);
            return throwError(() => new Error('Login error ' + error));
          })
        )
        .subscribe((resp) => {
          console.log("Login ", resp);
          this.showToast('success', 'Loged in!');
          //TODO route to verification
          this.credentialsService.userCredentials = auth;
          this.showToast('success', 'Successfully logged in!');
          this.router.navigate(['/dashboard'], {
            state: { user: resp.data }
          });

        });
    }
  }

  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, "top-right", true);
  }
}
