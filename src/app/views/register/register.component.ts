import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../service/auth/AuthService';
import { ToastrService } from '../../service/toastr.service';
import { RegistrationRequest } from '../../models/RegistrationRequest';
import { emailValidator } from '../../validation/EmailValidator';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      firstName: [''],
      lastName: [''],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      var auth = new RegistrationRequest();
      auth.firstName = this.registerForm.value.firstName;
      auth.lastName = this.registerForm.value.lastName;
      auth.accountId = this.registerForm.value.email;

      this.authService
        .register(auth)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('error', 'Please check your inputs');
            }
            else if(error.status === 401){
            this.showToast('error', 'Registration error!');
            }
            console.error('Register error:');
            return throwError(() => new Error('Register error ' + error));
          })
        )
        .subscribe((data) => {
          this.showToast('success', 'Account is now activated');
          //TODO route to verification
          console.log("data from register")
          console.log(data)
          this.router.navigate(['/active'], { queryParams: { accountId: auth.accountId, password: data.password } } );
        });
    }
  }

  onLoginLink() {
    this.router.navigate(['']);
  }

  showToast(type: string, error: string) {
    this.toastr.showToast(type, error, 'top-right', true);
  }
}
