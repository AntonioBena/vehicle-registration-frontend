import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UserDto } from '../../models/UserDto';

import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '../../service/auth/CredentialsService';
import { ToastrService } from '../../service/toastr.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{
  accountForm: FormGroup;

  name: string = '';
  user: any = {};

  accountId!: string;
  firstName!: string;

  constructor(private fb: FormBuilder, private router: Router,
    public route: ActivatedRoute, private credentialsService: CredentialsService,
    private toastr: ToastrService
  ) {
    this.accountForm = this.fb.group({
      accountId: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {

    this.user = history.state.user;
    console.log('Received user:', this.user);

    this.name = this.setUserNameOrAccountId(this.user);

  }


  registerNewVehicle() {}

  getMyRegisteredVehicles() {}

  setUserNameOrAccountId(user: UserDto){
    return user.firstName === null || user.firstName.length < 1 ?
    user.accountId : user.firstName;
  }

  onLogout() {
    this.credentialsService.userCredentials = '';
    console.log('logged off!');
    this.showToast('info', 'Succesfully logged off!');
    this.router.navigate(['']);
  }


  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, "top-right", true);
  }
}
