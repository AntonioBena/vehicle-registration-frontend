import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth/AuthService';
import { ToastrService } from '../../service/toastr.service';

@Component({
  selector: 'app-active',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './active.component.html',
  styleUrl: './active.component.css'
})
export class ActiveComponent {

  accountId: string = '';
  password: string = '';

  constructor(
    private router: Router,
    public route: ActivatedRoute
  ){

    this.route.queryParams.subscribe(params => {
      this.accountId = params['accountId'];
      this.password = params['password'];
    });
  }

  backToLogin(){
    this.router.navigate(['']);
  }

}
